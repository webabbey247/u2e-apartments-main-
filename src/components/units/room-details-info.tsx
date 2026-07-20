"use client";

import { useState } from "react";
import { useMoveY } from "@/hooks/use-animations";
import { BookingModal } from "@/components/booking/booking-modal";
import type { UnitDetailFull } from "@/lib/queries/rooms";

function Highlight({ title, desc }: { title: string; desc: string }) {
  const ref = useMoveY<HTMLDivElement>();
  return (
    <div ref={ref}>
      <h3 className="font-cinzel text-xl text-ink">{title}</h3>
      <p className="mt-3 font-lato text-sm leading-relaxed text-ink/70">{desc}</p>
    </div>
  );
}

/**
 * Room details — ports `section_room_details_info`: a two-column block with
 * "The Details" description on the left and highlight blocks on the right.
 * Specs / title live on the hero, matching the template.
 */
export function RoomDetailsInfo({ unit }: { unit: UnitDetailFull }) {
  const detailsRef = useMoveY<HTMLDivElement>();
  const [reserveOpen, setReserveOpen] = useState(false);

  return (
    <section className="bg-paper px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div ref={detailsRef}>
          <h2 className="font-cinzel text-3xl text-ink md:text-4xl">The Details</h2>
          <p className="mt-5 font-lato text-base leading-relaxed text-ink/70">
            {unit.details}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => setReserveOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-montserrat text-xs font-semibold uppercase tracking-[0.12em] text-paper transition-all duration-500 ease-brand hover:gap-3 hover:bg-brand/90"
            >
              <span>Check Availability</span>
              <span aria-hidden className="transition-transform duration-500 ease-brand group-hover:translate-x-1">
                →
              </span>
            </button>
            <span className="font-montserrat text-sm text-ink/60">
              From <span className="text-ink">{unit.priceFrom}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {unit.highlights.map((h) => (
            <Highlight key={h.title} {...h} />
          ))}
        </div>
      </div>

      <BookingModal unit={unit} open={reserveOpen} onClose={() => setReserveOpen(false)} />
    </section>
  );
}
