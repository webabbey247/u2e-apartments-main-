"use client";

import Image from "next/image";
import Link from "next/link";
import { UPCOMING_EVENTS } from "@/lib/content/meetings";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";

type EventItem = (typeof UPCOMING_EVENTS.items)[number];

/** Format an ISO date (YYYY-MM-DD) into { day, month } without timezone drift. */
function splitDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return { day: String(d).padStart(2, "0"), month: months[(m ?? 1) - 1] };
}

function EventCard({ slug, title, date, category, desc, image }: EventItem) {
  const ref = useImageScale<HTMLDivElement>();
  const { day, month } = splitDate(date);

  return (
    <article className="group flex flex-col">
      <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
        />
        {/* Date badge */}
        <div className="absolute left-5 top-5 flex flex-col items-center rounded-lg bg-paper px-3 py-2 text-center">
          <span className="font-cinzel text-2xl leading-none text-ink">{day}</span>
          <span className="mt-0.5 font-montserrat text-[10px] uppercase tracking-[0.15em] text-brand">
            {month}
          </span>
        </div>
      </div>

      <span className="mt-5 font-montserrat text-[11px] uppercase tracking-[0.2em] text-brand">
        {category}
      </span>
      <h3 className="mt-2 font-cinzel text-2xl text-ink transition-colors duration-300 ease-brand group-hover:text-brand">
        {title}
      </h3>
      <p className="mt-2 font-lato text-sm leading-relaxed text-ink/65">{desc}</p>
      <Link
        href={`#enquiry`}
        aria-label={`Enquire about ${title}`}
        className="group/link mt-4 inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-colors duration-500 ease-brand hover:text-brand"
        data-event={slug}
      >
        Reserve a Place
        <span aria-hidden className="transition-transform duration-500 ease-brand group-hover/link:translate-x-1">
          →
        </span>
      </Link>
    </article>
  );
}

/**
 * Upcoming Events — a listing of dated happenings hosted at U2E (image with a
 * date badge, category, title, description, and a reserve link). Each image
 * scales in on scroll and zooms on hover.
 */
export function UpcomingEvents() {
  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {UPCOMING_EVENTS.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {UPCOMING_EVENTS.title}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-ink/70">
            {UPCOMING_EVENTS.body}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {UPCOMING_EVENTS.items.map((item) => (
            <EventCard key={item.slug} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
