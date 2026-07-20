import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JournalHero } from "@/components/journal/journal-hero";
import { FeaturedPost } from "@/components/journal/featured-post";
import { JournalListing } from "@/components/journal/journal-listing";
import { SocialMediaMarquee } from "@/components/home/social-marquee";

export const metadata: Metadata = {
  title: "Journal — U2E Apartments",
  description:
    "Stories from U2E Apartments — dining, design, wellness, and the moments that make a longer stay feel like home.",
};

export default function JournalPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Order follows the template: hero → featured → listing → wellness → instagram → footer */}
        <JournalHero />
        <FeaturedPost />
        <JournalListing />
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
