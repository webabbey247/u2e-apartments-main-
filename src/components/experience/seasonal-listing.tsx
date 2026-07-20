"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EXPERIENCE_LISTING } from "@/lib/content/experience";
import type { SeasonalExperience } from "@/lib/queries/experiences";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale, useMoveY } from "@/hooks/use-animations";
import { cn } from "@/lib/utils/cn";

type Item = SeasonalExperience;

function ExperienceCard({
  item,
  registerRef,
}: {
  item: Item;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const imgRef = useImageScale<HTMLDivElement>();
  const textRef = useMoveY<HTMLDivElement>();

  return (
    <article ref={registerRef} className="scroll-mt-32">
      <div ref={imgRef} className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width:1024px) 100vw, 55vw"
          className="object-cover"
        />
        {/* "View" hover affordance (ports `.view_icon`). */}
        <span className="absolute left-6 top-6 flex h-16 w-16 scale-90 items-center justify-center rounded-full bg-paper font-montserrat text-xs uppercase tracking-[0.15em] text-ink opacity-0 transition-all duration-500 ease-brand group-hover:scale-100 group-hover:opacity-100">
          View
        </span>
      </div>
      <div ref={textRef} className="mt-6">
        <h3 className="font-cinzel text-3xl text-ink md:text-4xl">{item.title}</h3>
        <p className="mt-3 max-w-md font-lato text-base leading-relaxed text-ink/70">
          {item.desc}
        </p>
      </div>
    </article>
  );
}

/**
 * Seasonal listing — ports `section_seasonal_listing`: a sticky activity index
 * beside a normally-scrolling column of cards. As the cards scroll, the index
 * highlights the activity currently in view (scroll-spy via IntersectionObserver);
 * clicking an index item scrolls to its card. Each card image scales in and
 * reveals a "View" affordance on hover. `items` are the spotlit `crm.Experience`
 * rows; the section copy around them stays editorial.
 */
export function SeasonalListing({ items }: { items: Item[] }) {
  const cardEls = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardEls.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      // A thin band across the viewport middle → a card is "active" as it crosses center.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    cardEls.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  const goTo = (i: number) => {
    cardEls.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1300px]">
        <div className="mb-14 max-w-xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {EXPERIENCE_LISTING.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {EXPERIENCE_LISTING.title}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-ink/70">
            {EXPERIENCE_LISTING.body}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Sticky index */}
          <div className="hidden lg:block">
            <ul className="sticky top-32 flex flex-col gap-5 self-start">
              {items.map((item, i) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active}
                    className={cn(
                      "font-cinzel text-3xl transition-colors duration-500 ease-brand md:text-4xl",
                      i === active ? "text-ink" : "text-ink/25 hover:text-ink/50",
                    )}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Scrolling cards */}
          <div className="flex flex-col gap-20 md:gap-28">
            {items.map((item, i) => (
              <ExperienceCard
                key={item.key}
                item={item}
                registerRef={(el) => {
                  cardEls.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
