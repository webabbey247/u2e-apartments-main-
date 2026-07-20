import "server-only";
import { prisma } from "@/lib/prisma";
import { EXPERIENCES } from "@/lib/content/home";
import { EXPERIENCE_LISTING } from "@/lib/content/experience";

/** The shape the home experience cards render. */
export type ExperienceCardData = {
  title: string;
  desc: string;
  image: string;
};

/**
 * Spotlight experiences for the home section, read from `crm.Experience`
 * (spotlight + active, ordered by sortOrder), capped at `limit`. Falls back to
 * the static placeholder list if the DB is unavailable or empty.
 */
export async function getSpotlightExperiences(limit = 4): Promise<ExperienceCardData[]> {
  try {
    const rows = await prisma.experience.findMany({
      where: { spotlight: true, active: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });

    if (rows.length === 0) return EXPERIENCES.items.map((i) => ({ ...i }));

    return rows.map((r) => ({
      title: r.title,
      desc: r.description,
      image: r.image,
    }));
  } catch (err) {
    console.error("[getSpotlightExperiences] falling back to static experiences:", err);
    return EXPERIENCES.items.map((i) => ({ ...i }));
  }
}

/** A row in the seasonal listing: the sticky index label plus the card body. */
export type SeasonalExperience = {
  /** Stable React key + scroll-spy identity. */
  key: string;
  /** Shown both in the left index and as the card headline. */
  title: string;
  desc: string;
  image: string;
};

/**
 * Spotlight experiences for the Experience page's seasonal listing, read from
 * `crm.Experience` (spotlight + active, ordered by sortOrder). Falls back to
 * the static listing if the DB is unavailable or has no spotlit rows.
 */
export async function getSeasonalExperiences(): Promise<SeasonalExperience[]> {
  try {
    const rows = await prisma.experience.findMany({
      where: { spotlight: true, active: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, description: true, image: true },
    });

    if (rows.length === 0) {
      return EXPERIENCE_LISTING.items.map((i) => ({
        key: i.key,
        title: i.headline,
        desc: i.desc,
        image: i.image,
      }));
    }

    return rows.map((r) => ({
      key: r.id,
      title: r.title,
      desc: r.description,
      image: r.image,
    }));
  } catch (err) {
    console.error("[getSeasonalExperiences] falling back to static listing:", err);
    return EXPERIENCE_LISTING.items.map((i) => ({
      key: i.key,
      title: i.headline,
      desc: i.desc,
      image: i.image,
    }));
  }
}
