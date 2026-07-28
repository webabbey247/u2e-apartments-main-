import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { updateBookingPaymentSchema } from "@/schemas/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ number: string }> };

type PaymentStatus = "success" | "pending" | "not_found" | "failed";

// Mirror the event app's conventions so the CRM Payments view reads them:
//   card ("online")     -> success  (Paystack path; verification is Phase 6)
//   transfer ("receipt") + receipt -> pending (awaiting staff verification)
//   transfer, no receipt           -> not_found (prompt to attach one)
const RESERVATION_STATUS: Record<PaymentStatus, "CONFIRMED" | "PENDING" | "NOT_FOUND" | "FAILED"> = {
  success: "CONFIRMED",
  pending: "PENDING",
  not_found: "NOT_FOUND",
  failed: "FAILED",
};

function clientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : req.headers.get("x-real-ip");
}

/**
 * PATCH /api/bookings/:number — complete the payment step. Records the chosen
 * payment on the reservation, sets its status, and creates the `Payment` row the
 * CRM Payments view lists.
 */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { number } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateBookingPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { paymentMethod, receiptUrl, receiptFileName, paystackReference } = parsed.data;

  // "card" | "transfer" (guest UI) → "online" | "receipt" (stored + CRM vocab).
  const method = paymentMethod === "card" ? "online" : "receipt";
  const hasReceipt = Boolean(receiptUrl || receiptFileName);
  const status: PaymentStatus =
    method === "online" ? "success" : hasReceipt ? "pending" : "not_found";

  const reservation = await prisma.booking.findUnique({
    where: { reservationNumber: number },
    select: { email: true, amount: true, customerId: true },
  });
  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  try {
    // Only the reservation *status* changes here — the payment artefacts
    // (method, receipt, reference) belong to the Payment record.
    await prisma.booking.update({
      where: { reservationNumber: number },
      data: { status: RESERVATION_STATUS[status] },
    });

    await prisma.payment.create({
      data: {
        reservationNumber: number,
        customerId: reservation.customerId,
        email: reservation.email,
        amount: reservation.amount,
        method,
        status,
        paystackReference: paystackReference ?? null,
        receiptUrl: receiptUrl ?? null,
        receiptFileName: receiptFileName ?? null,
        ip: clientIp(req),
      },
    });

    return NextResponse.json({ ok: true, status });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }
    console.error("[PATCH /api/bookings/:number]", e);
    return NextResponse.json({ error: "Could not update the booking" }, { status: 500 });
  }
}
