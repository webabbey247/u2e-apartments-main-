import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactSplit } from "@/components/contact/contact-split";
import { ContactMap } from "@/components/contact/contact-map";
import { Faq } from "@/components/home/faq";
import { CONTACT_FAQ } from "@/lib/content/contact";
import { getFaqs } from "@/lib/queries/faqs";
import { getTestimonials } from "@/lib/queries/testimonials";
import { Testimonials } from "@/components/home/testimonials";

export const metadata: Metadata = {
  title: "Contact — U2E Apartments",
  description:
    "Get in touch with U2E Apartments — stays, events, and dining enquiries. Address, phone, email, FAQs, and directions.",
};

// Revalidate the CRM-backed FAQs periodically (ISR).
export const revalidate = 60;

export default async function ContactPage() {
  const [faq, testimonials] = await Promise.all([
    getFaqs(["SUPPORT", "GENERAL"], {
      eyebrow: CONTACT_FAQ.eyebrow,
      title: CONTACT_FAQ.title,
      fallbackItems: CONTACT_FAQ.items.map((i) => ({ ...i })),
    }),
    getTestimonials(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* hero → info + form split → testimonials → FAQs → map → footer */}
        <ContactHero />
        <ContactSplit />
        <Testimonials content={testimonials} />
        <Faq content={faq} />
        <ContactMap />
      </main>
      <Footer />
    </>
  );
}
