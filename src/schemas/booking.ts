import { z } from "zod";

/**
 * Booking wizard form — mirrors the event site's `bookingSchema`. One source of
 * truth for react-hook-form (client) and the future `POST /api/bookings` route.
 */
export const bookingSchema = z
  .object({
    checkIn: z.string().min(1, "Select a check-in date"),
    checkOut: z.string().min(1, "Select a check-out date"),
    name: z.string().min(1, "Enter your full name"),
    email: z.string().min(1, "Enter your email").email("Enter a valid email"),
    dialCode: z.string().min(1, "Select a dial code"),
    phone: z.string().min(1, "Enter your contact phone"),
    /** Company / delegation stays optional. */
    company: z.string().optional(),
    agreedToTerms: z.boolean().refine((v) => v === true, {
      message: "Please accept the Terms of Use and Privacy Policy",
    }),
  })
  // A stay must be at least one night — catches same-day check-in/out before
  // it ever reaches the availability endpoint.
  .refine((v) => !v.checkIn || !v.checkOut || v.checkOut > v.checkIn, {
    path: ["checkOut"],
    message: "Check-out must be after check-in",
  });

export type BookingForm = z.infer<typeof bookingSchema>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** One requested room line: a room slug, quantity, party, and extra-bed choice. */
export const bookingRoomSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  qty: z.number().int().min(1).max(10),
  guests: z.number().int().min(1).max(30),
  extraBed: z.boolean().default(false),
  extraBeds: z.number().int().min(1).max(8).default(1),
});

/** `POST /api/bookings` payload — the persisted, multi-room reservation. */
export const createBookingSchema = z
  .object({
    checkIn: z.string().regex(DATE_RE, "Use YYYY-MM-DD"),
    checkOut: z.string().regex(DATE_RE, "Use YYYY-MM-DD"),
    bookingType: z.enum(["single", "multiple"]).default("single"),
    rooms: z.array(bookingRoomSchema).min(1, "Add at least one room").max(10),
    name: z.string().trim().min(1, "Enter your full name").max(160),
    email: z.string().trim().email("Enter a valid email"),
    dialCode: z.string().trim().min(1).max(8),
    phone: z.string().trim().min(1, "Enter your contact phone").max(40),
    company: z.string().trim().max(160).optional(),
    agreedToTerms: z.literal(true, { message: "Please accept the terms" }),
  })
  .refine((v) => v.checkOut > v.checkIn, {
    path: ["checkOut"],
    message: "Check-out must be after check-in",
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

/** `PATCH /api/bookings/[number]` payload — record the chosen payment. The
 * receipt + reference are payment artefacts and are stored on `Payment`. */
export const updateBookingPaymentSchema = z.object({
  paymentMethod: z.enum(["card", "transfer"]),
  receiptUrl: z.string().trim().url().max(500).optional(),
  receiptFileName: z.string().trim().max(255).optional(),
  paystackReference: z.string().trim().max(120).optional(),
});
export type UpdateBookingPaymentInput = z.infer<typeof updateBookingPaymentSchema>;

/** RHF field groups validated per wizard step (room config lives in state). */
export const dateFields = ["checkIn", "checkOut"] as const;
export const detailsFields = ["name", "email", "dialCode", "phone"] as const;
export const termsFields = ["agreedToTerms"] as const;

// 5-step flow: Availability (dates) → Rooms (per-type config) → Details (+ terms)
// → Payment → Confirmed. (No separate Review — the sticky summary covers it.)
export const STEP_NAMES = ["Availability", "Rooms", "Details", "Payment", "Confirmed"] as const;

/** Common dial codes (avoids a network round-trip for a country list). */
export const DIAL_CODES = [
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+233", label: "🇬🇭 +233" },
  { code: "+254", label: "🇰🇪 +254" },
  { code: "+27", label: "🇿🇦 +27" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+91", label: "🇮🇳 +91" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The day after `iso` — the earliest valid check-out for a given check-in. */
export const nextDayISO = (iso: string): string => {
  if (!iso) return toISO(new Date());
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return toISO(d);
};

export const nightsBetween = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(`${checkIn}T00:00:00`).getTime();
  const b = new Date(`${checkOut}T00:00:00`).getTime();
  const d = Math.round((b - a) / 86_400_000);
  return Number.isFinite(d) && d > 0 ? d : 0;
};

const nairaFmt = new Intl.NumberFormat("en-NG");
export const formatNaira = (n: number) => `₦${nairaFmt.format(n)}`;
