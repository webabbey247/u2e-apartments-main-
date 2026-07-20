"use client";

import Image from "next/image";
import { REASONS } from "@/lib/content/accommodation";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useImageScale, useParallax } from "@/hooks/use-animations";

function Reason({ text, index }: { text: string; index: number }) {
  return (
    <li className="flex gap-5 border-t border-mist2 pt-6">
      <span className="font-cinzel text-2xl text-brand">0{index + 1}</span>
      <p className="font-lato text-base leading-relaxed text-ink/75">{text}</p>
    </li>
  );
}

/**
 * "Reasons to stay" — ports `section_global_information`: a numbered list of
 * reasons beside a parallax feature image, with a Book Now CTA.
 */
export function ReasonsToStay() {
  const imgWrap = useParallax<HTMLDivElement>(0.12);
  const imgScale = useImageScale<HTMLDivElement>();

  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div ref={imgWrap}>
          <div ref={imgScale} className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src="/assets/why-u2e.jpg"
              alt="Reasons to stay at U2E"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {REASONS.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {REASONS.title}
          </RevealHeading>
          <ul className="mt-9 flex flex-col gap-6">
            {REASONS.items.map((text, i) => (
              <Reason key={i} text={text} index={i} />
            ))}
          </ul>
          <div className="mt-10">
            <BrandButton href={REASONS.cta.href} variant="solid">
              {REASONS.cta.label}
            </BrandButton>
          </div>
        </div>
      </div>
    </section>
  );
}
