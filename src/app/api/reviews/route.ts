import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/schemas/review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/reviews — guest review submission. Reservation-number gated: the
 * number must belong to a CONFIRMED reservation and not already be reviewed.
 * Created PENDING; the CRM moderates it before it appears on the room page.
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
      select: { id: true },
    });
    if (!reservation) {
      return NextResponse.json(
        { error: "No confirmed reservation found for that number." },
        { status: 404 },
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

    await prisma.review.create({ data });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/reviews]", err);
    return NextResponse.json({ error: "Could not submit your review" }, { status: 500 });
  }
}
