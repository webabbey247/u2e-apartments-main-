"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";

let registered = false;

/**
 * Register GSAP plugins once (client-only) and define the shared brand eases.
 * Mirrors the source template's GSAP 3.15 setup (ScrollTrigger + SplitText +
 * CustomEase + Flip) so ported animations keep identical timing/easing.
 */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip);

  // Brand easing curve — matches tailwind `ease-brand` cubic-bezier(0.16,1,0.3,1).
  CustomEase.create("brand", "0.16,1,0.3,1");
  // Secondary ease used by the template's reveal/scale interactions.
  CustomEase.create("brandOut", "0.625,0.05,0,1");

  registered = true;
}

export { gsap, ScrollTrigger, SplitText, CustomEase, Flip };

/** Shared timing constants so every section animates on the same rhythm. */
export const TIMING = {
  fast: 0.6,
  base: 0.9,
  slow: 1.2,
  stagger: 0.06,
  ease: "brand",
} as const;
