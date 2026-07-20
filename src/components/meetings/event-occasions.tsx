"use client";

import { OCCASIONS } from "@/lib/content/meetings";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useMoveY } from "@/hooks/use-animations";

/**
 * Spaces for all occasions — capacity copy beside an occasions list, each row
 * revealing with `move-y`.
 */
export function EventOccasions() {
  const listRef = useMoveY<HTMLUListElement>();

  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-md">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {OCCASIONS.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {OCCASIONS.title}
          </RevealHeading>
          <p className="mt-6 font-lato text-base leading-relaxed text-ink/70">
            {OCCASIONS.body}
          </p>
        </div>

        <ul ref={listRef} className="flex flex-col">
          {OCCASIONS.items.map((item) => (
            <li
              key={item}
              className="border-b border-mist2 py-5 font-cinzel text-2xl text-ink md:text-3xl"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
