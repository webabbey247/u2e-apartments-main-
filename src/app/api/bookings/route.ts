import { NextResponse, type NextRequest } from "next/server";
import { createBookingSchema } from "@/schemas/booking";
import { createBooking } from "@/lib/queries/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/bookings — create a (possibly multi-room) reservation. Re-checks
 * availability and computes the price server-side, then persists a Reservation
 * plus one ReservationRoom line per room. Returns the reservation number the
 * payment step quotes.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0].trim() : req.headers.get("x-real-ip");

  try {
    const result = await createBooking(parsed.data, ip);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(
      { reservationNumber: result.reservationNumber, amount: result.amount, status: "PENDING" },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json({ error: "Could not create your booking" }, { status: 500 });
  }
}
