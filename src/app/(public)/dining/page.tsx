import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DiningHero } from "@/components/dining/dining-hero";
import { DiningFeature } from "@/components/dining/dining-feature";
import { RestaurantMenu } from "@/components/dining/restaurant-menu";
import { ImageSlider } from "@/components/units/image-slider";
import { Wellness } from "@/components/home/wellness";
import { SocialMediaMarquee } from "@/components/home/social-marquee";
import { DINING_GALLERY, POOLSIDE } from "@/lib/content/dining";
import { getMenuDishes } from "@/lib/queries/menu";

export const metadata: Metadata = {
  title: "Dining — U2E Apartments",
  description:
    "The U2E Kitchen — a seasonal in-house restaurant with an orderable menu, wine list, and craft cocktails.",
};

// Revalidate the CRM-backed menu periodically (ISR).
export const revalidate = 60;

export default async function DiningPage() {
  const dishes = await getMenuDishes(6);
  return (
    <>
      <Navbar />
      <main>
        {/* Order follows the template: hero → restaurant feature → menu →
            explore gallery → poolside feature (menus CTA) → instagram → footer */}
        <DiningHero />
        <DiningFeature />
        <RestaurantMenu items={dishes} />
        <div className="bg-paper pt-24 md:pt-32">
          <div className="mx-auto mb-10 max-w-[1300px] px-6 md:px-10">
            <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
              {DINING_GALLERY.eyebrow}
            </p>
            <h2 className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
              {DINING_GALLERY.title}
            </h2>
          </div>
          <ImageSlider images={[...DINING_GALLERY.images]} name="U2E dining" />
        </div>
        {/* <Wellness content={POOLSIDE} /> */}
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
