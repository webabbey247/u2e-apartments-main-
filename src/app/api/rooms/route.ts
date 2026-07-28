import { NextResponse } from "next/server";
import { getBookableRooms } from "@/lib/queries/rooms";

export const runtime = "nodejs";
export const revalidate = 60;

/** GET /api/rooms — active rooms as booking lines (for the booking modal select). */
export async function GET() {
  try {
    const rooms = await getBookableRooms();
    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("[GET /api/rooms]", err);
    return NextResponse.json({ rooms: [] }, { status: 500 });
  }
}
