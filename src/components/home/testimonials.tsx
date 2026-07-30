"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { registerGsap, gsap, ScrollTrigger, TIMING } from "@/lib/animation/gsap";
import type { TestimonialContent } from "@/lib/queries/testimonials";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { cn } from "@/lib/utils/cn";

/**
 * Per-card stacking values lifted verbatim from the source template's
 * `.testimonial-inner-content-block._1 … ._4` rules — the z-order is
 * deliberately non-sequential (10, 11, 13, 14) and the middle two cards are
 * counter-rotated so the stack reads as a hand-dropped pile.
 */
const CARD_LAYOUT = [
  { z: 10, rotate: 0 },
  { z: 11, rotate: 3 },
  { z: 13, rotate: -3 },
  { z: 14, rotate: 0 },
] as const;

/** Backdrop layer z-order, from `.testimonial-single-image-wrap.one … .four`. */
const IMAGE_Z = [5, 4, 3, 2] as const;

/**
 * Scroll-track height. The source hard-codes `min-height: 200vh` for its four
 * cards (three transitions), so keep that exact figure at four and scale by the
 * same per-transition budget when there are fewer — otherwise two testimonials
 * would still demand two screens of scrolling.
 */
const trackVh = (cards: number) => 100 + Math.max(0, cards - 1) * (100 / 3);

const layoutFor = (i: number) => CARD_LAYOUT[i % CARD_LAYOUT.length];

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-ink/15">{"★".repeat(Math.max(0, 5 - rating))}</span>
    </span>
  );
}

/** Brand initials disc — reviews carry no photo, so we never invent a face. */
function Initials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-brand/10 font-cinzel text-lg text-brand">
      {initials || "U2E"}
    </div>
  );
}

/**
 * Stacked testimonial cards over a scroll-revealed photo backdrop.
 *
 * Ported from the template's `testimonial-section`. The structural values are
 * exact (200vh track, `sticky top-15%` card block, the 10/11/13/14 z-order and
 * ±3° rotations, `transform-origin: 50% 100%` on the backdrop layers, the 20px
 * fade-up on the heading, and the ≤479px collapse to a plain column). The
 * scroll-scrubbed keyframes are a reconstruction — the source page ships its
 * Webflow interaction payload in an external bundle, not in the saved HTML.
 */
