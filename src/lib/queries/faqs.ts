import "server-only";
import { prisma } from "@/lib/prisma";
import type { FaqCategory } from "@/generated/prisma/enums";

/** The content shape the `Faq` accordion renders. */
export type FaqContent = {
  eyebrow: string;
  title: string;
  items: { q: string; a: string }[];
};

type FaqSection = { eyebrow: string; title: string; fallbackItems: { q: string; a: string }[] };

/**
 * Guest-facing FAQs for one or more categories, read from `crm.Faq` (ordered by
 * category then sortOrder). Keeps the section framing (eyebrow/title) static and
 * swaps in DB items; falls back to the provided static items if the DB is
 * unavailable or empty.
 */
export async function getFaqs(
  category: FaqCategory | FaqCategory[],
  section: FaqSection,
): Promise<FaqContent> {
  const { eyebrow, title, fallbackItems } = section;
  const categories = Array.isArray(category) ? category : [category];
  try {
    const faqs = await prisma.faq.findMany({
      where: { category: { in: categories }, active: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });

    if (faqs.length === 0) return { eyebrow, title, items: fallbackItems };

    return {
      eyebrow,
      title,
      items: faqs.map((f) => ({ q: f.question, a: f.answer })),
    };
  } catch (err) {
    console.error(`[getFaqs:${categories.join(",")}] falling back to static FAQ:`, err);
    return { eyebrow, title, items: fallbackItems };
  }
}
