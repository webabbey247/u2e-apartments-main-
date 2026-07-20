"use client";

import Image from "next/image";
import Link from "next/link";
import { RESIDENCES } from "@/lib/content/accommodation";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";

type Residence = (typeof RESIDENCES.items)[number];

function ResidenceCard({ slug, name, desc, beds, baths, area, image }: Residence) {
  const ref = useImageScale<HTMLDivElement>();
  return (
    <article className="group flex flex-col">
      <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
        />
      </div>
      <h3 className="mt-5 font-cinzel text-2xl text-ink">{name}</h3>
      <p className="mt-2 font-lato text-sm leading-relaxed text-ink/65">{desc}</p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-montserrat text-xs uppercase tracking-[0.1em] text-ink/60">
        <li>{beds} Bedroom</li>
        <li>{baths} Bathroom</li>
        <li>{area}</li>
      </ul>

      <Link
        href={`/accommodation/${slug}`}
        className="mt-5 inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-brand transition-all duration-500 ease-brand hover:gap-3"
      >
        View more <span aria-hidden>→</span>
      </Link>
    </article>
  );
}

/** All-residences grid — ports `section_room_villas` cards with specs. */
export function ResidencesGrid() {
  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {RESIDENCES.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {RESIDENCES.title}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-ink/70">
            {RESIDENCES.body}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {RESIDENCES.items.map((item) => (
            <ResidenceCard key={item.slug} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
