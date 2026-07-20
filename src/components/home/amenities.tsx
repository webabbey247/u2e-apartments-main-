"use client";

import Image from "next/image";
import { AMENITIES } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";

function AmenityTile({ title, image, index }: { title: string; image: string; index: number }) {
  const ref = useImageScale<HTMLDivElement>();
  return (
    <div className="group relative overflow-hidden rounded-lg">
      <div ref={ref} className="relative aspect-[3/4]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="font-montserrat text-[11px] tracking-[0.2em] text-paper/70">
          0{index + 1}
        </span>
        <h3 className="mt-1 font-cinzel text-lg leading-snug text-paper">{title}</h3>
      </div>
    </div>
  );
}

/** Amenities grid — image-scale tiles with an overlaid label. */
export function Amenities() {
  return (
    <section className="bg-white px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {AMENITIES.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {AMENITIES.title}
          </RevealHeading>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {AMENITIES.items.map((item, i) => (
            <AmenityTile key={item.title} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
