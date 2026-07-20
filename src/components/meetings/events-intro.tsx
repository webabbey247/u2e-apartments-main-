"use client";

import Image from "next/image";
import { EVENTS_INTRO } from "@/lib/content/meetings";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useImageScale, useParallax } from "@/hooks/use-animations";

/**
 * Events intro — ports `section_global_information`: the gathering intro +
 * capacity copy beside a parallax feature image (`parallax` + `image-scale`),
 * with a "Request Proposal" CTA.
 */
export function EventsIntro() {
  const wrap = useParallax<HTMLDivElement>(0.14);
  const scale = useImageScale<HTMLDivElement>();

  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {EVENTS_INTRO.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {EVENTS_INTRO.title}
          </RevealHeading>
          <p className="mt-6 font-lato text-base leading-relaxed text-ink/70 md:text-lg">
            {EVENTS_INTRO.body}
          </p>
          <div className="mt-9">
            <BrandButton href={EVENTS_INTRO.cta.href} variant="solid">
              {EVENTS_INTRO.cta.label}
            </BrandButton>
          </div>
        </div>

        <div ref={wrap}>
          <div ref={scale} className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src={EVENTS_INTRO.image}
              alt="U2E event space"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
