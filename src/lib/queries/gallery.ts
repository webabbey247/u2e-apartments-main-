import "server-only";
import { prisma } from "@/lib/prisma";
import { MARQUEE_IMAGES, GALLERY } from "@/lib/content/home";

export type GalleryPhoto = { src: string; alt: string };

/**
 * All gallery images (any category) for the gallery page, read from
 * `crm.GalleryImage` (active only, ordered by sortOrder), capped at `limit`.
 * Falls back to the static gallery set if the DB is unavailable or empty.
 */
export async function getAllGalleryImages(limit = 20): Promise<GalleryPhoto[]> {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
      select: { image: true, alt: true },
    });

    if (images.length === 0) {
      return GALLERY.images.slice(0, limit).map((src) => ({ src, alt: "U2E Apartments gallery" }));
    }
    return images.map((i) => ({ src: i.image, alt: i.alt || "U2E Apartments gallery" }));
  } catch (err) {
    console.error("[getAllGalleryImages] falling back to static gallery:", err);
    return GALLERY.images.slice(0, limit).map((src) => ({ src, alt: "U2E Apartments gallery" }));
  }
}

/**
 * `count` random gallery images (any category), read from `crm.GalleryImage`
 * (active only). Uses SQL `random()` so the selection reshuffles each ISR
 * revalidation. Falls back to the static teaser images if the DB is empty.
 */
export async function getGalleryImages(count = 5): Promise<GalleryPhoto[]> {
  try {
    const rows = await prisma.$queryRaw<{ image: string; alt: string }[]>`
      SELECT image, alt FROM crm."GalleryImage"
      WHERE active = true
      ORDER BY random()
      LIMIT ${count}
    `;

    if (rows.length === 0) {
      return GALLERY.images.slice(0, count).map((src) => ({ src, alt: "U2E Apartments gallery" }));
    }
    return rows.map((r) => ({ src: r.image, alt: r.alt || "U2E Apartments gallery" }));
  } catch (err) {
    console.error("[getGalleryImages] falling back to static gallery:", err);
    return GALLERY.images.slice(0, count).map((src) => ({ src, alt: "U2E Apartments gallery" }));
  }
}

/**
 * Spotlight gallery images for the home-page marquee, read from
 * `crm.GalleryImage` (spotlight + active, ordered by sortOrder). Falls back to
 * the static placeholder strip if the DB is unavailable or has none.
 */
export async function getMarqueeImages(): Promise<string[]> {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { spotlight: true, active: true },
      orderBy: { sortOrder: "asc" },
      select: { image: true },
    });

    if (images.length === 0) return [...MARQUEE_IMAGES];
    return images.map((i) => i.image);
  } catch (err) {
    console.error("[getMarqueeImages] falling back to static marquee:", err);
    return [...MARQUEE_IMAGES];
  }
}
