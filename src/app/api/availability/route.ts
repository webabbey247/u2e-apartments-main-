import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { checkAvailability } from "@/lib/queries/availability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const querySchema = z
  .object({
    slug: z.string().trim().min(1, "slug is required"),
    checkIn: z.string().regex(DATE, "checkIn must be YYYY-MM-DD"),
    checkOut: z.string().regex(DATE, "checkOut must be YYYY-MM-DD"),
    guests: z.coerce.number().int().min(1).max(50).optional(),
  })
  .refine((v) => v.checkOut > v.checkIn, {
    path: ["checkOut"],
    message: "Check-out must be after check-in",
  });

/**
 * GET /api/availability?slug=…&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
 *
 * Confirms whether a unit is free for the requested stay by comparing the
 * room's `units` against overlapping reservations.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const guestsParam = sp.get("guests");
  const parsed = querySchema.safeParse({
    slug: sp.get("slug") ?? "",
    checkIn: sp.get("checkIn") ?? "",
    checkOut: sp.get("checkOut") ?? "",
    ...(guestsParam ? { guests: guestsParam } : {}),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { slug, checkIn, checkOut, guests } = parsed.data;

  try {
    const result = await checkAvailability(slug, checkIn, checkOut, guests);
    if (!result) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/availability]", err);
    return NextResponse.json({ error: "Could not check availability" }, { status: 500 });
  }
}
