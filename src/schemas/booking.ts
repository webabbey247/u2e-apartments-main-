import { z } from "zod";

/**
 * Booking wizard form — mirrors the event site's `bookingSchema`. One source of
 * truth for react-hook-form (client) and the future `POST /api/bookings` route.
 */
export const bookingSchema = z
  .object({
    checkIn: z.string().min(1, "Select a check-in date"),
    checkOut: z.string().min(1, "Select a check-out date"),
    guests: z
      .number({ error: "Enter the number of guests" })
      .int()
      .min(1, "At least 1 guest")
      .max(12, "Up to 12 guests"),
    extraBed: z.boolean(),
    extraBeds: z.number().int().min(1).max(4),
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

/** Field groups validated per wizard step (used with RHF's `trigger()`). */
export const step1Fields = ["checkIn", "checkOut", "guests", "extraBeds"] as const;
export const step2Fields = ["name", "email", "dialCode", "phone"] as const;
export const step3Fields = ["agreedToTerms"] as const;

export const STEP_NAMES = ["Dates", "Details", "Review", "Payment", "Confirmed"] as const;

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
