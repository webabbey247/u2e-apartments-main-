"use client";

import Link from "next/link";
import Image from "next/image";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";
import type { UnitDetail } from "@/lib/content/units";

/**
 * Reservation block — ports `section_global_information`: bed-config note and a
 * "Make Reservation" CTA on the left beside a feature image on the right
 * (`image-scale`). CTA opens the booking wizard prefilled with the unit slug.
 */
export function ReservationCta({ unit }: { unit: UnitDetail }) {
  const imgRef = useImageScale<HTMLDivElement>();

  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-md">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {unit.category}
          </p>
          <RevealHeading className="font-cinzel text-3xl leading-tight text-ink md:text-4xl">
            {unit.name}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-ink/70">
            {unit.bedConfig} From {unit.priceFrom}.
          </p>
          <Link
            href={`/bookings?unit=${unit.slug}`}
            className="mt-8 inline-flex rounded-full border border-ink/20 px-8 py-4 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-all duration-500 ease-brand hover:border-brand hover:bg-brand hover:text-paper"
          >
            Make Reservation
          </Link>
        </div>

        <div ref={imgRef} className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={unit.gallery[1] ?? unit.gallery[0]}
            alt={unit.name}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
