import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ExperienceHero } from "@/components/experience/experience-hero";
import { SeasonalListing } from "@/components/experience/seasonal-listing";
import { Wellness } from "@/components/home/wellness";
import { SocialMediaMarquee } from "@/components/home/social-marquee";
import { EXP_WELLNESS } from "@/lib/content/experience";
import { RoomsSlider } from "@/components/home/rooms-slider";
import { getVillas } from "@/lib/queries/rooms";
import { getSeasonalExperiences } from "@/lib/queries/experiences";

export const metadata: Metadata = {
  title: "Experience — U2E Apartments",
  description:
    "On-site experiences at U2E Apartments — a fitness studio, spa and wellness floor, rooftop pool, and more.",
};

// Revalidate the CRM-backed villas periodically (ISR).
export const revalidate = 60;

export default async function ExperiencePage() {
  const [villas, experiences] = await Promise.all([getVillas(), getSeasonalExperiences()]);
  return (
    <>
      <Navbar />
      <main>
        {/* Order follows the template: centered hero → seasonal listing →
            wellness feature → instagram → footer */}
        <ExperienceHero />
        <SeasonalListing items={experiences} />
        {/* <RoomsSlider items={villas} /> */}
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
