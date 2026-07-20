/**
 * Dining page content + asset map. Layout/animation ported 1:1 from the
 * licensed Webflow `restaurant.html`; copy adapted for U2E Apartments'
 * in-house restaurant. Images reference the template CDN (whitelisted in
 * next.config.mjs) as documented placeholders until final assets are supplied.
 */

const CDN = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960ee";
const CDN2 = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960fb";

export const DINING_HERO = {
  eyebrow: "Dining",
  title: "Restaurant & Food",
  body: "An in-house kitchen at the heart of U2E — a seasonal menu, an easy wine list, and craft cocktails, served from breakfast through to the last table of the night.",
  image: `${CDN}/69e0d0f6d2412e4757438db1_hero%20(3).webp`,
} as const;

export const DINING_FEATURE = {
  eyebrow: "The U2E Kitchen",
  title: "Seasonal Plates, Thoughtfully Served",
  body: "Under the direction of our head chef, The U2E Kitchen offers an intimate, unforgettable dining experience that pairs comfort classics with contemporary flavour — complemented by a considered wine list and craft cocktails.",
  cta: { label: "Reserve a Table", href: "/contact" },
  image: `${CDN}/69e0d58bfb600feff632b52f_restaurant-5107511_1920%201%20(1).webp`,
} as const;

export const RESTAURANT_HOURS = {
  eyebrow: "Visit Us",
  title: "The U2E Kitchen",
  body: "Whether you're staying with us or dropping by, the kitchen is the perfect place to slow down over a good meal.",
  note: "*Reservations recommended",
  columns: [
    {
      heading: "Restaurant Hours",
      lines: ["Daily", "Brunch  7:00am – 3:00pm", "Dinner  3:00pm – 10:00pm"],
    },
    {
      heading: "Bar Hours",
      lines: ["Daily  7:00am – 12:00am", "Tapas Menu  3:00pm – 10:00pm"],
    },
  ],
} as const;

export const DINING_GALLERY = {
  eyebrow: "Explore",
  title: "Every Table, a Different Mood",
  images: [
    `/assets/dinning/dinning-gallery-1.webp`,
    `/assets/dinning/dinning-gallery-2.webp`,
  ],
} as const;

export const POOLSIDE = {
  eyebrow: "Poolside Dining",
  title: "Where the Day Slows Down",
  body: "Step outside to the poolside terrace — a lively, social setting among the gardens. Settle in with appetizers, salads, and sandwiches alongside craft cocktails and local favourites.",
  cta: { label: "Dining Menus", href: "/dining/menu" },
  image: `${CDN}/69e0d56b4893c0b47ca402de_information%20(2).webp`,
} as const;

// ── Menu sub-page (/dining/menu) ──────────────────────────────────────────
export type MenuItem = { name: string; desc: string; price: string; image: string };
export type MenuCategory = { name: string; items: MenuItem[] };

export const MENU_INTRO = {
  eyebrow: "The U2E Kitchen",
  title: "Dining Menus",
  body: "A seasonal selection served fresh from our in-house kitchen. Guests can order to the table or in-suite throughout the day.",
  image: `${CDN}/69e0d58bfb600feff632b52f_restaurant-5107511_1920%201%20(1).webp`,
} as const;

export const MENU: MenuCategory[] = [
  {
    name: "Starters",
    items: [
      { name: "Charred Corn Elote", desc: "Grilled sweetcorn, chilli-lime butter, cotija, coriander.", price: "₦6,500", image: `${CDN2}/69cca2104b95bf2943a959d6_seasonal%20Experiance%20(3)-p-500.avif` },
      { name: "Seared Scallops", desc: "Pan-seared scallops, pea purée, crisp pancetta.", price: "₦12,000", image: `${CDN2}/69d89273c27c6b025f814714_seasonal.avif` },
      { name: "Burrata & Heirloom Tomato", desc: "Creamy burrata, basil oil, aged balsamic, sourdough.", price: "₦8,000", image: `${CDN2}/69d8c4902a568fd24cfe679b_seasonal%20(2).avif` },
    ],
  },
  {
    name: "Mains",
    items: [
      { name: "Herb-Crusted Sea Bass", desc: "Fillet of sea bass, lemon butter, seasonal greens.", price: "₦18,500", image: `${CDN}/69e0d9778f7f98b647c60941_resturent.webp` },
      { name: "Dry-Aged Ribeye", desc: "300g ribeye, roasted bone marrow, hand-cut chips.", price: "₦26,000", image: `${CDN}/69ec97814b36402410ac9658_reesturant%20slider%20(2)%20(1).webp` },
      { name: "Wild Mushroom Risotto", desc: "Arborio rice, wild mushrooms, parmesan, truffle oil.", price: "₦14,000", image: `${CDN}/69ec97546fabb03c26212754_reesturant%20slider%20(3).webp` },
    ],
  },
  {
    name: "Desserts",
    items: [
      { name: "Dark Chocolate Fondant", desc: "Warm chocolate fondant, salted caramel, vanilla ice cream.", price: "₦7,000", image: `${CDN}/69ec975405d918ee9d88ed44_reesturant%20slider%20(1).webp` },
      { name: "Citrus Tart", desc: "Torched meringue, candied zest, raspberry coulis.", price: "₦6,500", image: `${CDN2}/69d89273c27c6b025f814714_seasonal.avif` },
    ],
  },
  {
    name: "Drinks",
    items: [
      { name: "House Signature Cocktail", desc: "Bespoke craft cocktail from our bar team.", price: "₦9,000", image: `${CDN2}/69d8c4902a568fd24cfe679b_seasonal%20(2).avif` },
      { name: "Sommelier's Wine Selection", desc: "A rotating pour from our curated wine list.", price: "₦8,500", image: `${CDN2}/69cca2104b95bf2943a959d6_seasonal%20Experiance%20(3)-p-500.avif` },
    ],
  },
];
