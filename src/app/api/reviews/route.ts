import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/schemas/review";
import { isReviewOpen } from "@/lib/queries/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/reviews — guest review submission (reservation-level, may span
 * multiple rooms). Gated: the reservation must be CONFIRMED, review-open (see
 * `isReviewOpen`), and not already reviewed. The reviewed room(s) are derived
 * from the reservation. Created PENDING for CRM moderation.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  try {
    const reservation = await prisma.booking.findFirst({
      where: { reservationNumber: data.reservationNumber, status: "CONFIRMED" },
      select: {
        id: true,
        isReviewAvailable: true,
        checkOut: true,
        name: true,
        rooms: { select: { roomSlug: true } },
      },
    });
    if (!reservation) {
      return NextResponse.json(
        { error: "No confirmed reservation found for that number." },
        { status: 404 },
      );
    }
    // Same rule the review page renders against, so the form and this endpoint
    // can never disagree about whether a stay is reviewable.
    const open = await isReviewOpen({
      reservationNumber: data.reservationNumber,
      isReviewAvailable: reservation.isReviewAvailable,
      checkOut: reservation.checkOut,
    });
    if (!open) {
      return NextResponse.json(
        { error: "Reviews open after your stay is complete." },
        { status: 403 },
      );
    }

    const existing = await prisma.review.findFirst({
      where: { reservationNumber: data.reservationNumber },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A review has already been submitted for this reservation." },
        { status: 409 },
      );
    }

    // Derive the reviewed room(s) from the reservation's booked rooms.
    const slugs = Array.from(new Set(reservation.rooms.map((r) => r.roomSlug)));
    const rooms = slugs.length
      ? await prisma.room.findMany({ where: { slug: { in: slugs } }, select: { slug: true, title: true } })
      : [];
    const roomSlug = rooms[0]?.slug ?? slugs[0] ?? "";
    const roomTitle = rooms.map((r) => r.title).join(", ");

    // The form shows the name read-only, so take it from the reservation rather
    // than the posted value — the client can't rename the author of a review.
    const guestName = reservation.name.trim() || data.guestName;

    await prisma.review.create({ data: { ...data, guestName, roomSlug, roomTitle } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/reviews]", err);
    return NextResponse.json({ error: "Could not submit your review" }, { status: 500 });
  }
}
