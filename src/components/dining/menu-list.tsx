"use client";

import Image from "next/image";
import { MENU, type MenuItem } from "@/lib/content/dining";
import { useMoveY } from "@/hooks/use-animations";

function MenuRow({ item }: { item: MenuItem }) {
  const ref = useMoveY<HTMLDivElement>();
  return (
    <div ref={ref} className="flex items-center gap-5 border-b border-mist2 py-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-24">
        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-cinzel text-lg text-ink md:text-xl">{item.name}</h3>
          <span className="shrink-0 font-montserrat text-sm font-semibold text-ink">
            {item.price}
          </span>
        </div>
        <p className="mt-1 font-lato text-sm leading-relaxed text-ink/65">{item.desc}</p>
      </div>
      {/* Add-to-order affordance — the dining cart lands in Phase 5 (diningCartStore). */}
      <button
        type="button"
        disabled
        title="Ordering opens soon"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-lg text-ink/50 transition-colors duration-300 ease-brand hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Add ${item.name} to order`}
      >
        +
      </button>
    </div>
  );
}

/** Categorized dining menu — grouped list with per-item add-to-order stub. */
export function MenuList() {
  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[900px]">
        <div className="flex flex-col gap-16">
          {MENU.map((category) => (
            <div key={category.name}>
              <h2 className="mb-4 font-montserrat text-xs uppercase tracking-[0.25em] text-brand">
                {category.name}
              </h2>
              <div>
                {category.items.map((item) => (
                  <MenuRow key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
