"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/lib/queries/gallery";

/**
 * Fullscreen lightbox (ports `w-lightbox`): overlays the active image with
 * prev/next + close controls, keyboard nav (Esc / ← / →), and body scroll lock
 * while open. `index === null` closes it.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onNavigate((index + dir + images.length) % images.length);
    },
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, [open, go, onClose]);

  if (!open || index === null) return null;
  const img = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 p-4 md:p-10"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-paper/30 text-xl text-paper transition-colors duration-300 ease-brand hover:border-brand hover:text-brand"
      >
        ✕
      </button>

      {/* Prev / Next */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); go(-1); }}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 text-xl text-paper transition-colors duration-300 ease-brand hover:border-brand hover:text-brand md:left-8"
      >
        ←
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); go(1); }}
        aria-label="Next image"
        className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 text-xl text-paper transition-colors duration-300 ease-brand hover:border-brand hover:text-brand md:right-8"
      >
        →
      </button>

      {/* Image */}
      <div
        className="relative h-full max-h-[85vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-montserrat text-xs tracking-[0.15em] text-paper/70">
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </div>
    </div>
  );
}
