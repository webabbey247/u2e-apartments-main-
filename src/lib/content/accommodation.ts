/**
 * Accommodation page content + asset map.
 * Layout/animation ported 1:1 from the licensed Webflow `room.html`; copy
 * adapted for U2E Apartments (single-location serviced accommodation). Images
 * reference the template CDN (whitelisted in next.config.mjs) as placeholders
 * until final assets are supplied.
 */

const CDN = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960ee";
const CDN2 = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960fb";

export const ACC_HERO = {
  eyebrow: "Accommodation",
  title: "Suites & Residences",
  body: "Elegant by design and effortless by nature — every U2E unit is a serviced home base built for longer, better stays, moments from dining, wellness, and event spaces.",
  image: `${CDN}/69e768c5ddfec6dbcd60149d_hero%20(4)-p-1080.webp`,
} as const;

export const SUITES = {
  eyebrow: "Stay With Us",
  title: "Stay With Us — All Suites",
  body: "Warm timber and quiet, considered detail combine to create an inviting, refined stay in every suite.",
  items: [
    {
      slug: "skyline-one-bedroom-suite",
      name: "Skyline One-Bedroom Suite",
      desc: "Open-plan living with panoramic city views and a full kitchenette.",
      image: `${CDN2}/69e9aba16606104101d4b85b_rooms%20(1).avif`,
    },
    {
      slug: "garden-studio-apartment",
      name: "Garden Studio Apartment",
      desc: "A calm, light-filled studio opening onto the landscaped courtyard.",
      image: `${CDN2}/69e84f060bb5b286f3d21f68_rooms%20(2).avif`,
    },
    {
      slug: "courtyard-guest-room",
      name: "Courtyard Guest Room",
      desc: "A refined room arranged around our quiet interior courtyard.",
      image: `${CDN2}/69e9ab371d4cd545cb31ea9d_rooms%20(3).avif`,
    },
    {
      slug: "classic-guest-room",
      name: "Classic Guest Room",
      desc: "A comfortable room with everything you need close at hand.",
      image: `${CDN2}/69e9a1fdf608af8b01352a0a_rooms%20(4).avif`,
    },
  ],
} as const;

export const REASONS = {
  eyebrow: "Why U2E",
  title: "Four Good Reasons to Stay With Us",
  image: `${CDN}/69eb3c012916554d21e581fb_about%20(2)-p-1080.webp`,
  cta: { label: "Book Now", href: "/accommodation" },
  items: [
    "Prime, serene location, and safety/security.",
    "Great customer service.",
    "High-speed Internet.",
    "Enjoy the luxury of an entire apartment with modern facilities.",
  ],
} as const;

export const RESIDENCES = {
  eyebrow: "For Longer Stays",
  title: "All Residences",
  body: "More room to live, work, and host — our multi-bedroom residences are ideal for families and extended stays.",
  items: [
    {
      slug: "two-bedroom-residence",
      name: "Two-Bedroom Residence",
      desc: "Room to spread out, work, and host — ideal for families and longer stays.",
      beds: 2,
      baths: 2,
      area: "1,200 sq ft",
      image: `${CDN2}/69ef40783b0b1c050574eb99_villas%20(2)-p-1080.jpg`,
    },
    {
      slug: "garden-luxury-residence",
      name: "Garden Luxury Residence",
      desc: "A light, garden-facing residence with an open living and dining space.",
      beds: 3,
      baths: 2,
      area: "1,650 sq ft",
      image: `${CDN2}/69ef40cc96ec1977c86e140e_villas%20(3)-p-1080.jpg`,
    },
    {
      slug: "penthouse-sunset-residence",
      name: "Penthouse Sunset Residence",
      desc: "Our signature top-floor residence with a private terrace and skyline views.",
      beds: 4,
      baths: 3,
      area: "2,200 sq ft",
      image: `${CDN2}/69ef41225283c5a0d84b08df_villas%20(4)-p-1080.jpg`,
    },
  ],
} as const;

export const ACC_WELLNESS = {
  eyebrow: "Spa & Wellness",
  title: "Rest Comes Standard",
  body: "Every stay includes access to the spa and fitness floor — tucked away from the bustle so you can properly switch off between days.",
  cta: { label: "Explore wellness", href: "/experience" },
  image: `${CDN2}/69fd7d7a679f5b8f26da6f71_experiences.jpg`,
} as const;

export const ACC_FAQ = {
  eyebrow: "Good to Know",
  title: "Accommodation FAQ",
  items: [
    {
      q: "What time is check-in and check-out?",
      a: "Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be arranged on request, subject to availability.",
    },
    {
      q: "Is there a minimum stay?",
      a: "Most units can be booked from a single night, though our residences and longer-stay rates offer better value from seven nights and up.",
    },
    {
      q: "What is your cancellation policy?",
      a: "Flexible bookings can be cancelled free of charge up to 48 hours before arrival. Any non-refundable offer rates are noted clearly at checkout.",
    },
    {
      q: "Are the apartments serviced during my stay?",
      a: "Yes — each unit is fully serviced with regular housekeeping, fresh linens, and 24/7 front-desk support throughout your stay.",
    },
    {
      q: "How do I pay for my booking?",
      a: "Pay online by card via Paystack at checkout, or by bank transfer — for transfers, email your receipt and booking reference to confirm your stay.",
    },
  ],
} as const;
