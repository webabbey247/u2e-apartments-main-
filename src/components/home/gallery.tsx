"use client";

import Image from "next/image";
import { GALLERY } from "@/lib/content/home";
import type { GalleryPhoto } from "@/lib/queries/gallery";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useImageScale } from "@/hooks/use-animations";
import { cn } from "@/lib/utils/cn";

// 5-image teaser: a 2×2 feature on the left, then a 2×2 block of four small.
// Tiles cleanly into the 4-col (lg) / 2-col (base) grid — no gaps.
const SPANS = [
  "col-span-2 row-span-2",
  "col-span-1",
  "col-span-1",
  "col-span-1",
  "col-span-1",
] as const;

function GalleryItem({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useImageScale<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("group relative overflow-hidden rounded-lg", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width:768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
      />
    </div>
  );
}

/** Gallery teaser — asymmetric grid of random gallery images, image-scale + hover zoom. */
export function Gallery({ images }: { images: GalleryPhoto[] }) {
  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
              {GALLERY.eyebrow}
            </p>
            <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
              {GALLERY.title}
            </RevealHeading>
            <p className="mt-5 font-lato text-base leading-relaxed text-ink/70">
              {GALLERY.body}
            </p>
          </div>
          <BrandButton href={GALLERY.cta.href} variant="outline">
            {GALLERY.cta.label}
          </BrandButton>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[240px] lg:grid-cols-4">
          {images.map((photo, i) => (
            <GalleryItem
              key={`${photo.src}-${i}`}
              src={photo.src}
              alt={photo.alt}
              className={SPANS[i % SPANS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
