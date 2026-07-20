"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * Unit gallery slider — ports `section_image_slider`: a full-width image whose
 * slides cross-fade + scale (`slide-01/02/03` + `image-scale`), with prev/next
 * arrows centered at the bottom edge and a small numeric counter.
 */
export function ImageSlider({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const go = (dir: number) => setActive((i) => (i + dir + count) % count);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-paper">
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden md:h-[82vh]">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${name} — image ${i + 1}`}
            fill
            sizes="100vw"
            className={cn(
              "object-cover transition-all duration-[900ms] ease-brand",
              i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
            )}
          />
        ))}

        {/* Counter */}
        <div className="absolute left-6 top-6 font-montserrat text-sm tracking-[0.15em] text-paper drop-shadow md:left-10">
          {pad(active + 1)} <span className="text-paper/60">/ {pad(count)}</span>
        </div>

        {/* Arrows — centered at the bottom edge */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 text-ink transition-all duration-500 ease-brand hover:bg-brand hover:text-paper"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 text-ink transition-all duration-500 ease-brand hover:bg-brand hover:text-paper"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
