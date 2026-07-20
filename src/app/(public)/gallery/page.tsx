import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GalleryHero } from "@/components/gallery/gallery-hero";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { SocialMediaMarquee } from "@/components/home/social-marquee";
import { Experiences } from "@/components/home/experiences";
import { getAllGalleryImages } from "@/lib/queries/gallery";
import { getSpotlightExperiences } from "@/lib/queries/experiences";

export const metadata: Metadata = {
  title: "Gallery — U2E Apartments",
  description:
    "A curated gallery of U2E Apartments — suites, dining, event spaces, and wellness.",
};

// Revalidate the CRM-backed gallery periodically (ISR).
export const revalidate = 60;

export default async function GalleryPage() {
 const [images, experiences] = await Promise.all([
    getAllGalleryImages(20),
    getSpotlightExperiences(4),
  ]);
  return (
    <>
      <Navbar />
      <main>
        {/* Order follows the template: hero → gallery grid → wellness → instagram → footer */}
        <GalleryHero />
        <GalleryGrid images={images} />
        <Experiences items={experiences} />
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
