"use client";

import Image from "next/image";
import { SOCIAL, type SocialSource } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";

function SourceIcon({ source, className = "h-7 w-7" }: { source: SocialSource; className?: string }) {
  if (source === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
        <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.86a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12v-3.3a5.9 5.9 0 1 0 5.02 5.83V9.7a7.5 7.5 0 0 0 4.37 1.4V7.9a4.28 4.28 0 0 1-3.31-2.08z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── Decorative background scatter ─────────────────────────────────────────
// Built from a jittered grid rather than hand-placed points: the grid keeps
// coverage even (no bald patches or clumps) while the jitter keeps it from
// reading as a lattice. Seeded and pure, so server and client render
// identically — Math.random() here would cause a hydration mismatch.

const SCATTER_COLS = 10;
const SCATTER_ROWS = 7;
/** How far an icon may drift from its cell centre, as a fraction of the cell. */
const JITTER = 0.9;
const SCATTER_SIZES = ["h-8 w-8", "h-10 w-10", "h-12 w-12", "h-14 w-14"];

/** Deterministic pseudo-random in [0,1) from an integer seed. */
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const SCATTER: {
  source: SocialSource;
  top: string;
  left: string;
  size: string;
  rotate: number;
  opacity: number;
}[] = Array.from({ length: SCATTER_COLS * SCATTER_ROWS }, (_, i) => {
  const col = i % SCATTER_COLS;
  const row = Math.floor(i / SCATTER_COLS);
  const dx = (seeded(i + 1) - 0.5) * JITTER;
  const dy = (seeded(i + 101) - 0.5) * JITTER;
  const spin = seeded(i + 201);
  const pick = seeded(i + 301);

  return {
    // Alternate per cell so neither platform clusters on one side.
    source: (col + row) % 2 === 0 ? "instagram" : "tiktok",
    left: `${(((col + 0.5 + dx) / SCATTER_COLS) * 100).toFixed(2)}%`,
    top: `${(((row + 0.5 + dy) / SCATTER_ROWS) * 100).toFixed(2)}%`,
    size: SCATTER_SIZES[Math.floor(pick * SCATTER_SIZES.length)],
    rotate: Math.round((spin - 0.5) * 50),
    opacity: Number((0.12 + pick * 0.11).toFixed(3)),
  };
});

/**
 * Social media feed strip — a continuous `marquee-track` loop of posts pulled
 * from Instagram and TikTok. Each card reveals its source platform icon on
 * hover; the track pauses on hover. Reduced-motion → static row.
 */
export function SocialMediaMarquee() {
  const track = [...SOCIAL.posts, ...SOCIAL.posts];
  return (
    <section className="relative overflow-hidden bg-brand py-24 md:py-32">
      {/* Decorative scattered social icons behind the content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 text-paper">
        {SCATTER.map((s, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              top: s.top,
              left: s.left,
              opacity: s.opacity,
              transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
            }}
          >
            <SourceIcon source={s.source} className={s.size} />
          </span>
        ))}
      </div>

      <div className="relative z-10 mb-12 px-6 text-center md:px-10">
        <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-paper/80">
          {SOCIAL.eyebrow}
        </p>
        <RevealHeading className="font-cinzel text-4xl leading-tight text-paper md:text-5xl">
          {SOCIAL.title}
        </RevealHeading>
      </div>

      <div className="sm-mask group relative z-10 flex overflow-hidden">
        <div className="sm-track flex shrink-0 gap-4 pr-4">
          {track.map((post, i) => (
            <a
              key={i}
              href={SOCIAL.links[post.source]}
              target="_blank"
              rel="noreferrer"
              aria-label={`View on ${post.source}`}
              className="sm-card relative h-64 w-64 shrink-0 overflow-hidden rounded-lg md:h-72 md:w-72"
            >
              <Image
                src={post.src}
                alt={`U2E Apartments on ${post.source}`}
                fill
                sizes="288px"
                className="object-cover"
              />
              <span className="sm-overlay absolute inset-0 flex items-center justify-center bg-ink/45 text-paper opacity-0 transition-opacity duration-500 ease-brand">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-paper/60">
                  <SourceIcon source={post.source} />
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sm-track {
          animation: sm-marquee 45s linear infinite;
          will-change: transform;
        }
        .group:hover .sm-track {
          animation-play-state: paused;
        }
        .sm-card:hover .sm-overlay {
          opacity: 1;
        }
        .sm-card:hover :global(img) {
          transform: scale(1.05);
        }
        .sm-card :global(img) {
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes sm-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sm-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
