"use client";

import { ESSENTIALS } from "@/lib/content/meetings";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useMoveY } from "@/hooks/use-animations";

function Essential({ text, index }: { text: string; index: number }) {
  const ref = useMoveY<HTMLLIElement>();
  return (
    <li ref={ref} className="flex gap-5 border-t border-mist2 pt-6">
      <span className="font-cinzel text-2xl text-brand">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="font-lato text-base leading-relaxed text-ink/75">{text}</p>
    </li>
  );
}

/** The Essentials — numbered feature list with a `move-y` reveal + enquiry CTA. */
export function EventEssentials() {
  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
              {ESSENTIALS.eyebrow}
            </p>
            <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
              {ESSENTIALS.title}
            </RevealHeading>
          </div>
          <BrandButton href={ESSENTIALS.cta.href} variant="outline">
            {ESSENTIALS.cta.label}
          </BrandButton>
        </div>

        <ul className="grid gap-x-12 gap-y-6 md:grid-cols-2">
          {ESSENTIALS.items.map((text, i) => (
            <Essential key={i} text={text} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
