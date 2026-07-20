import { RevealHeading } from "@/components/ui/reveal-heading";
import { QUOTE } from "@/lib/content/home";

/** Full-width statement band (ports `section_global_quote` stagger heading). */
export function Quote() {
  return (
    <section className="bg-ink px-6 py-28 text-center md:py-36">
      <RevealHeading className="font-cinzel text-4xl leading-[1.15] text-paper md:text-6xl lg:text-7xl">
        {QUOTE.line1}
        <br />
        <span className="text-gold">{QUOTE.line2}</span>
      </RevealHeading>
    </section>
  );
}
