import "server-only";
import { prisma } from "@/lib/prisma";
import type { RoomType } from "@/generated/prisma/enums";

export type AvailabilityResult = {
  available: boolean;
  unitsTotal: number;
  unitsBooked: number;
  unitsLeft: number;
  nights: number;
  room: { slug: string; name: string };
  /** Max guests the unit sleeps (from the DB) + whether the party fits. */
  maxGuests: number;
  capacityOk: boolean;
  /** True when the room has no reservation inventory bucket to check against. */
  unchecked?: boolean;
};

/**
 * Reservations reference rooms through the `RoomType` enum rather than a room
 * id, so a room maps onto its inventory bucket by bedroom count.
 *
 * LIMITATION: only 2- and 3-bedroom buckets exist. A room with any other
 * bedroom count has nothing to check against — see `unchecked` in the result.
 */
function roomTypeFor(bedrooms: number): RoomType | null {
  if (bedrooms === 2) return "TWO_BED";
  if (bedrooms === 3) return "THREE_BED";
  return null;
}

/** Statuses that hold a unit. FAILED / NOT_FOUND release their inventory. */
const OCCUPYING: BookingStatusValue[] = ["PENDING", "CONFIRMED"];
type BookingStatusValue = "PENDING" | "CONFIRMED" | "NOT_FOUND" | "FAILED";

const nights = (checkIn: string, checkOut: string) => {
  const a = new Date(`${checkIn}T00:00:00`).getTime();
  const b = new Date(`${checkOut}T00:00:00`).getTime();
  const d = Math.round((b - a) / 86_400_000);
  return Number.isFinite(d) && d > 0 ? d : 0;
};

/**
 * Is a room free for the requested stay?
 *
 * Counts reservations in the same inventory bucket whose stay overlaps the
 * requested range and compares that against the room's `units`. Dates are
 * `YYYY-MM-DD` strings, so lexicographic comparison is chronological.
 * Overlap (check-out exclusive): `existing.checkIn < req.checkOut && existing.checkOut > req.checkIn`
 * — back-to-back stays (one ends the day another starts) do NOT conflict.
 */
export async function checkAvailability(
  slug: string,
  checkIn: string,
  checkOut: string,
  guests?: number,
): Promise<AvailabilityResult | null> {
  const room = await prisma.room.findFirst({
    where: { slug, active: true },
    select: { slug: true, title: true, units: true, bedrooms: true, sleeps: true },
  });
  if (!room) return null;

  const stay = nights(checkIn, checkOut);
  // Capacity is enforced server-side against the room's `sleeps` — the client
  // input is a hint, never the source of truth.
  const capacityOk = guests === undefined ? true : guests <= room.sleeps;
  const base = {
    unitsTotal: room.units,
    nights: stay,
    room: { slug: room.slug, name: room.title },
    maxGuests: room.sleeps,
    capacityOk,
  };

  const roomType = roomTypeFor(room.bedrooms);
  if (!roomType) {
    // No inventory bucket to check — report free rather than blocking a booking.
    return { ...base, available: room.units > 0, unitsBooked: 0, unitsLeft: room.units, unchecked: true };
  }

  const unitsBooked = await prisma.booking.count({
    where: {
      roomType,
      status: { in: OCCUPYING },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
  });

  const unitsLeft = Math.max(0, room.units - unitsBooked);
  return { ...base, available: unitsLeft > 0, unitsBooked, unitsLeft };
}
