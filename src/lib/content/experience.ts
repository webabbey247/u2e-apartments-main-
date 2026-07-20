/**
 * Experience page content + asset map. Layout/animation ported 1:1 from the
 * licensed Webflow `seasonal-experiences.html`; copy adapted for U2E's on-site
 * experiences (fitness, spa/relaxation, leisure). Images reference the template
 * CDN (whitelisted in next.config.mjs) as documented placeholders.
 */

const CDN2 = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960fb";

export const EXP_HERO = {
  eyebrow: "Experiences",
  title: "Ways to Unwind",
  body: "Recharge on your own terms — a fitness studio, a spa and wellness floor, a rooftop pool, and quiet corners to slow down, all a lift away from your suite.",
  image: `${CDN2}/69d8919cb637aa7b28d7119a_seasonal%20experinace%20(1).avif`,
} as const;

export const EXPERIENCE_LISTING = {
  eyebrow: "On-Site",
  title: "Experiences by the Floor",
  body: "From an early workout to an evening by the pool, there's always a new way to relax at U2E.",
  items: [
    {
      key: "Fitness Studio",
      headline: "Move & Recharge",
      desc: "A fully equipped fitness studio, open around your schedule, for a strong start or a clear-headed finish to the day.",
      image: `${CDN2}/69d8c4902a568fd24cfe679b_seasonal%20(2).avif`,
    },
    {
      key: "Spa & Wellness",
      headline: "Quiet Restoration",
      desc: "Treatment rooms and a calm wellness floor, tucked away from the bustle, for a proper reset.",
      image: `${CDN2}/69fd7d7a679f5b8f26da6f71_experiences.jpg`,
    },
    {
      key: "Rooftop Pool",
      headline: "Poolside Calm",
      desc: "Unwind by the rooftop pool, where skyline views and still water meet in easy harmony.",
      image: `${CDN2}/69d8919cb637aa7b28d7119a_seasonal%20experinace%20(1).avif`,
    },
    {
      key: "Rooftop Lounge",
      headline: "Evening Unwind",
      desc: "Slide into the evening at the rooftop lounge with a drink, skyline views, and an unhurried mood.",
      image: `${CDN2}/69d89273c27c6b025f814714_seasonal.avif`,
    },
    {
      key: "Wellness Garden",
      headline: "Escape Outdoors",
      desc: "Step into the landscaped garden — a green, quiet pocket for a slow morning coffee or a moment of stillness.",
      image: `${CDN2}/69cca2104b95bf2943a959d6_seasonal%20Experiance%20(3).avif`,
    },
  ],
} as const;

export const EXP_WELLNESS = {
  eyebrow: "Spa & Wellness",
  title: "Pampering, Under One Roof",
  body: "Treat body and mind to time out. Our spa and fitness floor are tucked away from the bustle, so you can properly switch off between days.",
  cta: { label: "Book a treatment", href: "/contact" },
  image: `${CDN2}/69fd7d7a679f5b8f26da6f71_experiences.jpg`,
} as const;
