"use client";

import Image from "next/image";
import { RESTAURANT_MENU } from "@/lib/content/dining";
import type { MenuDishData } from "@/lib/queries/menu";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useMoveY } from "@/hooks/use-animations";

function MenuDish({ name, image }: MenuDishData) {
  const ref = useMoveY<HTMLElement>();

  return (
    <article ref={ref} className="group grid gap-3">
      <div className="aspect-square">
        {/* Brand-tinted diagonal weave — the backdrop behind each photo, and the
            tile itself for dishes that have no image uploaded yet. */}
        <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-[repeating-linear-gradient(135deg,rgba(200,30,42,0.16)_0_10px,rgba(200,30,42,0.05)_10px_22px)]">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width:720px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
            />
          ) : (
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center font-cinzel text-4xl text-paper/25"
            >
              U2E
            </span>
          )}
        </div>
      </div>
      <h3 className="font-cinzel text-[clamp(17px,2.4vw,21px)] font-bold leading-[1.15] tracking-[-0.01em] text-paper">
        {name}
      </h3>
    </article>
  );
}

/**
 * Restaurant menu — the kitchen showcase: a stagger heading over a grid of
 * signature dishes (two-up on mobile, three-up from 720px). Dark band for
 * contrast; each dish rises in on scroll and zooms on hover. `items` comes from
 * `crm.MenuList`; the surrounding copy stays editorial.
 */
export function RestaurantMenu({ items }: { items: MenuDishData[] }) {
  return (
    <section className="bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-14 max-w-xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {RESTAURANT_MENU.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-paper md:text-5xl">
            {RESTAURANT_MENU.title}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-paper/70">
            {RESTAURANT_MENU.body}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5 min-[720px]:grid-cols-3 min-[720px]:gap-5">
          {items.map((dish) => (
            // Pass fields explicitly — spreading would clash with React's `key`.
            <MenuDish key={dish.key} name={dish.name} image={dish.image} />
          ))}
        </div>

        <p className="mt-10 font-montserrat text-xs uppercase tracking-[0.15em] text-paper/50">
          {RESTAURANT_MENU.note}
        </p>
      </div>
    </section>
  );
}
