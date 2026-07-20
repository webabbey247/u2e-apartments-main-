"use client";

import Image from "next/image";
import { GALLERY_HERO } from "@/lib/content/gallery";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useMoveY, useImageScale } from "@/hooks/use-animations";

/**
 * Gallery hero — ports `section_hero_global`: full-width image with an overlay,
 * a `title-stagger` title, and a `move-y` sub-copy entrance, plus a slow
 * `image-scale`. Mirrors `AccommodationHero` for a consistent page hero.
 */
export function GalleryHero() {
  const scaleRef = useImageScale<HTMLDivElement>();
  const bodyRef = useMoveY<HTMLDivElement>({ delay: 0.4, onMount: true });

  return (
    <section className="relative flex h-[75vh] min-h-[520px] w-full items-end overflow-hidden">
      <div ref={scaleRef} className="absolute inset-0">
        <Image
          src="/assets/home-hero-banner.webp"
          alt="U2E Apartments gallery"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1300px] px-6 pb-16 text-paper md:px-10 md:pb-24">
        <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.35em] text-paper/80">
          {GALLERY_HERO.eyebrow}
        </p>
        <RevealHeading
          as="h1"
          onMount
          className="max-w-3xl font-cinzel text-5xl leading-tight text-paper md:text-7xl"
        >
          {GALLERY_HERO.title}
        </RevealHeading>
        <p ref={bodyRef} className="mt-6 max-w-xl font-lato text-base leading-relaxed text-paper/85 md:text-lg">
          {GALLERY_HERO.body}
        </p>
      </div>
    </section>
  );
}
