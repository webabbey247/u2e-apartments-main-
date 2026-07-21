/**
 * Meetings & Events page content + asset map. Layout/animation ported 1:1 from
 * the licensed Webflow `meeting-event.html`; copy adapted for U2E Apartments
 * (enquiry-based event spaces). Images reference the template CDN (whitelisted
 * in next.config.mjs) as documented placeholders.
 */

const CDN = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960ee";

export const EVENTS_HERO = {
  eyebrow: "Meetings & Events",
  title: "Meetings & Events",
  body: "Whatever your vision, U2E has the space to make it a reality — flexible indoor rooms, a rooftop terrace, gardens, and poolside settings, all with full service.",
  image: `/assets/u2e-meeting-events-hero.webp`,
} as const;

export const EVENTS_INTRO = {
  eyebrow: "Gather With Us",
  title: "Gather in an Elegant Setting",
  body: "From intimate boardroom meetings to celebrations for hundreds, our spaces balance intimacy with capacity. U2E comfortably hosts up to 350 guests for a seated dinner or 600 for a standing reception.",
  cta: { label: "Request Proposal", href: "#enquiry" },
  image: `${CDN}/69e8b77edef3845d2dfab4b2_inforamtion%20%20(1).webp`,
} as const;

export const ESSENTIALS = {
  eyebrow: "Why U2E",
  title: "The Essentials",
  cta: { label: "Make an Enquiry", href: "#enquiry" },
  items: [
    "Central location — walking distance to the city's business, dining, and cultural districts.",
    "Standout food & beverage catered by The U2E Kitchen.",
    "Flexible indoor spaces infused with natural light.",
    "Outdoor options — rooftop terrace, landscaped garden, and poolside.",
    "On-site coordination curating seamless setup and transport.",
    "Reliable AV, fast Wi-Fi, and full technical support.",
    "Boutique service with superior attention to every detail.",
  ],
} as const;

export const OCCASIONS = {
  eyebrow: "For Every Occasion",
  title: "A Space for Every Story",
  body: "From boardroom meetings to ballroom celebrations, we've shaped every space with intention — so whether you need something intimate or something grand, you'll find a setting that fits.",
  items: [
    "Galas & Fundraisers",
    "Birthday Dinners & Anniversaries",
    "Family Celebrations",
    "Engagement Parties & Showers",
    "Weddings & Receptions",
    "Corporate Events & Conferences",
    "And Much More",
  ],
} as const;

export const EVENT_SPACES = {
  eyebrow: "The Venues",
  title: "Spaces to Suit the Moment",
  items: [
    {
      name: "Rooftop Terrace",
      desc: "Open-air dining with skyline views and a relaxed evening ambiance for every occasion.",
      image: `${CDN}/69ec519f2a391b8a37d7accb_slider%20(7)-p-1080.webp`,
    },
    {
      name: "Garden Pavilion",
      desc: "A charming open-air space surrounded by greenery — perfect for casual gatherings and dining.",
      image: `${CDN}/69ec519fa080de8aa307980d_slider%20(6)-p-1080.webp`,
    },
    {
      name: "The Boardroom",
      desc: "A refined, light-filled meeting room for focused corporate sessions and private dinners.",
      image: `${CDN}/69ec522aa5582f6a7dc2ea14_slider%20(8)%20(1)-p-1080.webp`,
    },
  ],
} as const;

export const UPCOMING_EVENTS = {
  eyebrow: "What's On",
  title: "Good Times, Coming Up",
  body: "From cozy dinners to joyful celebrations, there's always something happening at U2E. Grab your spot early — these moments tend to fill up fast!",
  items: [
    {
      slug: "rooftop-jazz-night",
      title: "Rooftop Jazz Night",
      date: "2026-08-15",
      category: "Live Music",
      desc: "An evening of live jazz on the rooftop terrace, with craft cocktails and small plates under the skyline.",
      image: `${CDN}/69ec519f2a391b8a37d7accb_slider%20(7)-p-1080.webp`,
    },
    {
      slug: "chefs-table-tasting",
      title: "Chef's Table Tasting",
      date: "2026-08-29",
      category: "Dining",
      desc: "A seven-course seasonal tasting menu with wine pairings, hosted by The U2E Kitchen's head chef.",
      image: `${CDN}/69e0d58bfb600feff632b52f_restaurant-5107511_1920%201%20(1).webp`,
    },
    {
      slug: "garden-wellness-brunch",
      title: "Garden Wellness Brunch",
      date: "2026-09-12",
      category: "Wellness",
      desc: "A slow Sunday brunch in the garden pavilion, paired with a guided morning stretch and fresh juices.",
      image: `${CDN}/69ec519fa080de8aa307980d_slider%20(6)-p-1080.webp`,
    },
  ],
} as const;

export const EVENTS_FEATURE = {
  eyebrow: "Our Commitment",
  title: "Thoughtful Hosting, Every Time",
  body: "We host responsibly — sustainable sourcing, minimal waste, and a genuine care for our guests and community run through every event we run.",
  cta: { label: "Make an Enquiry", href: "#enquiry" },
  image: `${CDN}/69ecbc33e41c6d1524aa53fd_contact%20(1).webp`,
} as const;

export const ENQUIRY = {
  eyebrow: "Get in Touch",
  title: "Share Your Interest With Us",
  body: "Tell us about your event and our team will follow up with a tailored proposal.",
  eventTypes: [
    "Wedding & Reception",
    "Corporate Event",
    "Private Celebration",
    "Conference / Meeting",
    "Other",
  ],
} as const;
