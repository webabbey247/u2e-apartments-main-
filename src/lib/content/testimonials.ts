/**
 * Testimonial section framing copy.
 *
 * Layout/animation are ported from the licensed Webflow template's
 * `testimonial-section`; the copy is written for U2E Apartments (single
 * location, serviced 2 & 3 bedroom suites, in-house dining, wellness, events).
 *
 * The quotes themselves are always real approved reviews — there is no
 * placeholder copy here on purpose. With no approved reviews, `getTestimonials`
 * returns nothing and the section is omitted from the page entirely.
 */

export const TESTIMONIALS = {
  eyebrow: "Testimonials",
  title: "What Our Guests Say",
  body: "Every stay is a stay someone chose to talk about. Here's what guests take away from U2E Apartments.",
  cta: { label: "Browse Accommodation", href: "/accommodation" },
} as const;
