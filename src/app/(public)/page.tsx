import { Preloader } from "@/components/home/preloader";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { About } from "@/components/home/about";
import { Experiences } from "@/components/home/experiences";
// import { RoomsSlider } from "@/components/home/rooms-slider";
// import { Amenities } from "@/components/home/amenities";
import { Villas } from "@/components/home/villas";
// import { Wellness } from "@/components/home/wellness";
import { Gallery } from "@/components/home/gallery";
import { Events } from "@/components/home/events";
// import { Journal } from "@/components/home/journal";
import { SocialMediaMarquee } from "@/components/home/social-marquee";
import { Faq } from "@/components/home/faq";
import { Footer } from "@/components/layout/footer";
import { getVillas } from "@/lib/queries/rooms";
import { getFaqs } from "@/lib/queries/faqs";
import { getMarqueeImages, getGalleryImages } from "@/lib/queries/gallery";
import { getSpotlightExperiences } from "@/lib/queries/experiences";
import { getUpcomingEvents } from "@/lib/queries/events";
import { FAQ } from "@/lib/content/home";
import { UpcomingEvents } from "@/components/meetings/upcoming-events";

// Revalidate the CRM-backed villas + FAQs + gallery periodically (ISR).
export const revalidate = 60;

export default async function HomePage() {
  const [villas, marqueeImages, galleryImages, experiences, events] = await Promise.all([
    getVillas(),
    getMarqueeImages(),
    getGalleryImages(5),
    getSpotlightExperiences(4),
    getUpcomingEvents(),
  ]);
  const faq = await getFaqs(["SUPPORT", "GENERAL"], {
    eyebrow: FAQ.eyebrow,
    title: FAQ.title,
    fallbackItems: FAQ.items.map((i) => ({ ...i })),
  });

  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Marquee images={marqueeImages} />
        <About />
        <Experiences items={experiences} />
         <Villas items={villas} />
        <Gallery images={galleryImages} />
         <UpcomingEvents items={events} />
        <Faq content={faq} />
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
