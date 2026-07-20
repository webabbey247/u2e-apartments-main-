/**
 * Journal (blog) page content + asset map. Layout/animation ported 1:1 from the
 * licensed Webflow `blog.html`; copy adapted for U2E Apartments. Images
 * reference the template CDN (whitelisted in next.config.mjs) as documented
 * placeholders.
 *
 * NOTE: static placeholder data; Phase 3 swaps it for `GET /api/journal`
 * (introduces a `JournalPost` model in Phase 1).
 */

const CDN2 = "https://cdn.prod.website-files.com/69c9f978ea8ed16c5b8960fb";

export type JournalCategory = "News" | "Event" | "Culture" | "Experience";

export const JOURNAL_CATEGORIES: JournalCategory[] = [
  "News",
  "Event",
  "Culture",
  "Experience",
];

export const JOURNAL_HERO = {
  eyebrow: "Our Journal",
  title: "Our Journal",
  body: "Stories from U2E — dining, design, wellness, and the little moments that make a longer stay feel like home.",
  image: `${CDN2}/69df1004a87b40c7b362304a_blog%20(6).avif`,
} as const;

export type JournalPost = {
  slug: string;
  category: JournalCategory;
  title: string;
  excerpt: string;
  image: string;
  date: string;
};

/** A rich-text block for an article body (heading, paragraph, or image figure). */
export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "figure"; src: string; caption?: string };

export type Author = { name: string; role: string; avatar: string };

export const DEFAULT_AUTHOR: Author = {
  name: "The U2E Editorial Team",
  role: "U2E Apartments",
  avatar: `${CDN2}/69df135fd898c2065136aa1b_blog%20(1).avif`,
};

/**
 * Placeholder article body reused across posts until real content is wired via
 * `GET /api/journal/[slug]` (Phase 3). Original U2E copy.
 */
export const SAMPLE_ARTICLE_BODY: ArticleBlock[] = [
  { type: "heading", text: "Start With a Home Base That Does It All" },
  {
    type: "paragraph",
    text: "The best stays begin with somewhere that quietly takes care of the details — so you can focus on the reason you came. At U2E, that means a serviced suite, an in-house kitchen, a spa and fitness floor, and event spaces, all under one roof and a lift away.",
  },
  {
    type: "paragraph",
    text: "Whether you're here for a few nights or a few months, the rhythm is yours to set. Start the morning in the fitness studio, take a long lunch on the terrace, and end the day with dinner brought to your table by our kitchen.",
  },
  { type: "heading", text: "Settle In, Then Explore" },
  {
    type: "paragraph",
    text: "Comfort, flexibility, and convenience matter most on a longer stay. Each unit is designed for real living — a proper workspace, a full kitchenette, generous storage, and fast, reliable Wi-Fi — with housekeeping and a 24-hour front desk to smooth the edges.",
  },
  {
    type: "figure",
    src: `${CDN2}/69df0e232f693070015cff53_blog%20(3).avif`,
    caption: "Quiet corners designed for a slower pace.",
  },
  {
    type: "paragraph",
    text: "When you're ready to venture out, the neighbourhood's best cafés, galleries, and walks are all within easy reach — and our team is happy to point you toward the ones worth your time.",
  },
];

export const FEATURED_POST: JournalPost = {
  slug: "making-the-most-of-a-longer-stay",
  category: "News",
  title: "Making the Most of a Longer Stay",
  excerpt:
    "From setting up a comfortable home office to finding your rhythm with dining and wellness — a guide to settling in and getting the most from an extended stay at U2E.",
  image: `${CDN2}/69dcd8445b86d4b44f5a22ef_blog%20(2).jpg`,
  date: "2026-07-02",
};

