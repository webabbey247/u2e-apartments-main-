/**
 * Home landing-page content + asset map.
 * Layout/animation are ported 1:1 from the licensed Webflow template; the copy
 * is adapted for U2E Apartments (single-location serviced accommodation).
 * Images reference the template CDN (whitelisted in next.config.mjs) as
 * placeholders until final assets are supplied.
 */

const CDN = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960ee";
const CDN2 = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960fb";

export const asset = {
  logo: `${CDN}/69fd7123c4554c1c76fa0b37_logo%20(7).svg`,
  bigLogo: `${CDN}/69fd7ef6028e81b8f58084df_big%20logo-p-1080.png`,
  hero: `${CDN}/69cb9b2da588175c76d781f2_hero%20(2)-p-1080.webp`,
  about: `${CDN}/69eb3c012916554d21e581fb_about%20(2)-p-1080.webp`,
  about2: `${CDN}/69eb4d2d6fa772455a67797e_about%20(4)-p-1080.webp`,
  meeting: `${CDN}/69ec54ef14d9212aaa11c8fd_meeting-p-1080.webp`,
  eventImage: `${CDN}/69df180534b4edf8dd2feb61_event%20image-p-1080.webp`,
  arrow: `${CDN}/69ede3ed906e4bccc214f42d_Vector.svg`,
} as const;

