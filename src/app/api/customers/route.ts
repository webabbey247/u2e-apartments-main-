import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/schemas/customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/customers?email=… — look a guest up by email (the unique key). Used
 * by the Guest Details step to pre-fill returning guests. Never 404s: returns
 * `{ found: false }` so the client can reveal an empty form for a new guest.
 */
export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get("email") ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ found: false });

  const customer = await prisma.customer.findUnique({
    where: { email },
    select: { name: true, phone: true, dialCode: true, company: true },
  });
  return NextResponse.json(customer ? { found: true, customer } : { found: false });
}

function parse(body: unknown) {
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return { error: NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    ) } as const;
  }
  return { data: { ...parsed.data, email: parsed.data.email.trim().toLowerCase() } } as const;
}

async function save(body: unknown) {
  const r = parse(body);
  if ("error" in r) return r.error;
  const { email, name, phone, dialCode, company } = r.data;
  try {
    const customer = await prisma.customer.upsert({
      where: { email },
      create: { email, name, phone, dialCode, company: company || null },
      update: { name, phone, dialCode, company: company || null },
      select: { id: true, email: true, name: true, phone: true, dialCode: true, company: true },
    });
    return NextResponse.json({ customer });
  } catch (err) {
    console.error("[/api/customers save]", err);
    return NextResponse.json({ error: "Could not save your details" }, { status: 500 });
  }
}

/** POST /api/customers — create a new guest. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  return save(body);
}

/** PATCH /api/customers — update an existing guest (keyed by email). */
export async function PATCH(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  return save(body);
}
