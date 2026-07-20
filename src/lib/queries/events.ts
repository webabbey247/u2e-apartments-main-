import "server-only";
import { prisma } from "@/lib/prisma";
import { UPCOMING_EVENTS } from "@/lib/content/meetings";

/** The shape the upcoming-event cards render. */
export type EventCardData = {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD) — the card splits this into a day/month badge. */
  date: string;
  category: string;
  desc: string;
  image: string;
};

/** `eventDate` is a DATE-like column; format in UTC so the badge never drifts a day. */
function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Upcoming events for the Meetings & Events page, read from `crm.Event`
 * (active, dated today or later, soonest first), capped at `limit`. Falls back
 * to the static placeholder list if the DB is unavailable or has nothing
 * upcoming — the section should never render empty.
 */
export async function getUpcomingEvents(limit = 3): Promise<EventCardData[]> {
  try {
    // Compare against the start of today so an event happening today still shows.
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const rows = await prisma.event.findMany({
      where: { active: true, eventDate: { gte: today } },
      orderBy: { eventDate: "asc" },
      take: limit,
      include: { category: { select: { name: true } } },
    });

    if (rows.length === 0) return UPCOMING_EVENTS.items.map((i) => ({ ...i }));

    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      date: toIsoDate(r.eventDate),
      category: r.category.name,
      desc: r.description,
      image: r.image,
    }));
  } catch (err) {
    console.error("[getUpcomingEvents] falling back to static events:", err);
    return UPCOMING_EVENTS.items.map((i) => ({ ...i }));
  }
}
