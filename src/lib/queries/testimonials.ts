import "server-only";
import { prisma } from "@/lib/prisma";
import { getGalleryImages, type GalleryPhoto } from "@/lib/queries/gallery";

/** One card in the stacked testimonial section. */
export type Testimonial = {
  id: string;
  /** Short pull-quote headline. Real reviews have no title, so one is derived. */
  headline: string;
  body: string;
  name: string;
  /** Secondary line under the name — room booked, or a stay descriptor. */
  detail: string;
  rating: number;
};

export type TestimonialContent = {
  items: Testimonial[];
  /** Backdrop photos, one per card. Always the same length as `items`. */
  images: GalleryPhoto[];
};

/** How many cards the stack shows. The template's choreography is built for 4. */
const CARD_COUNT = 4;

/**
 * Turn a review body into a short headline, since `Review` has no title field.
 * Takes the first sentence when it's a usable length, else the first few words.
 */
function headlineFrom(body: string): string {
  const firstSentence = body.split(/(?<=[.!?])\s/)[0]?.trim() ?? "";
  if (firstSentence.length >= 20 && firstSentence.length <= 70) {
    return firstSentence.replace(/[.]$/, "");
  }
  const words = body.trim().split(/\s+/).slice(0, 8).join(" ");
  return words.length ? `${words}…` : "A Stay Worth Repeating";
}

/** "Two Bedroom · March 2026" — whatever of the two we actually have. */
function detailFrom(roomTitle: string | null, createdAt: Date): string {
  // const when = createdAt.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return roomTitle!;
}

/**
 * The strongest approved reviews across the whole property, shaped for the
 * stacked testimonial cards, paired with gallery photos for the backdrop.
 *
 * Site-wide (unlike `getApprovedReviews`, which is per room) and rating-first,
 * because this is a marketing section rather than a full review list.
 *
 * Returns no items when there are no approved reviews (or the DB is
 * unavailable) — there is no placeholder copy. The section renders nothing on an
 * empty list, so pages simply omit it until real reviews exist.
 */
export async function getTestimonials(count = CARD_COUNT): Promise<TestimonialContent> {
  const empty: TestimonialContent = { items: [], images: [] };

  try {
    // Lead with the best-rated, then the most recent among equals.
    const rows = await prisma.review.findMany({
      where: { status: "APPROVED", rating: { gte: 4 } },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: count,
      select: {
        id: true,
        guestName: true,
        rating: true,
        body: true,
        roomTitle: true,
        createdAt: true,
      },
    });

    if (rows.length === 0) return empty;

    // Only fetch backdrop photos once we know there's a section to render.
    const images = await getGalleryImages(rows.length);

    return {
      items: rows.map((r) => ({
        id: r.id,
        headline: headlineFrom(r.body),
        body: r.body,
        name: r.guestName,
        detail: detailFrom(r.roomTitle || null, r.createdAt),
        rating: r.rating,
      })),
      images,
    };
  } catch (err) {
    console.error("[getTestimonials] no testimonials — hiding the section:", err);
    return empty;
  }
}
