"use client";

import Image from "next/image";
import { WELLNESS } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useImageScale } from "@/hooks/use-animations";

type WellnessContent = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  image: string;
};

/**
 * Wellness feature — split layout with a scale-in image (ports the yoga /
 * `section_global_yoga` reveal). Reusable across pages via `content`
 * (defaults to the home wellness block).
 */
export function Wellness({ content = WELLNESS }: { content?: WellnessContent }) {
  const imgRef = useImageScale<HTMLDivElement>();
  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div ref={imgRef} className="relative order-2 aspect-[4/5] overflow-hidden rounded-xl lg:order-1">
          <Image src={content.image} alt="Spa & wellness" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="order-1 max-w-xl lg:order-2">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {content.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {content.title}
          </RevealHeading>
          <p className="mt-6 font-lato text-base leading-relaxed text-ink/70 md:text-lg">
            {content.body}
          </p>
          <div className="mt-9">
            <BrandButton href={content.cta.href} variant="outline">
              {content.cta.label}
            </BrandButton>
          </div>
        </div>
      </div>
    </section>
  );
}
