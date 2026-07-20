import "server-only";
import { prisma } from "@/lib/prisma";
import { VILLAS } from "@/lib/content/home";
import { SUITES } from "@/lib/content/accommodation";

/** The shape the villa/room cards render. */
export type VillaCard = {
  slug: string;
  name: string;
  beds: string;
  baths: string;
  area: string;
  image: string;
};

/** The shape the suite listing cards render. */
export type SuiteCard = {
  slug: string;
  name: string;
  desc: string;
  image: string;
};

/** Fallback image if a room has no featured/gallery image. */
const FALLBACK_IMAGE = VILLAS.items[0].image;

/**
 * Villas for the guest site, read from `crm.Room` (authored in the CRM).
 * Falls back to the static placeholder list if the DB is unavailable so pages
 * never fail to render.
 */
export async function getVillas(): Promise<VillaCard[]> {
  try {
    const rooms = await prisma.room.findMany({
      where: { active: true },
      orderBy: { priceFrom: "asc" },
    });

    if (rooms.length === 0) return [...VILLAS.items];

    return rooms.map((r) => ({
      slug: r.slug,
      name: r.title,
      beds: `${r.bedrooms} Bedroom`,
      baths: `${r.bathrooms} Bathroom`,
      area: r.size,
      image: r.featuredImage ?? r.images[0] ?? FALLBACK_IMAGE,
    }));
  } catch (err) {
    console.error("[getVillas] falling back to static villas:", err);
    return [...VILLAS.items];
  }
}

/**
 * Suites for the accommodation listing, read from `crm.Room`. Falls back to the
 * static placeholder list if the DB is unavailable.
 */
export async function getSuites(): Promise<SuiteCard[]> {
  try {
    const rooms = await prisma.room.findMany({
      where: { active: true },
      orderBy: { priceFrom: "asc" },
    });

    if (rooms.length === 0) return SUITES.items.map((s) => ({ ...s }));

    return rooms.map((r) => ({
      slug: r.slug,
      name: r.title,
      desc: r.description,
      image: r.featuredImage ?? r.images[0] ?? FALLBACK_IMAGE,
    }));
  } catch (err) {
    console.error("[getSuites] falling back to static suites:", err);
    return SUITES.items.map((s) => ({ ...s }));
  }
}
