"use client";

import Image from "next/image";
import { HERO } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useMoveY, useImageScale } from "@/hooks/use-animations";

/**
 * Home header / hero — full-viewport image with an overlay and a staggered
 * title + copy entrance on load (ports `data-load="title-stagger" / move-y`),
 * plus a slow scale-in on the background (`data-scale="image-scale"`).
 */
export function Hero() {
  const scaleRef = useImageScale<HTMLDivElement>();
  const bodyRef = useMoveY<HTMLDivElement>({ delay: 0.5, onMount: true });

  return (
    <section id="hero" className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <div ref={scaleRef} className="absolute inset-0">
        <Image
          src="/assets/home-hero-banner.webp"
          alt="U2E Apartments"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/70" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-paper">
        <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.35em] text-paper/80">
          {HERO.eyebrow}
        </p>
        <RevealHeading
          as="h1"
          onMount
          className="max-w-4xl font-cinzel text-5xl leading-tight text-paper md:text-7xl lg:text-8xl"
        >
          {HERO.title}
        </RevealHeading>
        <div ref={bodyRef} className="mt-7 flex max-w-xl flex-col items-center gap-8">
          <p className="font-lato text-base leading-relaxed text-paper/85 md:text-lg">
            {HERO.body}
          </p>
          <BrandButton href={HERO.cta.href} variant="solid">
            {HERO.cta.label}
          </BrandButton>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-paper/70">
        <span className="block h-10 w-px animate-pulse bg-paper/50" />
      </div>
    </section>
  );
}
