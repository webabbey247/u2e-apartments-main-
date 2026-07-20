import { NextResponse } from "next/server";
import { DIAL_CODES_FALLBACK, type DialCode } from "@/lib/dial-codes";

// BFF proxy for the countriesnow dial-code list — avoids client-side CORS and
// lets us cache the (static) list for a day.
const SOURCE =
  process.env.COUNTRIES_API_URL ?? "https://countriesnow.space/api/v0.1/countries/codes";

type SourceItem = { name: string; dial_code: string; code: string };

export async function GET() {
  try {
    const res = await fetch(SOURCE, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`Source responded ${res.status}`);
    const json = (await res.json()) as { error: boolean; data: SourceItem[] };

    const codes: DialCode[] = (json.data ?? [])
      .filter((c) => c.dial_code && c.code)
      .map((c) => ({ name: c.name, dialCode: c.dial_code, iso: c.code }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (codes.length === 0) throw new Error("Source returned no codes");

    return NextResponse.json({ codes });
  } catch (err) {
    console.error("[dial-codes] fetch failed:", err);
    // Offline fallback so the picker still works if the source is down.
    return NextResponse.json({ codes: DIAL_CODES_FALLBACK, fallback: true });
  }
}
