"use client";

import Image from "next/image";
import { EVENTS } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";

function EventCard({ title, desc, image }: { title: string; desc: string; image: string }) {
  const ref = useImageScale<HTMLElement>();
  return (
    <article ref={ref} className="group relative overflow-hidden rounded-xl">
      <div className="relative aspect-[3/4]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-cinzel text-2xl text-paper">{title}</h3>
        <p className="mt-2 max-h-0 overflow-hidden font-lato text-sm leading-relaxed text-paper/80 opacity-0 transition-all duration-500 ease-brand group-hover:max-h-24 group-hover:opacity-100">
          {desc}
        </p>
      </div>
    </article>
  );
}

/** Personalized events — ports `section_perosnal_event_slider` card reveals. */
export function Events() {
  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {EVENTS.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {EVENTS.title}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-ink/70">
            {EVENTS.body}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {EVENTS.items.map((item) => (
            <EventCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
