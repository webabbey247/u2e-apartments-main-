"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/animation/gsap";
import { useLenis } from "@/components/providers/lenis-provider";

const WORD = "U2E APARTMENTS";

/**
 * Intro loader — ports the template's letter-stagger + reveal. Letters stagger
 * up, hold, then the whole panel wipes away, unlocking scroll. Respects
 * reduced-motion (renders nothing / no scroll lock).
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lettersRef = useRef<HTMLDivElement | null>(null);
  const lenis = useLenis();
  const [done, setDone] = useState(false);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(true);
      return;
    }

    lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");

    const letters = lettersRef.current?.querySelectorAll("[data-letter]");
    const tl = gsap.timeline({
      defaults: { ease: "brand" },
      onComplete: () => {
        lenis?.start();
        document.documentElement.classList.remove("lenis-stopped");
        setDone(true);
      },
    });

    if (letters) {
      tl.from(letters, { yPercent: 120, opacity: 0, duration: 0.9, stagger: 0.045 })
        .to(letters, { yPercent: -120, opacity: 0, duration: 0.7, stagger: 0.02 }, "+=0.5");
    }
    tl.to(rootRef.current, { yPercent: -100, duration: 1, ease: "brandOut" }, "-=0.2");

    return () => {
      tl.kill();
      lenis?.start();
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [lenis]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand"
      aria-hidden
    >
      <div ref={lettersRef} className="flex overflow-hidden">
        {WORD.split("").map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span
              data-letter
              className="inline-block font-cinzel text-2xl tracking-[0.3em] text-paper md:text-4xl"
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
