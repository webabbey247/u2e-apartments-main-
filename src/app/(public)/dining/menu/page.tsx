import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MenuHero } from "@/components/dining/menu-hero";
import { MenuList } from "@/components/dining/menu-list";

export const metadata: Metadata = {
  title: "Dining Menus — U2E Apartments",
  description:
    "Explore The U2E Kitchen's seasonal menu — starters, mains, desserts, and drinks, available to order to the table or in-suite.",
};

export default function DiningMenuPage() {
  return (
    <>
      <Navbar />
      <main>
        <MenuHero />
        <MenuList />
      </main>
      <Footer />
    </>
  );
}
