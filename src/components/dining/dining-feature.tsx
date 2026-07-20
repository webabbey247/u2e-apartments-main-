"use client";

import Image from "next/image";
import { DINING_FEATURE } from "@/lib/content/dining";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useImageScale, useParallax } from "@/hooks/use-animations";

/**
 * Restaurant feature — ports `section_global_information`: the restaurant intro
 * beside a parallax feature image (`parallax` + `image-scale`), with a
 * "Reserve a Table" CTA.
 */
export function DiningFeature() {
  const wrap = useParallax<HTMLDivElement>(0.14);
  const scale = useImageScale<HTMLDivElement>();

  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {DINING_FEATURE.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {DINING_FEATURE.title}
          </RevealHeading>
          <p className="mt-6 font-lato text-base leading-relaxed text-ink/70 md:text-lg">
            {DINING_FEATURE.body}
          </p>
          <div className="mt-9">
            <BrandButton href={DINING_FEATURE.cta.href} variant="solid">
              {DINING_FEATURE.cta.label}
            </BrandButton>
          </div>
        </div>

        <div ref={wrap}>
          <div ref={scale} className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src="/assets/dinning/dinning-gallery-4.webp"
              alt="The U2E Kitchen"
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
