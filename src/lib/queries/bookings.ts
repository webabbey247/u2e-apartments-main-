import "server-only";
import { prisma } from "@/lib/prisma";
import type { RoomType } from "@/generated/prisma/enums";
import { occupiedUnitsByType, roomTypeFor } from "@/lib/queries/availability";
import { nightsBetween } from "@/schemas/booking";
import type { CreateBookingInput } from "@/schemas/booking";

/** A requested line resolved against a live CRM room. */
type ResolvedLine = {
  slug: string;
  title: string;
  qty: number;
  guests: number;
  addExtraBed: boolean;
  extraBeds: number;
  roomType: RoomType;
  priceFrom: number;
  units: number;
  extraBedPrice: number;
  offersExtraBed: boolean;
};

export type BookingResult =
  | { ok: true; reservationNumber: string; amount: number }
  | { ok: false; status: number; error: string };

/** `U2E-######`, matching the CRM/event reservation-number format. */
function makeReservationNumber(): string {
  let s = "";
  for (let i = 0; i < 6; i++) s += Math.floor(Math.random() * 10);
  return `U2E-${s}`;
}

async function uniqueReservationNumber(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const n = makeReservationNumber();
    const clash = await prisma.booking.findUnique({
      where: { reservationNumber: n },
      select: { id: true },
    });
    if (!clash) return n;
  }
  // Astronomically unlikely; widen the space rather than fail the booking.
  return `U2E-${Date.now().toString().slice(-8)}`;
}

/**
 * Create a multi-room reservation: server-side availability re-check + pricing,
 * then one `Reservation` (primary room for backward-compat) plus one
 * `ReservationRoom` line per room, in a transaction. The client's price is
 * never trusted — the amount is computed here from live CRM rates.
 */
export async function createBooking(
  input: CreateBookingInput,
  ip?: string | null,
): Promise<BookingResult> {
  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights <= 0) return { ok: false, status: 400, error: "Invalid stay dates." };

  // Resolve every requested room against the CRM catalogue.
  const rooms = await prisma.room.findMany({
    where: { slug: { in: input.rooms.map((r) => r.slug) }, active: true },
    select: {
      slug: true, title: true, bedrooms: true, sleeps: true, priceFrom: true,
      units: true, extraBed: true, extraBedPrice: true, extraBedMax: true,
    },
  });
  const bySlug = new Map(rooms.map((r) => [r.slug, r]));

  const lines: ResolvedLine[] = [];
  for (const req of input.rooms) {
    const room = bySlug.get(req.slug);
    if (!room) return { ok: false, status: 404, error: `Room "${req.slug}" is unavailable.` };
    const roomType = roomTypeFor(room.bedrooms);
    if (!roomType) {
      return { ok: false, status: 422, error: `"${room.title}" cannot be booked online yet.` };
    }
    // Guest capacity is the room's DB `sleeps` × the number of rooms booked.
    const capacity = room.sleeps * req.qty;
    if (req.guests > capacity) {
      return {
        ok: false,
        status: 422,
        error: `${room.title} sleeps up to ${capacity} guest${capacity === 1 ? "" : "s"} for ${req.qty} room${req.qty === 1 ? "" : "s"}.`,
      };
    }
    // Extra beds capped at the room's DB max × the number of rooms booked.
    const bedCap = room.extraBedMax * req.qty;
    if (req.extraBed && req.extraBeds > bedCap) {
      return {
        ok: false,
        status: 422,
        error: `${room.title}: up to ${bedCap} extra bed${bedCap === 1 ? "" : "s"} for ${req.qty} room${req.qty === 1 ? "" : "s"}.`,
      };
    }
    lines.push({
      slug: room.slug,
      title: room.title,
      qty: req.qty,
      guests: req.guests,
      // Only honour an extra bed if the room actually offers one.
      addExtraBed: req.extraBed && room.extraBed,
      extraBeds: req.extraBeds,
      roomType,
      priceFrom: room.priceFrom,
      units: room.units,
      extraBedPrice: room.extraBedPrice,
      offersExtraBed: room.extraBed,
    });
  }

  // Server-authoritative availability: aggregate requested qty per bucket and
  // compare against inventory minus current occupancy.
  const occupied = await occupiedUnitsByType(input.checkIn, input.checkOut);
  const requestedByType = new Map<RoomType, number>();
  const unitsByType = new Map<RoomType, number>();
  for (const l of lines) {
    requestedByType.set(l.roomType, (requestedByType.get(l.roomType) ?? 0) + l.qty);
    unitsByType.set(l.roomType, Math.max(unitsByType.get(l.roomType) ?? 0, l.units));
  }
  for (const [type, requested] of requestedByType) {
    const left = (unitsByType.get(type) ?? 0) - (occupied[type] ?? 0);
    if (requested > left) {
      return {
        ok: false,
        status: 409,
        error: "Sorry — those rooms are no longer available for your dates.",
      };
    }
  }

  // Price: Σ(rate × qty) × nights + per-room extra beds.
  const roomsTotal = lines.reduce((s, l) => s + l.priceFrom * l.qty, 0) * nights;
  const bedsTotal = lines.reduce(
    (s, l) => s + (l.addExtraBed ? l.extraBeds * l.extraBedPrice : 0),
    0,
  );
  const amount = roomsTotal + bedsTotal;

  // Aggregate the per-room choices onto the reservation for backward-compat
  // reads (event app / CRM see one primary room + totals).
  const totalGuests = lines.reduce((s, l) => s + l.guests, 0);
  const totalExtraBeds = lines.reduce((s, l) => s + (l.addExtraBed ? l.extraBeds : 0), 0);
  const anyExtraBed = lines.some((l) => l.addExtraBed);

  const reservationNumber = await uniqueReservationNumber();
  const primary = lines[0];
  const email = input.email.trim().toLowerCase();

  await prisma.$transaction(async (tx) => {
    // Customer first — deduplicated by email; contact details live here.
    const customer = await tx.customer.upsert({
      where: { email },
      create: {
        email,
        name: input.name,
        phone: input.phone,
        dialCode: input.dialCode,
        company: input.company || null,
      },
      update: {
        name: input.name,
        phone: input.phone,
        dialCode: input.dialCode,
        company: input.company || null,
      },
    });

    // Then the reservation, tied to the customer. (name/email/phone are still
    // written for the event app + legacy CRM reads until those columns are dropped.)
    await tx.booking.create({
      data: {
        reservationNumber,
        customerId: customer.id,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        bookingType: input.bookingType,
        guests: totalGuests,
        roomType: primary.roomType, // backward-compat primary room
        extraBed: anyExtraBed,
        extraBeds: Math.max(1, totalExtraBeds),
        name: input.name,
        email: input.email,
        dialCode: input.dialCode,
        phone: input.phone,
        company: input.company || null,
        status: "PENDING",
        ipAddress: ip ?? null,
        agreedToTerms: input.agreedToTerms,
        amount,
      },
    });
    await tx.reservationRoom.createMany({
      data: lines.map((l) => ({
        reservationNumber,
        roomSlug: l.slug,
        roomType: l.roomType,
        qty: l.qty,
        guests: l.guests,
        extraBed: l.addExtraBed,
        extraBeds: l.extraBeds,
      })),
    });
  });

  return { ok: true, reservationNumber, amount };
}
