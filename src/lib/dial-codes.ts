export type DialCode = { name: string; iso: string; dialCode: string };

/**
 * Small offline fallback for `/api/dial-codes` — the full list comes from
 * countriesnow via that BFF route; this only keeps the picker usable if the
 * source is unreachable. Nigeria first: the property's home market and default.
 */
export const DIAL_CODES_FALLBACK: DialCode[] = [
  { name: "Nigeria", iso: "NG", dialCode: "+234" },
  { name: "Ghana", iso: "GH", dialCode: "+233" },
  { name: "Kenya", iso: "KE", dialCode: "+254" },
  { name: "South Africa", iso: "ZA", dialCode: "+27" },
  { name: "Egypt", iso: "EG", dialCode: "+20" },
  { name: "United Arab Emirates", iso: "AE", dialCode: "+971" },
  { name: "United Kingdom", iso: "GB", dialCode: "+44" },
  { name: "United States", iso: "US", dialCode: "+1" },
];
