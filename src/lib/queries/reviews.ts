import "server-only";
import { prisma } from "@/lib/prisma";
import { categoryFor } from "@/lib/queries/rooms";
import { nightsBetween } from "@/schemas/booking";

/** A published review shown on the room page. */
export type PublicReview = {
  id: string;
  guestName: string;
  rating: number;
  body: string;
  /** ISO date for display. */
  date: string;
};

/** Aggregate rating summary for a room's approved reviews. */
export type ReviewSummary = {
  count: number;
  average: number; // 0 when there are no reviews
  reviews: PublicReview[];
};

/**
 * Approved reviews for a room, newest first. Returns an empty summary on error
 * so the room page never breaks over reviews.
 */
export async function getApprovedReviews(roomSlug: string): Promise<ReviewSummary> {
  try {
    // A review is reservation-level; show it on every room that reservation
    // booked (via ReservationRoom), plus any review stored with this slug.
    const booked = await prisma.reservationRoom.findMany({
      where: { roomSlug },
      select: { reservationNumber: true },
    });
    const numbers = Array.from(new Set(booked.map((b) => b.reservationNumber)));

    const rows = await prisma.review.findMany({
      where: {
        status: "APPROVED",
        OR: [{ reservationNumber: { in: numbers } }, { roomSlug }],
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, guestName: true, rating: true, body: true, createdAt: true },
    });

    const count = rows.length;
    const average = count === 0 ? 0 : rows.reduce((s, r) => s + r.rating, 0) / count;

    return {
      count,
      average: Math.round(average * 10) / 10,
      reviews: rows.map((r) => ({
        id: r.id,
        guestName: r.guestName,
        rating: r.rating,
        body: r.body,
        date: r.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    console.error(`[getApprovedReviews:${roomSlug}] error:`, err);
    return { count: 0, average: 0, reviews: [] };
  }
}

/**
 * The stay itself, shaped for the summary card shown beside the review form —
 * the same fields the booking modal's sticky summary shows.
 */
export type ReservationSummary = {
  reservationNumber: string;
  /** Room-type name, or "N rooms" when the reservation spans several. */
  title: string;
  /** Room category line under the title, when there's exactly one room type. */
  category: string | null;
  /** "2 × Two Bedroom, One Bedroom" */
  roomsLabel: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  guestName: string;
  email: string;
  /** Dial code + number, already joined. */
  phone: string | null;
  /** Total paid, in naira. */
  amount: number;
};

/**
 * Result of resolving a reservation number for the review form. `ok` gates the
 * form; the messages distinguish "not found" from "already reviewed".
 */
export type ReviewEligibility =
  | { ok: true; reservationNumber: string; reservation: ReservationSummary }
  | { ok: false; reason: "not_found" | "not_available" | "already_reviewed" };

/** Today as YYYY-MM-DD — `checkOut` is stored as a comparable date string. */
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Is this reservation open for review yet?
 *
 * `isReviewAvailable` is the CRM's "invite email sent" flag (set by its
 * review-invites cron) and is the fast path. It is *not* sufficient on its own,
 * though: the CRM only writes it once the invite email actually delivers, so a
 * guest holding a perfectly valid review link would be locked out by an SMTP
 * failure or a cron that simply hasn't run yet. So fall back to the same
 * conditions the cron itself checks — checkout in the past, and a successful
 * payment. Same bar, minus the dependency on email delivery.
 */
export async function isReviewOpen(r: {
  reservationNumber: string;
  isReviewAvailable: boolean;
  checkOut: string;
}): Promise<boolean> {
  if (r.isReviewAvailable) return true;
  if (r.checkOut >= todayISO()) return false; // stay not finished
  const paid = await prisma.payment.findFirst({
    where: { reservationNumber: r.reservationNumber, status: "success" },
    select: { id: true },
  });
  return paid !== null;
}

/** The reservation row shape `summarize` needs. */
type ReservationRow = {
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  dialCode: string | null;
  phone: string | null;
  amount: number;
  rooms: { roomSlug: string; qty: number }[];
};

/**
 * Turn a stored reservation into the summary-card payload, resolving room slugs
 * to their live CRM titles (and falling back to the slug if a room was retired).
 */
async function summarize(
  reservationNumber: string,
  r: ReservationRow,
): Promise<ReservationSummary> {
  const catalogue = await prisma.room.findMany({
    where: { slug: { in: r.rooms.map((x) => x.roomSlug) } },
    select: { slug: true, title: true, bedrooms: true },
  });
  const bySlug = new Map(catalogue.map((c) => [c.slug, c]));

  const lines = r.rooms.map((x) => {
    const room = bySlug.get(x.roomSlug);
    return {
      title: room?.title ?? x.roomSlug,
      category: room ? categoryFor(room.bedrooms) : null,
      qty: x.qty,
    };
  });
  const totalRooms = lines.reduce((n, l) => n + l.qty, 0);

  return {
    reservationNumber,
    title:
      lines.length === 0
        ? "Your Stay"
        : lines.length === 1
          ? lines[0].title
          : `${totalRooms} rooms`,
    category: lines.length === 1 ? lines[0].category : null,
    roomsLabel:
      lines.length === 0
        ? "—"
        : lines.map((l) => (l.qty > 1 ? `${l.qty} × ${l.title}` : l.title)).join(", "),
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    nights: nightsBetween(r.checkIn, r.checkOut),
    guests: r.guests,
    guestName: r.name,
    email: r.email,
    phone: r.phone ? `${r.dialCode ?? ""} ${r.phone}`.trim() : null,
    amount: r.amount,
  };
}

/**
 * Can this reservation number leave a review? Requires a CONFIRMED reservation
 * whose stay is complete and paid for (see `isReviewOpen`) and no existing
 * review.
 */
export async function checkReviewEligibility(
  reservationNumber: string,
): Promise<ReviewEligibility> {
  try {
    const reservation = await prisma.booking.findFirst({
      where: { reservationNumber, status: "CONFIRMED" },
      select: {
        id: true,
        isReviewAvailable: true,
        checkIn: true,
        checkOut: true,
        guests: true,
        name: true,
        email: true,
        dialCode: true,
        phone: true,
        amount: true,
        rooms: { select: { roomSlug: true, qty: true } },
      },
    });
    if (!reservation) return { ok: false, reason: "not_found" };
    if (!(await isReviewOpen({ ...reservation, reservationNumber }))) {
      return { ok: false, reason: "not_available" };
    }

    const existing = await prisma.review.findFirst({
      where: { reservationNumber },
      select: { id: true },
    });
    if (existing) return { ok: false, reason: "already_reviewed" };

    return {
      ok: true,
      reservationNumber,
      reservation: await summarize(reservationNumber, reservation),
    };
  } catch (err) {
    console.error(`[checkReviewEligibility:${reservationNumber}] error:`, err);
    return { ok: false, reason: "not_found" };
  }
}
