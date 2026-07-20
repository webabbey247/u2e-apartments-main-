"use client";

import { RESTAURANT_HOURS } from "@/lib/content/dining";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useMoveY } from "@/hooks/use-animations";

function HoursColumn({ heading, lines }: { heading: string; lines: readonly string[] }) {
  const ref = useMoveY<HTMLDivElement>();
  return (
    <div ref={ref} className="border-t border-paper/15 pt-6">
      <h3 className="font-montserrat text-xs uppercase tracking-[0.2em] text-gold">
        {heading}
      </h3>
      <ul className="mt-4 space-y-2">
        {lines.map((line) => (
          <li key={line} className="font-lato text-base text-paper/85">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Restaurant hours — the visit/hours info block with a stagger heading and
 * `move-y` columns (Restaurant + Bar hours). Dark band for contrast.
 */
export function RestaurantHours() {
  return (
    <section className="bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-14 max-w-xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {RESTAURANT_HOURS.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-paper md:text-5xl">
            {RESTAURANT_HOURS.title}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-paper/70">
            {RESTAURANT_HOURS.body}
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {RESTAURANT_HOURS.columns.map((col) => (
            <HoursColumn key={col.heading} heading={col.heading} lines={col.lines} />
          ))}
        </div>

        <p className="mt-10 font-montserrat text-xs uppercase tracking-[0.15em] text-paper/50">
          {RESTAURANT_HOURS.note}
        </p>
      </div>
    </section>
  );
}
