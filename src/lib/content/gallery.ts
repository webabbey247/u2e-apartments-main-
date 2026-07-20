/**
 * Gallery page content + asset map. Layout/animation ported 1:1 from the
 * licensed Webflow `gallery.html`; copy adapted for U2E Apartments. Images
 * reference the template CDN (whitelisted in next.config.mjs) as documented
 * placeholders. `category` mirrors CLAUDE.md's GalleryImage tags.
 */

const CDN = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960ee";

export type GalleryCategory = "Rooms" | "Dining" | "Events" | "Wellness";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "Rooms",
  "Dining",
  "Events",
  "Wellness",
];

export const GALLERY_HERO = {
  eyebrow: "Gallery",
  title: "Moments at U2E",
  body: "A curated look at the suites, dining, event spaces, and quiet corners that make a stay at U2E feel like home.",
  image: `${CDN}/69e0bfa15f0fa8776fb91cc7_gallery%20(9).webp`,
} as const;

export type GalleryImage = {
  src: string;
  category: GalleryCategory;
  alt: string;
  /** Layout hint for the masonry grid. */
  span?: "wide" | "tall";
};

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: `${CDN}/69e0bfa276fe0b0cd6933ad5_gallery%20(3).webp`, category: "Rooms", alt: "Suite interior", span: "tall" },
  { src: `${CDN}/69e0c43c76fe0b0cd6947744_galery%20(3).webp`, category: "Dining", alt: "The U2E Kitchen" },
  { src: `${CDN}/69e0bfa219dcad6b4c990c91_gallery%20(4).webp`, category: "Rooms", alt: "Bedroom detail" },
  { src: `${CDN}/69e0bfa20f07ad276eea151f_gallery%20(1).webp`, category: "Events", alt: "Event space", span: "wide" },
  { src: `${CDN}/69e0bfa15f0fa8776fb91cc7_gallery%20(9).webp`, category: "Wellness", alt: "Spa and wellness", span: "tall" },
  { src: `${CDN}/69e0bfa12c7a4c612492dfa5_gallery%20(12).webp`, category: "Dining", alt: "Plated dish" },
  { src: `${CDN}/69e0bfa1caa9eb81047fa596_gallery%20(5).webp`, category: "Rooms", alt: "Living area" },
  { src: `${CDN}/69e0bfa08ba9092cfb25a729_gallery%20(6).webp`, category: "Events", alt: "Celebration setup" },
  { src: `${CDN}/69e0bfa0c56aae58cf3655fc_gallery%20(7).webp`, category: "Wellness", alt: "Poolside", span: "wide" },
  { src: `${CDN}/69e0c43c68aeee8a6f0c885b_galery%20(1).webp`, category: "Dining", alt: "Bar and lounge" },
];

export const GALLERY_WELLNESS = {
  eyebrow: "Spa & Wellness",
  title: "Space to Breathe",
  body: "Beyond the frame — our spa and fitness floor are tucked away from the bustle, so you can properly switch off between days.",
  cta: { label: "Explore wellness", href: "/experience" },
  image: `${CDN}/69e0bfa0c56aae58cf3655fc_gallery%20(7).webp`,
} as const;
