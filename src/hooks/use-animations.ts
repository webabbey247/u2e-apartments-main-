"use client";

import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger, SplitText, TIMING } from "@/lib/animation/gsap";

// Reveal hooks hide their target before paint (no flash) and must never leave
// content hidden — so they run in a layout effect on the client.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveal-on-enter via IntersectionObserver.
 *
 * Entrance reveals use IntersectionObserver rather than ScrollTrigger: it
 * recomputes automatically, needs no manual refresh, and — unlike a `once`
 * ScrollTrigger — can never get "stuck hidden" after a client-side navigation
 * (where triggers were created against stale measurements). `onEnter` runs once
 * when the element (or `triggerEl`) scrolls into view; the observer then
 * disconnects. Returns a cleanup that disconnects.
 */
function observeReveal(
  triggerEl: Element,
  onEnter: () => void,
  rootMarginBottom = "-10%",
): () => void {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        onEnter();
        io.disconnect();
      }
    },
    { root: null, rootMargin: `0px 0px ${rootMarginBottom} 0px`, threshold: 0 },
  );
  io.observe(triggerEl);
  return () => io.disconnect();
}

/**
 * Line-by-line heading stagger driven by SplitText.
 * Ports the template's `data-heading="stagger-heading"` / `data-load="title-stagger"`.
 */
export function useSplitTextStagger<T extends HTMLElement>(opts?: {
  trigger?: boolean; // animate on scroll into view (default) vs. on mount
}) {
  const ref = useRef<T | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGsap();
    gsap.set(el, { autoAlpha: 1 });

    if (reduced()) return;

    const split = new SplitText(el, { type: "lines,words", linesClass: "split-line" });
    // Hide the lines before paint (no flash), then reveal on enter.
    gsap.set(split.lines, { yPercent: 110, opacity: 0 });

    const reveal = () =>
      gsap.to(split.lines, {
        yPercent: 0,
        opacity: 1,
        duration: TIMING.base,
        ease: TIMING.ease,
        stagger: 0.09,
        overwrite: true,
      });

    let disconnect: (() => void) | undefined;
    if (opts?.trigger === false) reveal();
    else disconnect = observeReveal(el, reveal);

    return () => {
      disconnect?.();
      gsap.killTweensOf(split.lines);
      // revert() restores the original (visible) text — never leaves it hidden.
      split.revert();
    };
  }, [opts?.trigger]);

  return ref;
}

/**
 * Vertical parallax on scroll. Ports `data-parallax="parallax"`.
 * `speed` > 0 moves slower than scroll (recedes); negative moves faster.
 */
export function useParallax<T extends HTMLElement>(speed = 0.2) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    registerGsap();

    const tween = gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return ref;
}

/**
 * Image scale-in as it enters the viewport.
 * Ports `data-scale="image-scale"` / `data-image-trigger="images-scale"`.
 */
export function useImageScale<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    registerGsap();

    const target = (el.querySelector("img, video") as HTMLElement | null) ?? el;
    gsap.set(target, { scale: 1.25 });

    const reveal = () =>
      gsap.to(target, { scale: 1, ease: TIMING.ease, duration: TIMING.slow, overwrite: true });

    const disconnect = observeReveal(el, reveal, "-5%");

    return () => {
      disconnect();
      gsap.killTweensOf(target);
      gsap.set(target, { clearProps: "transform" });
    };
  }, []);

  return ref;
}

/**
 * Full-bleed cover parallax — the inner image is over-scaled and drifts (and
 * eases in scale) as the card scrolls through the viewport. Ports the template's
 * full-width villa cards (`image-scale` + `parallax`, scrubbed). Gives a
 * continuous scroll-linked transition rather than a one-shot reveal.
 */
export function useCoverScrub<T extends HTMLElement>(strength = 12) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGsap();

    const target = (el.querySelector("img, video") as HTMLElement | null) ?? el;

    if (reduced()) {
      gsap.set(target, { scale: 1, yPercent: 0 });
      return;
    }

    // Over-scale so the parallax drift never exposes the card edges.
    gsap.set(target, { scale: 1.2 });

    const tween = gsap.fromTo(
      target,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [strength]);

  return ref;
}

/**
 * Simple upward reveal. Ports `data-load="move-y"` / `data-move="move-y"`.
 */
export function useMoveY<T extends HTMLElement>(opts?: {
  delay?: number;
  onMount?: boolean;
  /** Reveal when this element enters view instead of the animated one. Useful
   *  when the animated element is bottom-anchored inside a tall container. */
  triggerRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<T | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGsap();

    if (reduced()) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    // Hide before paint (no flash), then reveal.
    gsap.set(el, { autoAlpha: 0, y: 40 });

    const reveal = () =>
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: TIMING.base,
        ease: TIMING.ease,
        delay: opts?.delay ?? 0,
        overwrite: true,
      });

    let disconnect: (() => void) | undefined;
    if (opts?.onMount) reveal();
    else disconnect = observeReveal(opts?.triggerRef?.current ?? el, reveal);

    return () => {
      disconnect?.();
      gsap.killTweensOf(el);
      // Never leave the element in its hidden state after teardown.
      gsap.set(el, { clearProps: "opacity,visibility,transform" });
    };
  }, [opts?.delay, opts?.onMount, opts?.triggerRef]);

  return ref;
}

export { ScrollTrigger };
