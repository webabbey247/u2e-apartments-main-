import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UnitHero } from "@/components/units/unit-hero";
import { RoomDetailsInfo } from "@/components/units/room-details-info";
import { ImageSlider } from "@/components/units/image-slider";
import { AmenitiesChecklist } from "@/components/units/amenities-checklist";
import { ReservationCta } from "@/components/units/reservation-cta";
import { SuitesListing } from "@/components/accommodation/suites-listing";
import { SocialMediaMarquee } from "@/components/home/social-marquee";
import { getUnitBySlug, getUnitSlugs } from "@/lib/queries/rooms";

// Revalidate the CRM-backed unit periodically (ISR); render unknown-at-build
// slugs on demand.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getUnitSlugs();
  return slugs.map((unitSlug) => ({ unitSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}): Promise<Metadata> {
  const { unitSlug } = await params;
  const unit = await getUnitBySlug(unitSlug);
  if (!unit) return { title: "Unit not found — U2E Apartments" };
  return {
    title: `${unit.name} — U2E Apartments`,
    description: unit.details.slice(0, 155),
  };
}

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}) {
  const { unitSlug } = await params;
  const unit = await getUnitBySlug(unitSlug);
  if (!unit) notFound();

  return (
    <>
      <Navbar />
      <main>
        {/* Order follows the template: hero(image+specs) → details → amenities
            → image slider → reservation → related suites → instagram → footer */}
        <UnitHero unit={unit} />
        <RoomDetailsInfo unit={unit} />
        <AmenitiesChecklist amenities={unit.amenities} />
        <ImageSlider images={unit.gallery} name={unit.name} />
        {/* <ReservationCta unit={unit} /> */}
        {/* <SuitesListing /> */}
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
