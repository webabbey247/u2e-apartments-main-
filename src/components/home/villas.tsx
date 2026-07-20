"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useCoverScrub, useMoveY } from "@/hooks/use-animations";
import type { VillaCard as Villa } from "@/lib/queries/rooms";
import { BrandButton } from "../ui/brand-button";

function Spec({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {/* SVG rendered as a mask so it inherits our tokens (source icons ship a fixed fill). */}
      <span
        aria-hidden
        className="h-4 w-4 shrink-0 bg-paper"
        style={{
          maskImage: `url(/icons/${icon}.svg)`,
          WebkitMaskImage: `url(/icons/${icon}.svg)`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
      <span className="font-montserrat text-xs uppercase tracking-[0.12em] text-paper/90">
        {label}
      </span>
    </div>
  );
}

function VillaCard({ slug, name, beds, baths, area, image }: Villa) {
  const cardRef = useRef<HTMLElement | null>(null);
  const imgRef = useCoverScrub<HTMLDivElement>();
  // Reveal the overlay when the card (not the bottom-anchored overlay) enters view.
  const textRef = useMoveY<HTMLDivElement>({ triggerRef: cardRef });

  return (
    <article ref={cardRef} className="relative h-[86vh] min-h-[540px] w-full overflow-hidden">
      <div ref={imgRef} className="absolute inset-0">
        <Image
          src={image}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />

      {/* Overlaid content, centered at the bottom */}
      <div
        ref={textRef}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-12 text-center text-paper md:pb-16"
      >
        <h3 className="font-cinzel text-4xl text-paper md:text-5xl">{name}</h3>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <Spec icon="villa-bed" label={beds} />
          <Spec icon="villa-bath" label={baths} />
          <Spec icon="villa-area" label={area} />
        </div>

        <Link
          href={`/accommodation/${slug}`}
          className="group/link mt-6 inline-flex items-center gap-2 border-b border-paper/40 pb-1 font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-paper transition-colors duration-500 ease-brand hover:border-brand hover:text-brand"
        >
          View more
          <span aria-hidden className="transition-transform duration-500 ease-brand group-hover/link:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

/**
 * All Villas — ports `section_room_villas`: a heading over full-bleed,
 * full-width villa images with the name, spec row (icons), and "View more"
 * overlaid at the bottom center. Each image scales in (`image-scale`); the
 * overlaid content reveals with `move-y`.
 */
export function Villas({ items }: { items: Villa[] }) {
  const villas = items;

  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1300px]">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
             <div className="max-w-xl">
               <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
                 {ROOMS.eyebrow}
               </p>
               <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
                 {ROOMS.title}
               </RevealHeading>
               <p className="mt-5 max-w-md font-lato text-base leading-relaxed text-ink/70">
                 {ROOMS.body}
               </p>
             </div>
             <BrandButton href={ROOMS.cta.href} variant="outline">
               {ROOMS.cta.label}
             </BrandButton>
           </div>
   </div>

      <div className="flex flex-col">
        {villas.map((villa) => (
          <VillaCard key={villa.slug} {...villa} />
        ))}
      </div>
    </section>
  );
}
