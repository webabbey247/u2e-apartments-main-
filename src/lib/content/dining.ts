/**
 * Dining page content + asset map. Layout/animation ported 1:1 from the
 * licensed Webflow `restaurant.html`; copy adapted for U2E Apartments'
 * in-house restaurant. Images reference the template CDN (whitelisted in
 * next.config.mjs) as documented placeholders until final assets are supplied.
 */

const CDN = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960ee";
const CDN2 = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960fb";
const SANITY = "https://cdn.sanity.io/images/wdxob59c/production";

export const DINING_HERO = {
  eyebrow: "Dining",
  title: "Good Food, Made With Care",
  body: "From your first coffee of the day to the last table of the night, our in-house kitchen keeps things simple and delicious — a seasonal menu, an easy-to-love wine list, and craft cocktails made just right.",
  image: `/assets/dinning-hero.webp`,
} as const;

export const DINING_FEATURE = {
  eyebrow: "The U2E Kitchen",
  title: "Every Plate, Made With Intention",
  body: "Led by our head chef, The U2E Kitchen brings you an intimate dining experience where comfort classics meet contemporary flavor — paired with a thoughtful wine list and handcrafted cocktails.",
  cta: { label: "Reserve a Table", href: "/contact" },
  image: `/assets/dinning/dinning-gallery-4.webp`,
} as const;

export const RESTAURANT_MENU = {
  eyebrow: "Visit Us",
  title: "Straight from our kitchen.",
  body: "Staying with us or just passing through — either way, our kitchen is where you come to slow down and enjoy a really good meal.",
  note: "*Reservations recommended",
  // TODO: placeholder imagery — swap for U2E kitchen photography (or a
  // `crm.MenuItem` read) before launch.
  items: [
    { name: "Smoky party jollof", image: `${SANITY}/88d9b1a33e86c9c3b0c987778bd289ea13b2391b-736x736.jpg` },
    { name: "Fried rice & chicken", image: `${SANITY}/88caccc49dd0e7ce01167657b424f6305d563f7d-720x720.jpg` },
    { name: "Chicken shawarma", image: `${SANITY}/c0462f1159461429ee949fb6df4f5ebd5cd2fae4-720x960.jpg` },
    { name: "Peppered goat meat", image: `${SANITY}/c0462f1159461429ee949fb6df4f5ebd5cd2fae4-720x960.jpg` },
    { name: "Grilled tilapia", image: `${SANITY}/c61e679f769a38fdeaee0836648e1fe8d1ccb17f-736x1104.jpg` },
    { name: "Dodo & sides", image: `${SANITY}/41a740820ae53a7fb012e35e829946f06e086889-736x748.jpg` },
  ],
} as const;

export const DINING_GALLERY = {
  eyebrow: "Explore",
  title: "A New Mood at Every Table",
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
