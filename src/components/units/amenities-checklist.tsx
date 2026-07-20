"use client";

import { RevealHeading } from "@/components/ui/reveal-heading";
import { useMoveY } from "@/hooks/use-animations";
import type { Amenity } from "@/lib/content/units";

function AmenityItem({ label, icon }: Amenity) {
  return (
    <li className="group flex items-center justify-between gap-3 border-b border-mist2 py-4">
      <span className="font-lato text-sm text-ink/80">{label}</span>
      {/* SVG rendered as a mask so it inherits our tokens (the source icons ship
          a fixed fill); tints ink → brand on hover. */}
      <span
        aria-hidden
        className="h-6 w-6 shrink-0 bg-ink/80 transition-colors duration-300 ease-brand group-hover:bg-brand"
        style={{
          maskImage: `url(/icons/${icon}.svg)`,
          WebkitMaskImage: `url(/icons/${icon}.svg)`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    </li>
  );
}

/**
 * Amenities — ports `section_room_details_amenities`: a centered heading +
 * subtitle over a 4-column amenity grid, with a `move-y` reveal on the grid.
 */
export function AmenitiesChecklist({ amenities }: { amenities: Amenity[] }) {
  const ref = useMoveY<HTMLUListElement>();

  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-14 text-center">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            Amenities
          </p>
          <RevealHeading className="mx-auto max-w-2xl font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            Enjoy Luxury and Comfort for a Great Stay
          </RevealHeading>
          <p className="mx-auto mt-5 max-w-md font-lato text-sm leading-relaxed text-ink/60">
            Every unit is fully serviced and thoughtfully equipped, so everything you need is close at hand.
          </p>
        </div>

        <ul
          ref={ref}
          className="grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {amenities.map((amenity) => (
            <AmenityItem key={amenity.label} {...amenity} />
          ))}
        </ul>
      </div>
    </section>
  );
}
