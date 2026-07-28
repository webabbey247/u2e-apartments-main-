import "server-only";
import { prisma } from "@/lib/prisma";

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
    const rows = await prisma.review.findMany({
      where: { roomSlug, status: "APPROVED" },
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
 * Result of resolving a reservation number for the review form. `ok` gates the
 * form; the messages distinguish "not found" from "already reviewed".
 */
export type ReviewEligibility =
  | { ok: true; reservationNumber: string }
  | { ok: false; reason: "not_found" | "not_available" | "already_reviewed" };

/**
 * Can this reservation number leave a review? Requires a CONFIRMED reservation
 * whose stay is complete (`isReviewAvailable`, set by the review-invite cron
 * once checkout has passed and payment is confirmed) and no existing review.
 */
export async function checkReviewEligibility(
  reservationNumber: string,
): Promise<ReviewEligibility> {
  try {
    const reservation = await prisma.booking.findFirst({
      where: { reservationNumber, status: "CONFIRMED" },
      select: { id: true, isReviewAvailable: true },
    });
    if (!reservation) return { ok: false, reason: "not_found" };
    if (!reservation.isReviewAvailable) return { ok: false, reason: "not_available" };

    const existing = await prisma.review.findFirst({
      where: { reservationNumber },
      select: { id: true },
    });
    if (existing) return { ok: false, reason: "already_reviewed" };

    return { ok: true, reservationNumber };
  } catch (err) {
    console.error(`[checkReviewEligibility:${reservationNumber}] error:`, err);
    return { ok: false, reason: "not_found" };
  }
}
