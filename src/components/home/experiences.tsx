"use client";

import Image from "next/image";
import { EXPERIENCES } from "@/lib/content/home";
import type { ExperienceCardData } from "@/lib/queries/experiences";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useImageScale } from "@/hooks/use-animations";

function ExperienceCard({ title, desc, image }: ExperienceCardData) {
  const ref = useImageScale<HTMLDivElement>();
  return (
    <article className="group flex flex-col">
      <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 ease-brand group-hover:opacity-100" />
      </div>
      <h3 className="mt-5 font-cinzel text-xl text-ink">{title}</h3>
      <p className="mt-2 font-lato text-sm leading-relaxed text-ink/65">{desc}</p>
      <span className="mt-3 font-montserrat text-[11px] uppercase tracking-[0.15em] text-brand opacity-0 transition-opacity duration-500 ease-brand group-hover:opacity-100">
        Explore →
      </span>
    </article>
  );
}

/** Experiences grid — ports the seasonal-experience cards + image-scale. */
export function Experiences({
  items = EXPERIENCES.items,
}: {
  items?: readonly ExperienceCardData[];
}) {
  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
              {EXPERIENCES.eyebrow}
            </p>
            <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
              {EXPERIENCES.title}
            </RevealHeading>
            <p className="mt-5 font-lato text-base leading-relaxed text-ink/70">
              {EXPERIENCES.body}
            </p>
          </div>
          <BrandButton href={EXPERIENCES.cta.href} variant="ghost">
            {EXPERIENCES.cta.label}
          </BrandButton>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ExperienceCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
