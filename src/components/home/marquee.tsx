"use client";

import Image from "next/image";
import { MARQUEE_IMAGES } from "@/lib/content/home";

/**
 * Continuous horizontal image marquee (ports `section_global_marquee` /
 * `marquee-track`). Shows the CRM's spotlight gallery images (any category),
 * passed in via `images`. Duplicated track scrolls seamlessly via a CSS
 * keyframe; pauses on hover. Reduced-motion users get a static, scrollable row.
 */
export function Marquee({ images }: { images?: string[] }) {
  const source = images && images.length > 0 ? images : MARQUEE_IMAGES;
  const track = [...source, ...source];
  return (
    <section className="overflow-hidden bg-mist py-10">
      <div className="marquee-mask group relative flex">
        <div className="marquee-track flex shrink-0 gap-5 pr-5">
          {track.map((src, i) => (
            <div
              key={i}
              className="relative h-52 w-72 shrink-0 overflow-hidden rounded-lg md:h-64 md:w-96"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="384px"
                className="object-cover transition-transform duration-700 ease-brand hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 38s linear infinite;
          will-change: transform;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
