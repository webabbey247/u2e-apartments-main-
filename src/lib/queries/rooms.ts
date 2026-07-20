import "server-only";
import { prisma } from "@/lib/prisma";
import { VILLAS } from "@/lib/content/home";
import { SUITES } from "@/lib/content/accommodation";
import { UNIT_AMENITIES, type UnitDetail, type Amenity } from "@/lib/content/units";

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

// ── Unit detail (crm.Room → UnitDetail) ───────────────────────────────────

/** UnitDetail plus the amenities list + raw booking values the modal needs. */
export type UnitDetailFull = UnitDetail & {
  amenities: Amenity[];
  /** Raw NGN price (per stay) — the formatted `priceFrom` is display-only. */
  priceValue: number;
  sleeps: number;
  extraBed: boolean;
  extraBedPrice: number;
};

const nairaFmt = new Intl.NumberFormat("en-NG");
const formatNaira = (n: number) => `₦${nairaFmt.format(n)}`;

/** Map a CRM `services` string to a known amenity icon, falling back to a check. */
const ICON_BY_LABEL = new Map(
  UNIT_AMENITIES.map((a) => [a.label.toLowerCase(), a.icon]),
);
function servicesToAmenities(services: string[]): Amenity[] {
  if (services.length === 0) return UNIT_AMENITIES;
  return services.map((label) => ({
    label,
    icon: ICON_BY_LABEL.get(label.toLowerCase()) ?? "safe-box",
  }));
}

function categoryFor(bedrooms: number): string {
  if (bedrooms === 0) return "Studio";
  if (bedrooms >= 3) return "Residence";
  return "Suite";
}

// Editorial highlights aren't authored per-room in the CRM; use a sensible
// default so the details layout stays balanced.
const DEFAULT_HIGHLIGHTS = [
  {
    title: "Rooftop Aperitif",
    desc: "Sundown reaches new heights on the rooftop, with sparkling wine and small plates against uninterrupted skyline views.",
  },
  {
    title: "In-Suite Dining",
    desc: "As the evening settles, the in-house kitchen brings a candlelit dinner to your suite — a seasonal menu, plated and served in private.",
  },
];

/** Active unit slugs for `generateStaticParams` (best effort; [] on error). */
export async function getUnitSlugs(): Promise<string[]> {
  try {
    const rooms = await prisma.room.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return rooms.map((r) => r.slug);
  } catch (err) {
    console.error("[getUnitSlugs] returning none:", err);
    return [];
  }
}

/** A single unit's detail, read from `crm.Room` by slug. `null` if not found. */
export async function getUnitBySlug(slug: string): Promise<UnitDetailFull | null> {
  try {
    const r = await prisma.room.findFirst({ where: { slug, active: true } });
    if (!r) return null;

    const gallery = [r.featuredImage, ...r.images].filter(
      (src): src is string => Boolean(src),
    );

    return {
      slug: r.slug,
      name: r.title,
      category: categoryFor(r.bedrooms),
      beds: r.bedrooms,
      baths: r.bathrooms,
      area: r.size,
      bedConfig: `Sleeps up to ${r.sleeps} guest${r.sleeps === 1 ? "" : "s"}.${
        r.extraBed ? " Extra bed available." : ""
      }`,
      details: r.description,
      highlights: DEFAULT_HIGHLIGHTS,
      gallery: gallery.length > 0 ? gallery : [FALLBACK_IMAGE],
      priceFrom: `${formatNaira(r.priceFrom)} / night`,
      amenities: servicesToAmenities(r.services),
      priceValue: r.priceFrom,
      sleeps: r.sleeps,
      extraBed: r.extraBed,
      extraBedPrice: r.extraBedPrice,
    };
  } catch (err) {
    console.error(`[getUnitBySlug:${slug}] error:`, err);
    return null;
  }
}
