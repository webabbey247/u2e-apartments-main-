"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/lib/queries/gallery";
import { Lightbox } from "@/components/gallery/lightbox";

// Cycled heights give the masonry columns natural variety without needing the
// real image dimensions from the DB.
const HEIGHTS = [820, 1120, 900, 720, 1000, 640] as const;

/**
 * Gallery grid — ports `section_gallery_images`: a masonry grid of all gallery
 * images (any category, from `crm.GalleryImage`). Images zoom on hover and open
 * in a fullscreen lightbox on click.
 */
export function GalleryGrid({ images }: { images: GalleryPhoto[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        {/* Masonry grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {images.map((img, idx) => (
            <button
              key={`${img.src}-${idx}`}
              type="button"
              onClick={() => setLightbox(idx)}
              className="group relative block w-full overflow-hidden rounded-xl"
              aria-label={`Open ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={HEIGHTS[idx % HEIGHTS.length]}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 ease-brand group-hover:bg-ink/20" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 font-montserrat text-[10px] uppercase tracking-[0.15em] text-ink opacity-0 transition-opacity duration-500 ease-brand group-hover:opacity-100">
                View
              </span>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        images={images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />
    </section>
  );
}
