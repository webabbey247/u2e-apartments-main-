"use client";

import Image from "next/image";
import { EVENT_SPACES } from "@/lib/content/meetings";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";

function SpaceCard({ name, desc, image }: { name: string; desc: string; image: string }) {
  const ref = useImageScale<HTMLDivElement>();
  return (
    <article className="group flex flex-col">
      <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-xl">
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
    </article>
  );
}

/** Event spaces — ports `section_image_slider`: cards for each venue, `image-scale`. */
export function EventSpaces() {
  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {EVENT_SPACES.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {EVENT_SPACES.title}
          </RevealHeading>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {EVENT_SPACES.items.map((space) => (
            <SpaceCard key={space.name} {...space} />
          ))}
        </div>
      </div>
    </section>
  );
}
