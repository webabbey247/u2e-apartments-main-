/**
 * Contact page content. No template — original design on the U2E system.
 * Contact details / map coordinates are placeholders until provided. The hero
 * image references the template CDN (whitelisted) as a documented placeholder.
 */

const CDN = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960ee";

export const CONTACT_HERO = {
  eyebrow: "Contact",
  title: "Get in Touch",
  body: "Questions about a stay, an event, or dining — or something you'd like to share? We'd love to hear from you.",
  image: `/assets/u2e-contact-us-hero.webp`,
} as const;

export const CONTACT_DETAILS = {
  intro: "Reach us directly, or send a message using the form — our team typically replies within one business day.",
  items: [
    { label: "Visit", value: "12 Marina Boulevard, Victoria Island, Lagos" },
    { label: "Call", value: "+234 000 111 2224", href: "tel:+2340001112224" },
    { label: "Email", value: "hello@u2eapartments.com", href: "mailto:hello@u2eapartments.com" },
    { label: "Front Desk", value: "Open 24 hours, every day" },
  ],
  mapLabel: "View on Google Maps",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Victoria+Island+Lagos",
} as const;

export const CONTACT_SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Tripadvisor", href: "https://tripadvisor.com" },
] as const;

export const CONTACT_FORM = {
  eyebrow: "Send a Message",
  title: "How Can We Help?",
} as const;

export const CONTACT_FAQ = {
  eyebrow: "Before You Write",
  title: "Quick Answers",
  items: [
    {
      q: "How soon will I hear back?",
      a: "We aim to respond to every message within one business day. For urgent stay-related matters, calling the front desk is fastest.",
    },
    {
      q: "Can you help me with an existing booking?",
      a: "Yes — include your booking reference (BKG-XXXXXX) in your message and we'll pull up your reservation right away.",
    },
    {
      q: "Do you have parking on-site?",
      a: "Secure on-site parking is available for guests. Let us know your arrival time and we'll have a space ready.",
    },
    {
      q: "How do I get there?",
      a: "We're on Marina Boulevard, Victoria Island — a short drive from the city centre. Use the map below for directions, or ask us about airport transfers.",
    },
  ],
} as const;

/**
 * Google Maps embed URL (no API key needed for the public embed). Swap the
 * query for exact coordinates once the real location is confirmed.
 */
export const CONTACT_MAP_EMBED =
  "https://www.google.com/maps?q=Victoria+Island+Lagos&output=embed";
