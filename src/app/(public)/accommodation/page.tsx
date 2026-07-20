import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AccommodationHero } from "@/components/accommodation/accommodation-hero";
import { SuitesListing } from "@/components/accommodation/suites-listing";
import { ReasonsToStay } from "@/components/accommodation/reasons-to-stay";
// import { ResidencesGrid } from "@/components/accommodation/residences-grid";
import { Faq } from "@/components/home/faq";
import { ACC_FAQ } from "@/lib/content/accommodation";
// import { Experiences } from "@/components/home/experiences";
import { getSuites } from "@/lib/queries/rooms";
import { getFaqs } from "@/lib/queries/faqs";
import { SocialMediaMarquee } from "@/components/home/social-marquee";

export const metadata: Metadata = {
  title: "Accommodation — U2E Apartments",
  description:
    "Serviced suites and residences at U2E Apartments — refined stays with dining, wellness, and event spaces under one roof.",
};

// Revalidate the CRM-backed suites periodically (ISR) so new/edited rooms show.
export const revalidate = 60;

export default async function AccommodationPage() {
  const suites = await getSuites();
  const accFaq = await getFaqs("ACCOMMODATION", {
    eyebrow: ACC_FAQ.eyebrow,
    title: ACC_FAQ.title,
    fallbackItems: ACC_FAQ.items.map((i) => ({ ...i })),
  });

  return (
    <>
      <Navbar />
      <main>
        <AccommodationHero />
        <SuitesListing items={suites} />
        <ReasonsToStay />
        <Faq content={accFaq} />
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
