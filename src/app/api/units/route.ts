import { NextResponse } from "next/server";
import { getVillas } from "@/lib/queries/rooms";

export const dynamic = "force-dynamic";

/** GET /api/units — active units/rooms (from `crm.Room`) for the guest site. */
export async function GET() {
  const villas = await getVillas();
  return NextResponse.json(villas);
}
