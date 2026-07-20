"use client";

import Link from "next/link";
import Image from "next/image";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useMoveY, useImageScale } from "@/hooks/use-animations";
import type { UnitDetail } from "@/lib/content/units";

/**
 * Unit-detail hero — ports `section_hero_global` + `section_global_hero_center_content`:
 * a centered breadcrumb + `title-stagger` title on a dark band, followed by a
 * full-width room image (`image-scale`) with the specs (beds / baths / size)
 * overlaid at the bottom.
 */
export function UnitHero({ unit }: { unit: UnitDetail }) {
  const crumbRef = useMoveY<HTMLDivElement>({ delay: 0.35, onMount: true });
  const imgRef = useImageScale<HTMLDivElement>();

  return (
    <section>
      <div className="bg-ink px-6 pb-14 pt-36 text-center text-paper md:pb-16 md:pt-44">
        <div
          ref={crumbRef}
          className="mb-6 flex items-center justify-center gap-2 font-montserrat text-xs uppercase tracking-[0.2em] text-paper/60"
        >
          <Link href="/" className="transition-colors duration-300 ease-brand hover:text-paper">
            Home
          </Link>
          <span>/</span>
          <Link href="/accommodation" className="transition-colors duration-300 ease-brand hover:text-paper">
            Accommodation
          </Link>
          <span>/</span>
          <span className="text-brand">Room Details</span>
        </div>
        <RevealHeading
          as="h1"
          onMount
          className="mx-auto max-w-3xl font-cinzel text-4xl leading-tight text-paper md:text-6xl"
        >
          {unit.name}
        </RevealHeading>
      </div>

      {/* Full-width room image with specs overlay */}
      <div ref={imgRef} className="relative h-[52vh] min-h-[380px] w-full overflow-hidden md:h-[70vh]">
        <Image
          src={unit.gallery[0]}
          alt={unit.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <ul className="mx-auto flex max-w-[1300px] flex-wrap items-center gap-x-10 gap-y-2 px-6 pb-8 font-montserrat text-xs uppercase tracking-[0.15em] text-paper md:px-10 md:pb-10">
            <li>{unit.beds} Bedroom</li>
            <li className="h-3 w-px bg-paper/30" aria-hidden />
            <li>{unit.baths} Bathroom</li>
            <li className="h-3 w-px bg-paper/30" aria-hidden />
            <li>{unit.area}</li>
            <li className="h-3 w-px bg-paper/30" aria-hidden />
            <li className="text-gold">{unit.priceFrom}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