export function Testimonials({ content }: { content: TestimonialContent }) {
  const { items, images } = content;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);

  // The stack only makes sense once we know we can animate it. Server-render
  // (and reduced-motion / ≤479px) gets a readable column instead.
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 480px)");
    const sync = () => setEnhanced(mq.matches && !reduced());
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Heading reveal — the source ships these inline as
  // `translate3d(0, 20px, 0); opacity: 0`, so 20px (not the 40px `useMoveY`).
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    registerGsap();

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reduced()) {
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.set(targets, { autoAlpha: 0, y: 20 });

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: TIMING.base,
          ease: TIMING.ease,
          stagger: 0.12,
          overwrite: true,
        });
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: "opacity,visibility,transform" });
    };
  }, []);

  // The scrubbed peel. Cards leave top-down (highest z first); each departure is
  // paired with the matching backdrop layer sliding away, so the photo behind
  // the stack changes in lockstep with the quote in front of it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !enhanced || items.length < 2) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", track);
      const wraps = gsap.utils.toArray<HTMLElement>("[data-image-wrap]", track);
      const inners = gsap.utils.toArray<HTMLElement>("[data-image-inner]", track);
      const steps = cards.length - 1;
      if (steps < 1) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      for (let s = 0; s < steps; s++) {
        const card = cards[cards.length - 1 - s]; // topmost card peels first
        const wrap = wraps[s]; // its paired backdrop layer
        const inner = inners[s];
        const { rotate } = layoutFor(cards.length - 1 - s);

        tl.to(card, { yPercent: -120, rotate: rotate - 8, scale: 0.92, autoAlpha: 0 }, s);
        if (wrap) tl.to(wrap, { yPercent: -100 }, s);
        // Counter-drift on the photo inside the departing layer — the source
        // sets `transform-origin: 50% 100%` on both wrap and image for this.
        if (inner) tl.to(inner, { yPercent: 30, scale: 1.08 }, s);
      }
    }, track);

    // Sticky + pinned measurements are only correct once fonts/images settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [enhanced, items.length]);

  if (items.length === 0) return null;

  return (
    // `overflow: clip` (not `hidden`) is deliberate — it trims the rotated cards
    // without creating a scroll container, which would break the sticky stack.
    <section className="overflow-clip bg-paper px-6 py-24 md:px-10 md:py-32">
      <div ref={headingRef} className="mx-auto max-w-[1300px]">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[670px]">
            <p
              data-reveal
              className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand"
            >
              {TESTIMONIALS.eyebrow}
            </p>
            <h2
              data-reveal
              className="font-cinzel text-4xl leading-tight text-ink md:text-5xl"
            >
              {TESTIMONIALS.title}
            </h2>
            <p data-reveal className="mt-5 font-lato text-base leading-relaxed text-ink/70">
              {TESTIMONIALS.body}
            </p>
          </div>
          {/* <div data-reveal>
            <BrandButton href={TESTIMONIALS.cta.href} variant="ghost">
              {TESTIMONIALS.cta.label}
            </BrandButton>
          </div> */}
        </div>
      </div>

      {/* `.testimonial-wrapper` — 50px / 60px ≥1440 / 40px ≤991 */}
      <div className="mx-auto mt-[50px] max-w-[1300px] max-[991px]:mt-10 min-[1440px]:mt-[60px]">
        <div
          ref={trackRef}
          style={enhanced ? { minHeight: `${trackVh(items.length)}vh` } : undefined}
          className="relative"
        >
          {/* `.testimonial-single-card-block` — sticky top 15% while the track scrolls */}
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-5",
              enhanced && "sticky top-[15%]",
            )}
          >
            {/* `.testimonial-marquee-wrap` — hidden ≤479px in the source */}
            {enhanced && (
              <div className="relative w-full overflow-hidden rounded-lg">
                {/* `.testimonial-bg-image-block` — 600px / 700px ≥1440 */}
                <div className="relative min-h-[600px] w-full overflow-hidden min-[1440px]:min-h-[700px]">
                  {images.map((img, i) => (
                    <div
                      key={`${img.src}-${i}`}
                      data-image-wrap
                      style={{ zIndex: IMAGE_Z[i % IMAGE_Z.length], transformOrigin: "50% 100%" }}
                      className="absolute inset-0 overflow-hidden"
                    >
                      <div
                        data-image-inner
                        style={{ transformOrigin: "50% 100%" }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          priority={i === 0}
                        />
                        {/* `linear-gradient(#00000080, #00000080)` from the source */}
                        <div className="absolute inset-0 bg-ink/50" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* The card stack. Absolute + rotated when enhanced; a plain column
                otherwise, matching the source's ≤479px `position: relative;
                transform: none` collapse. */}
            {items.map((t, i) => {
              const { z, rotate } = layoutFor(i);
              return (
                <article
                  key={t.id}
                  data-card
                  style={
                    enhanced
                      ? { zIndex: z, transform: `rotate(${rotate}deg)`, transformOrigin: "50%" }
                      : undefined
                  }
                  className={cn(
                    // `.testimonial-inner-content-block` — 30px / 40px ≥1440 /
                    // 20px ≤479; max-width 578px, 400px ≤767, none ≤479.
                    "w-full rounded-md border border-ink/15 bg-paper p-[30px] max-[479px]:p-5 min-[1440px]:p-10",
                    enhanced
                      ? "absolute max-w-[578px] max-[767px]:max-w-[400px]"
                      : "relative max-w-none",
                  )}
                >
                  <Stars rating={t.rating} />
                  <h3 className="mt-3 font-cinzel text-xl leading-snug text-ink md:text-2xl">
                    {t.headline}
                  </h3>
                  {/* `.testimonial-feedback-text { margin-top: 16px }` */}
                  <p className="mt-4 font-lato text-[15px] leading-relaxed text-ink/70">
                    “{t.body}”
                  </p>
                  {/* `.testimonial-author-wrap` — 25px / 30px ≥1440 / 20px ≤767 */}
                  <div className="mt-[25px] flex items-center gap-2 max-[767px]:mt-5 min-[1440px]:mt-[30px]">
                    <Initials name={t.name} />
                    <div>
                      {/* 20px, 18px ≤767 — `.testimonial-author-name` */}
                      <div className="font-cinzel text-lg font-medium leading-[1.4] text-ink max-[767px]:text-md">
                        {t.name}
                      </div>
                      <div className="font-lato text-sm leading-[1.4] text-ink/55">
                        {t.detail}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
