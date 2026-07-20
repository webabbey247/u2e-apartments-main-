"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/content/home";
import type { VillaCard as Villa } from "@/lib/queries/rooms";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { cn } from "@/lib/utils/cn";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Accommodation slider — ports the `section_home_slider` card slider with
 * prev/next arrows and cross-fading slides (`slide-01/02/03`). Active slide
 * image cross-fades + scales; text slides up. Slides are the CRM villas/rooms.
 */
export function RoomsSlider({ items }: { items: Villa[] }) {
  const [active, setActive] = useState(0);
  const slides = items;
  const total = slides.length;
  const go = (dir: number) => setActive((i) => (i + dir + total) % total);

  if (total === 0) return null;

  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
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

        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          {/* Image stage — cross-fade + scale */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            {slides.map((s, i) => (
              <Image
                key={s.slug}
                src={s.image}
                alt={s.name}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className={cn(
                  "object-cover transition-all duration-[900ms] ease-brand",
                  i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            ))}
          </div>

          {/* Text stage + controls */}
          <div className="flex flex-col justify-between py-2">
            <div className="relative min-h-[11rem] overflow-hidden">
              {slides.map((s, i) => (
                <div
                  key={s.slug}
                  className={cn(
                    "transition-all duration-700 ease-brand",
                    i === active
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none absolute inset-0 translate-y-6 opacity-0",
                  )}
                >
                  <span className="font-montserrat text-sm tracking-[0.2em] text-brand">
                    {pad(i + 1)} / {pad(total)}
                  </span>
                  <h3 className="mt-3 font-cinzel text-3xl text-ink md:text-4xl">
                    {s.name}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-montserrat text-xs uppercase tracking-[0.12em] text-ink/60">
                    <li>{s.beds}</li>
                    <li>{s.baths}</li>
                    <li>{s.area}</li>
                  </ul>
                  <Link
                    href={`/accommodation/${s.slug}`}
                    className="group/link mt-5 inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-colors duration-500 ease-brand hover:text-brand"
                  >
                    View Room
                    <span aria-hidden className="transition-transform duration-500 ease-brand group-hover/link:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 ease-brand hover:border-brand hover:text-brand"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 ease-brand hover:border-brand hover:text-brand"
              >
                →
              </button>
              <div className="ml-4 flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.slug}
                    type="button"
                    aria-label={`Go to ${s.name}`}
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500 ease-brand",
                      i === active ? "w-8 bg-brand" : "w-4 bg-ink/20",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
