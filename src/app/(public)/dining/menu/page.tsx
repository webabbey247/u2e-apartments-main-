import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MenuHero } from "@/components/dining/menu-hero";
import { MenuList } from "@/components/dining/menu-list";
import { getMenuItems } from "@/lib/queries/menu";

export const metadata: Metadata = {
  title: "Dining Menus — U2E Apartments",
  description:
    "Explore The U2E Kitchen's seasonal menu — starters, mains, desserts, and drinks, available to order to the table or in-suite.",
};

// Revalidate the CRM-backed menu periodically (ISR).
export const revalidate = 60;

export default async function DiningMenuPage() {
  const items = await getMenuItems();
  return (
    <>
      <Navbar />
      <main>
        <MenuHero />
        <MenuList items={items} />
      </main>
      <Footer />
    </>
  );
}
