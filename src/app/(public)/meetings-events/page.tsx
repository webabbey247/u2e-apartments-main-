import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EventsHero } from "@/components/meetings/events-hero";
// import { EventsIntro } from "@/components/meetings/events-intro";
import { EventOccasions } from "@/components/meetings/event-occasions";
// import { EventSpaces } from "@/components/meetings/event-spaces";
import { UpcomingEvents } from "@/components/meetings/upcoming-events";
// import { EnquiryForm } from "@/components/meetings/enquiry-form";
import { SocialMediaMarquee } from "@/components/home/social-marquee";
// import { RoomsSlider } from "@/components/home/rooms-slider";
import { getVillas } from "@/lib/queries/rooms";
import { getUpcomingEvents } from "@/lib/queries/events";

export const metadata: Metadata = {
  title: "Meetings & Events — U2E Apartments",
  description:
    "Host meetings, weddings, and celebrations at U2E — flexible indoor and outdoor event spaces with full service. Enquire for a tailored proposal.",
};

// Revalidate the CRM-backed villas periodically (ISR).
export const revalidate = 60;


export default async function MeetingsEventsPage() {
  const [villas, events] = await Promise.all([getVillas(), getUpcomingEvents()]);
  return (
    <>
      <Navbar />
      <main>
        {/* Order follows the template: hero → intro → essentials → occasions →
            spaces → feature → enquiry → instagram → footer */}
        <EventsHero />
        {/* <EventsIntro /> */}
        <EventOccasions />
        {/* <EventSpaces /> */}
        <UpcomingEvents items={events} />
        {/* <RoomsSlider items={villas} /> */}
        {/* <EnquiryForm /> */}
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