export const JOURNAL_POSTS: JournalPost[] = [
  {
    slug: "a-seasonal-table-at-the-u2e-kitchen",
    category: "Culture",
    title: "A Seasonal Table at The U2E Kitchen",
    excerpt: "Behind the seasonal menu with our head chef — where the ingredients come from and how the dishes take shape.",
    image: `${CDN2}/69df135fd898c2065136aa1b_blog%20(1).avif`,
    date: "2026-06-24",
  },
  {
    slug: "a-slow-morning-at-the-spa-floor",
    category: "Experience",
    title: "A Slow Morning at the Spa Floor",
    excerpt: "How to build an unhurried morning around the spa, the pool, and a good breakfast.",
    image: `${CDN2}/69df0e232f693070015cff53_blog%20(3).avif`,
    date: "2026-06-12",
  },
  {
    slug: "rooftop-jazz-returns-this-season",
    category: "Event",
    title: "Rooftop Jazz Returns This Season",
    excerpt: "Our rooftop jazz nights are back — here's what to expect and how to reserve your place.",
    image: `${CDN2}/69df10a9f251db5d882a3e5b_blog%20(5).avif`,
    date: "2026-05-30",
  },
  {
    slug: "designing-a-calmer-city-stay",
    category: "Culture",
    title: "Designing a Calmer City Stay",
    excerpt: "The thinking behind our suites — light, texture, and quiet detail that make a room feel restful.",
    image: `${CDN2}/69df0f8e934223839a3a8c34_blog%20(4).avif`,
    date: "2026-05-18",
  },
  {
    slug: "new-wellness-treatments-this-month",
    category: "News",
    title: "New Wellness Treatments This Month",
    excerpt: "Fresh additions to the spa menu, plus a few tips for making the most of the fitness floor.",
    image: `${CDN2}/69df1004a87b40c7b362304a_blog%20(6).avif`,
    date: "2026-05-04",
  },
  {
    slug: "a-guide-to-the-neighbourhood",
    category: "Experience",
    title: "A Guide to the Neighbourhood",
    excerpt: "The cafés, galleries, and walks worth knowing when you're staying with us for a while.",
    image: `${CDN2}/69dcd8445b86d4b44f5a22ef_blog%20(2).jpg`,
    date: "2026-04-22",
  },
  {
    slug: "hosting-a-private-dinner-at-u2e",
    category: "Event",
    title: "Hosting a Private Dinner at U2E",
    excerpt: "How our team brings a private dining room to life — from menu to table setting.",
    image: `${CDN2}/69df10a9f251db5d882a3e5b_blog%20(5).avif`,
    date: "2026-04-08",
  },
  {
    slug: "the-art-on-our-walls",
    category: "Culture",
    title: "The Art on Our Walls",
    excerpt: "A short introduction to the artists and pieces you'll find throughout the building.",
    image: `${CDN2}/69df0f8e934223839a3a8c34_blog%20(4).avif`,
    date: "2026-03-26",
  },
  {
    slug: "spring-menu-first-look",
    category: "News",
    title: "Spring Menu: A First Look",
    excerpt: "A preview of the dishes joining The U2E Kitchen this spring.",
    image: `${CDN2}/69df135fd898c2065136aa1b_blog%20(1).avif`,
    date: "2026-03-10",
  },
];

/** Posts shown per page in the journal listing. */
export const JOURNAL_PAGE_SIZE = 6;

export const JOURNAL_WELLNESS = {
  eyebrow: "Spa & Wellness",
  title: "Between the Lines",
  body: "There's more to a stay than a good story — our spa and fitness floor are tucked away from the bustle, so you can properly switch off between days.",
  cta: { label: "Explore wellness", href: "/experience" },
  image: `${CDN2}/69df0e232f693070015cff53_blog%20(3).avif`,
} as const;

/** All posts (featured + listing), the source of truth for article routes. */
export const ALL_POSTS: JournalPost[] = [FEATURED_POST, ...JOURNAL_POSTS];

export const JOURNAL_SLUGS = ALL_POSTS.map((p) => p.slug);

export const getPost = (slug: string): JournalPost | undefined =>
  ALL_POSTS.find((p) => p.slug === slug);

/** Up to `count` other posts, preferring the same category. */
export const getRelatedPosts = (slug: string, count = 3): JournalPost[] => {
  const post = getPost(slug);
  const others = ALL_POSTS.filter((p) => p.slug !== slug);
  const sorted = post
    ? [...others].sort(
        (a, b) =>
          Number(b.category === post.category) - Number(a.category === post.category),
      )
    : others;
  return sorted.slice(0, count);
};
