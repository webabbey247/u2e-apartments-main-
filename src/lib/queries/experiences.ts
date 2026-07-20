import "server-only";
import { prisma } from "@/lib/prisma";
import { EXPERIENCES } from "@/lib/content/home";

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