export const NAV_LINKS = [
  { label: "Accommodation", href: "/accommodation" },
  { label: "Dining", href: "/dining" },
  { label: "Experience", href: "/experience" },
  { label: "Meetings & Events", href: "/meetings-events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const CONTACT_PHONE = "000 111 2224";

export const HERO = {
  eyebrow: "Serviced Apartments",
  title: "Comfort Has a New Address",
  body: "Spacious 2 & 3 Bedroom Suites designed for comfort, safety, and everyday ease — book your stay in minutes.",
  cta: { label: "Reserve Your Suite", href: "/accomodation" },
} as const;

export const MARQUEE_IMAGES = [
  `${CDN}/69d8827e02d1b6de33edc5fb_marquee%20(4)-p-500.webp`,
  `${CDN}/69d8827e31f49b8eab2493c0_marquee%20(2)-p-500.webp`,
  `${CDN}/69d8827f6d3f3ab3cbebcae5_marquee%20(3)-p-500.webp`,
  `${CDN}/69d8827fa165465652446ff3_marquee%20(1)-p-500.webp`,
  `${CDN}/69d8827f02d1b6de33edc612_marquee%20(6)-p-500.webp`,
  `${CDN}/69d8827f1b92e567fd2d3cc2_marquee%20(7)-p-500.webp`,
];

export const ABOUT = {
  eyebrow: "About Us",
  title: "Welcome to U2E Apartments",
  body: "At U2E, we believe a great stay starts with a space that feels like home. Whether you're in town for a short trip or settling in for longer, our thoughtfully furnished 2 and 3 Bedroom Suites give you the comfort, privacy, and peace of mind you deserve — all wrapped in a warm, welcoming experience from check-in to check-out.",
  cta: { label: "Know More About Us", href: "/accommodation" },
} as const;

export const EXPERIENCES = {
  eyebrow: "Experiences",
  title: "Little Moments Made for Unwinding",
  body: "Sink into the spa, get your sweat on in the fitness studio, or linger over a long, delicious dinner. However you like to unwind, there's always something waiting for you here.",
  cta: { label: "Discover Our Experiences", href: "/experience" },
  items: [
    {
      title: "Spa & Wellness",
      desc: "Unwind in a serene spa where quiet rooms and skilled hands meet in harmony.",
      image: `${CDN2}/69cca2104b95bf2943a959d6_seasonal%20Experiance%20(3)-p-500.avif`,
    },
    {
      title: "Fitness Studio",
      desc: "Keep your rhythm in a fully equipped studio open around your schedule.",
      image: `${CDN2}/69d89273c27c6b025f814714_seasonal.avif`,
    },
    {
      title: "Fine Dining",
      desc: "Discover a seasonal menu prepared fresh by our in-house restaurant kitchen.",
      image: `${CDN2}/69d8c4902a568fd24cfe679b_seasonal%20(2).avif`,
    },
    {
      title: "Rooftop Lounge",
      desc: "Glide into the evening with skyline views and an easy, unhurried mood.",
      image: `${CDN}/69d8919cb637aa7b28d7119a_seasonal%20experinace%20(1).avif`,
    },
  ],
} as const;

export const QUOTE = {
  line1: "One Address",
  line2: "Every Comfort",
} as const;

export const ROOMS = {
  eyebrow: "Accommodation",
  title: "Pick the Perfect Space for You",
  body: "Every stay deserves a home base. Think of our serviced units as your private haven within the city.",
  cta: { label: "All Rooms", href: "/accommodation" },
  slides: [
    {
      index: "01 / 04",
      title: "Skyline One-Bedroom Suite",
      desc: "Open-plan living with panoramic city views and a full kitchenette.",
      image: `${CDN2}/69ef40783b0b1c050574eb99_villas%20(2)-p-1080.jpg`,
    },
    {
      index: "02 / 04",
      title: "Garden Studio Apartment",
      desc: "A calm, light-filled studio opening onto the landscaped courtyard.",
      image: `${CDN2}/69ef40cc96ec1977c86e140e_villas%20(3)-p-1080.jpg`,
    },
    {
      index: "03 / 04",
      title: "Two-Bedroom Residence",
      desc: "Room to spread out, work, and host — ideal for longer stays and families.",
      image: `${CDN2}/69ef41225283c5a0d84b08df_villas%20(4)-p-1080.jpg`,
    },
    {
      index: "04 / 04",
      title: "Classic Guest Room",
      desc: "A refined, comfortable room with everything you need close at hand.",
      image: `${CDN2}/69e9aba16606104101d4b85b_rooms%20(1)-p-500.avif`,
    },
  ],
} as const;

export const AMENITIES = {
  eyebrow: "Amenities",
  title: "Luxury and Comfort for a Great Stay",
  items: [
    { title: "State-of-the-Art Fitness Center", image: `${CDN}/69d742c81c6dd44ca65099a7_amenites%20(3)-p-1080.webp` },
    { title: "Luxury Spa & Wellness", image: `${CDN}/69d742c81e9d564367a89a31_amenites%20(1)-p-1080.webp` },
    { title: "Rooftop Pool with City Views", image: `${CDN}/69d742c82344bf64c5555732_amenites%20(4)-p-1080.webp` },
    { title: "Fine Dining Experience", image: `${CDN}/69d742c8d1b76312b7b17b30_amenites%20(2)-p-1080.webp` },
  ],
} as const;

export const VILLAS = {
  title: "All Villas",
  items: [
    {
      slug: "oceanfront-villa-retreat",
      name: "Oceanfront Villa Retreat",
      beds: "6 Bedroom",
      baths: "2 Washroom",
      area: "2200 sq ft",
      image: `${CDN2}/69ef40783b0b1c050574eb99_villas%20(2)-p-1080.jpg`,
    },
    {
      slug: "garden-view-luxury-villa",
      name: "Garden View Luxury Villa",
      beds: "6 Bedroom",
      baths: "2 Washroom",
      area: "2200 sq ft",
      image: `${CDN2}/69ef40cc96ec1977c86e140e_villas%20(3)-p-1080.jpg`,
    },
    {
      slug: "private-pool-sunset-villa",
      name: "Private Pool Sunset Villa",
      beds: "6 Bedroom",
      baths: "2 Washroom",
      area: "2200 sq ft",
      image: `${CDN2}/69ef41225283c5a0d84b08df_villas%20(4)-p-1080.jpg`,
    },
  ],
} as const;

export const WELLNESS = {
  eyebrow: "Spa & Wellness",
  title: "Pampering, Under One Roof",
  body: "Treat body and mind to time out. Our spa and fitness floor are tucked away from the bustle, so you can properly switch off.",
  cta: { label: "Explore wellness", href: "/experience" },
  image: `${CDN2}/69fd7d7a679f5b8f26da6f71_experiences.jpg`,
} as const;

export const GALLERY = {
  eyebrow: "Gallery",
  title: "Every Corner Tells a Story",
  body: "Step through a collection of moments that capture the warmth, calm, and comfort of U2E Apartments — a glimpse into restful stays and refined living, one frame at a time.",
  cta: { label: "Explore Our Gallery", href: "/gallery" },
  images: [
    `${CDN}/69e0bfa15f0fa8776fb91cc7_gallery%20(9)-p-1080.webp`,
    `${CDN}/69e0bfa20f07ad276eea151f_gallery%20(1)-p-1080.webp`,
    `${CDN}/69e0bfa219dcad6b4c990c91_gallery%20(4)-p-1080.webp`,
    `${CDN}/69e0bfa276fe0b0cd6933ad5_gallery%20(3)-p-1080.webp`,
  ],
} as const;

export const EVENTS = {
  eyebrow: "Meetings & Events",
  title: "Personalized Events",
  body: "Make our event spaces and private dining rooms the backdrop for your most memorable days.",
  items: [
    { title: "Weddings", desc: "Onsite catering and space to host all your guests for the celebration.", image: `/assets/u2e-wedding-events.webp` },
    { title: "Corporate", desc: "Flexible meeting rooms with the service and tech to keep the day running.", image: `${CDN}/69df1d789a136a534c367245_perosnal%20event%20(2)-p-500.webp` },
    { title: "Celebrations", desc: "Birthdays and anniversaries in a private setting with curated menus.", image: `${CDN}/69df1d78efdcbe81f3e4131f_perosnal%20event%20(3)-p-500.webp` },
  ],
} as const;

export const JOURNAL = {
  eyebrow: "Our Journal",
  title: "Discover All Our Stories",
  posts: [
    { tag: "Dining", title: "A Seasonal Table at the U2E Kitchen", image: `${CDN2}/69dcd8445b86d4b44f5a22ef_blog%20(2).jpg` },
    { tag: "Stays", title: "Making the Most of a Longer Stay", image: `${CDN2}/69df1004a87b40c7b362304a_blog%20(6).avif` },
    { tag: "Wellness", title: "A Slow Morning at the Spa Floor", image: `${CDN2}/69df135fd898c2065136aa1b_blog%20(1).avif` },
  ],
} as const;

export type SocialSource = "instagram" | "tiktok";

export const SOCIAL = {
  eyebrow: "@u2eapartments",
  title: "Fresh off the pass.",
  handle: "@u2eapartments",
  links: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
  },
  posts: [
    { src: `${CDN}/69e0bfa15f0fa8776fb91cc7_gallery%20(9)-p-500.webp`, source: "instagram" },
    { src: `${CDN}/69e0bfa20f07ad276eea151f_gallery%20(1)-p-500.webp`, source: "tiktok" },
    { src: `${CDN}/69e0bfa219dcad6b4c990c91_gallery%20(4)-p-500.webp`, source: "instagram" },
    { src: `${CDN}/69e0bfa276fe0b0cd6933ad5_gallery%20(3)-p-500.webp`, source: "tiktok" },
    { src: `${CDN}/69e0c43c76fe0b0cd6947744_galery%20(3)-p-1080.webp`, source: "instagram" },
    { src: `${CDN}/69d8827e02d1b6de33edc5fb_marquee%20(4)-p-500.webp`, source: "tiktok" },
  ] satisfies { src: string; source: SocialSource }[],
} as const;

export const FAQ = {
  eyebrow: "Good to Know",
  title: "Frequently Asked Questions",
  items: [
    {
      q: "What time is check-in and check-out?",
      a: "Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be arranged on request, subject to availability.",
    },
    {
      q: "How do I pay for my booking?",
      a: "You can pay online by card via Paystack at checkout, or by bank transfer — for transfers, email your receipt and booking reference to confirm your stay.",
    },
    {
      q: "Are the apartments serviced during my stay?",
      a: "Yes. Each unit is fully serviced with regular housekeeping, fresh linens, and 24/7 front-desk support throughout your stay.",
    },
    {
      q: "Can I book a meeting or event space?",
      a: "Absolutely. Our event spaces suit weddings, corporate meetings, and private celebrations — send an enquiry through the Meetings & Events page and our team will follow up.",
    },
    {
      q: "Do you offer in-house dining?",
      a: "Our restaurant serves a seasonal menu, and guests can order from the in-house kitchen. Room dining is available throughout the day.",
    },
  ],
} as const;

export const FOOTER = {
  columns: [
    {
      heading: "Explore",
      links: [
        { label: "Accommodation", href: "/accommodation" },
        { label: "Dining", href: "/dining" },
        { label: "Experience", href: "/experience" },
        { label: "Meetings & Events", href: "/meetings-events" },
      ],
    },
    {
      heading: "Discover",
      links: [
        { label: "Gallery", href: "/gallery" },
        // { label: "Journal", href: "/journal" },
        { label: "Contact Us", href: "/contact" },
        { label: "Book a Stay", href: "/accommodation" },
      ],
    },
  ],
  social: ["Instagram", "Facebook", "YouTube", "Tripadvisor"],
} as const;
