/**
 * Per-unit detail content, keyed by slug. Layout/animation ported 1:1 from the
 * licensed Webflow `suites.html`; copy adapted for U2E Apartments. Images use
 * the template CDN (whitelisted in next.config.mjs) as documented placeholders.
 *
 * NOTE: this is static placeholder data; Phase 3 swaps it for `GET /api/units/[id]`.
 */

const CDN2 = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960fb";

export type UnitDetail = {
  slug: string;
  name: string;
  category: string;
  beds: number;
  baths: number;
  area: string;
  bedConfig: string;
  details: string;
  highlights: { title: string; desc: string }[];
  gallery: string[];
  priceFrom: string;
};

/**
 * Amenities are shared across units (mirrors the template's fixed amenity list).
 * `icon` is the filename (no extension) in `public/icons/`, rendered as a
 * brand-tinted CSS mask in the amenities grid.
 */
export type Amenity = { label: string; icon: string };

export const UNIT_AMENITIES: Amenity[] = [
  { label: "Sitting Room Area", icon: "sitting-room-area" },
  { label: "Shower in Bathroom", icon: "shower-in-bathroom" },
  { label: "Separated Toilet", icon: "separated-toilet" },
  { label: "Premium Drinks", icon: "premium-drinks" },
  { label: "Air Conditioning", icon: "air-conditioning" },
  { label: "Ceiling Fan", icon: "ceiling-fan" },
  { label: "Wifi", icon: "wifi" },
  { label: "Direct Phone", icon: "direct-phone" },
  { label: "Vertical Steam Iron", icon: "vertical-steam-iron" },
  { label: "Slippers & Bathrobes", icon: "slippers-and-bathrobes" },
  { label: "Vanity Mirror", icon: "vanity-mirror" },
  { label: "Turndown Service", icon: "turndown-service" },
  { label: "Ambassador Service", icon: "ambassador-service" },
  { label: "24 Hour Dining", icon: "24-hour-dining" },
  { label: "Pillow Menu", icon: "pillow-menu" },
  { label: "Safe Box", icon: "safe-box" },
];

const SUITS = [
  `${CDN2}/69ec48ef66c2e17c7a85e6c1_suits%20(1).avif`,
  `${CDN2}/69ec48f3fd964447a2cf5699_suits%20(2).avif`,
  `${CDN2}/69ec48f7e29cd6c2bb9a4eca_suits%20(3).avif`,
  `${CDN2}/69e84ff4f2802b7b9f1ca66b_rooms%20(7).avif`,
  `${CDN2}/69e84ff8b19518f41f4cdaac_rooms%20(8).avif`,
];

const DETAILS =
  "A spacious serviced unit with a separate living area including a working space, a dining area, and a private balcony with seating. The comfortable bedroom sits beside a bathroom with a rain shower and double washbasins, with a walk-in closet and generous storage throughout.";

const HIGHLIGHTS = [
  {
    title: "Rooftop Aperitif",
    desc: "Sundown reaches new heights on the rooftop, with sparkling wine and small plates served against uninterrupted skyline views.",
  },
  {
    title: "In-Suite Dining",
    desc: "As the evening settles, the in-house kitchen brings a candlelit dinner to your suite — a seasonal menu, plated and served in private.",
  },
];

export const UNITS: Record<string, UnitDetail> = {
  "skyline-one-bedroom-suite": {
    slug: "skyline-one-bedroom-suite",
    name: "Skyline One-Bedroom Suite",
    category: "Suite",
    beds: 1,
    baths: 1,
    area: "820 sq ft",
    bedConfig: "Available with 1 King bed.",
    details: DETAILS,
    highlights: HIGHLIGHTS,
    gallery: SUITS,
    priceFrom: "₦120,000 / night",
  },
  "garden-studio-apartment": {
    slug: "garden-studio-apartment",
    name: "Garden Studio Apartment",
    category: "Studio",
    beds: 1,
    baths: 1,
    area: "540 sq ft",
    bedConfig: "Available with 1 Queen bed or 2 Singles.",
    details: DETAILS,
    highlights: HIGHLIGHTS,
    gallery: SUITS,
    priceFrom: "₦85,000 / night",
  },
  "courtyard-guest-room": {
    slug: "courtyard-guest-room",
    name: "Courtyard Guest Room",
    category: "Guest Room",
    beds: 1,
    baths: 1,
    area: "480 sq ft",
    bedConfig: "Available with 1 King or 2 Queen beds.",
    details: DETAILS,
    highlights: HIGHLIGHTS,
    gallery: SUITS,
    priceFrom: "₦70,000 / night",
  },
  "classic-guest-room": {
    slug: "classic-guest-room",
    name: "Classic Guest Room",
    category: "Guest Room",
    beds: 1,
    baths: 1,
    area: "420 sq ft",
    bedConfig: "Available with 1 Queen bed.",
    details: DETAILS,
    highlights: HIGHLIGHTS,
    gallery: SUITS,
    priceFrom: "₦60,000 / night",
  },
  "two-bedroom-residence": {
    slug: "two-bedroom-residence",
    name: "Two-Bedroom Residence",
    category: "Residence",
    beds: 2,
    baths: 2,
    area: "1,200 sq ft",
    bedConfig: "2 Bedrooms — 1 King and 2 Queen beds.",
    details: DETAILS,
    highlights: HIGHLIGHTS,
    gallery: SUITS,
    priceFrom: "₦210,000 / night",
  },
  "garden-luxury-residence": {
    slug: "garden-luxury-residence",
    name: "Garden Luxury Residence",
    category: "Residence",
    beds: 3,
    baths: 2,
    area: "1,650 sq ft",
    bedConfig: "3 Bedrooms — 1 King and 2 Queen beds.",
    details: DETAILS,
    highlights: HIGHLIGHTS,
    gallery: SUITS,
    priceFrom: "₦280,000 / night",
  },
  "penthouse-sunset-residence": {
    slug: "penthouse-sunset-residence",
    name: "Penthouse Sunset Residence",
    category: "Residence",
    beds: 4,
    baths: 3,
    area: "2,200 sq ft",
    bedConfig: "4 Bedrooms — 2 King and 2 Queen beds.",
    details: DETAILS,
    highlights: HIGHLIGHTS,
    gallery: SUITS,
    priceFrom: "₦420,000 / night",
  },
};

export const UNIT_SLUGS = Object.keys(UNITS);
export const getUnit = (slug: string): UnitDetail | undefined => UNITS[slug];
