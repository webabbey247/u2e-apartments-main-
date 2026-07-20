"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { MenuItemData } from "@/lib/queries/menu";
import { useMoveY } from "@/hooks/use-animations";
import { cn } from "@/lib/utils/cn";

const PAGE_SIZE = 15;

function MenuRow({ item }: { item: MenuItemData }) {
  const ref = useMoveY<HTMLDivElement>();
  return (
    <div ref={ref} className="flex items-center gap-5 border-b border-mist2 py-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-24">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
        ) : (
          // Brand-tinted weave stands in until a photo is uploaded in the CRM.
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,rgba(200,30,42,0.16)_0_10px,rgba(200,30,42,0.05)_10px_22px)] font-cinzel text-sm text-ink/35"
          >
            U2E
          </span>
        )}
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

/**
 * Categorized dining menu — `crm.MenuList` rows paginated 15 per page, with a
 * category heading printed whenever the category changes within the visible
 * page. Each row has a per-item add-to-order stub.
 */
export function MenuList({ items }: { items: MenuItemData[] }) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement | null>(null);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div ref={topRef} className="mx-auto max-w-[900px] scroll-mt-28">
        <div>
          {visible.map((item, i) => (
            <div key={item.key}>
              {/* Heading whenever the category changes — including the first row
                  of a page that continues a category from the previous one. */}
              {(i === 0 || visible[i - 1].category !== item.category) && (
                <h2
                  className={cn(
                    "mb-4 font-montserrat text-xs uppercase tracking-[0.25em] text-brand",
                    i > 0 && "mt-16",
                  )}
                >
                  {item.category}
                </h2>
              )}
              <MenuRow item={item} />
            </div>
          ))}
        </div>

        {pageCount > 1 && (
          <nav
            aria-label="Menu pagination"
            className="mt-16 flex items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => goToPage(current - 1)}
              disabled={current === 1}
              aria-label="Previous page"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 ease-brand hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                aria-current={p === current ? "page" : undefined}
                className={cn(
                  "h-11 w-11 rounded-full font-montserrat text-sm transition-all duration-500 ease-brand",
                  p === current
                    ? "bg-brand text-paper"
                    : "border border-ink/20 text-ink/70 hover:border-brand hover:text-brand",
                )}
              >
                {String(p).padStart(2, "0")}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(current + 1)}
              disabled={current === pageCount}
              aria-label="Next page"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 ease-brand hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
