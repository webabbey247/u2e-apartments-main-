"use client";

import Image from "next/image";
import Link from "next/link";
import { SUITES } from "@/lib/content/accommodation";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale, useMoveY } from "@/hooks/use-animations";
import type { SuiteCard as Suite } from "@/lib/queries/rooms";

function SuiteCard({ slug, name, desc, image }: Suite) {
  const imgRef = useImageScale<HTMLDivElement>();
  const textRef = useMoveY<HTMLDivElement>();

  return (
    <article className="group flex flex-col items-center text-center">
      <div ref={imgRef} className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div ref={textRef} className="flex flex-col items-center">
        <h3 className="mt-8 font-cinzel text-3xl text-ink md:text-4xl">{name}</h3>
        <p className="mt-4 max-w-sm font-lato text-base leading-relaxed text-ink/70">
          {desc}
        </p>
        <Link
          href={`/accommodation/${slug}`}
          className="group/link mt-6 inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-500 ease-brand hover:border-brand hover:text-brand"
        >
          View Room
          <span aria-hidden className="transition-transform duration-500 ease-brand group-hover/link:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

/**
 * All-suites listing — ports `section_rooms_llisting`: a centered heading +
 * subtitle over a 2-column card grid (image, centered name, description, and a
 * "View Room" link). Matches `room.html` structure.
 */
export function SuitesListing({ items }: { items: Suite[] }) {
  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {SUITES.title}
          </RevealHeading>
          <p className="mx-auto mt-5 max-w-md font-lato text-base leading-relaxed text-ink/70">
            {SUITES.body}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
          {items.map((item) => (
            <SuiteCard key={item.slug} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
