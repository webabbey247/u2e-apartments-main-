"use client";

import Link from "next/link";
import Image from "next/image";
import { MENU_INTRO } from "@/lib/content/dining";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useMoveY, useImageScale } from "@/hooks/use-animations";

/**
 * Dining menu hero — a full-width image hero (`image-scale`) with a breadcrumb
 * (Home / Dining / Menu), a `title-stagger` title, and a `move-y` intro,
 * matching the page-hero pattern used across the site.
 */
export function MenuHero() {
  const scaleRef = useImageScale<HTMLDivElement>();
  const bodyRef = useMoveY<HTMLDivElement>({ delay: 0.4, onMount: true });

  return (
    <section className="relative flex h-[70vh] min-h-[480px] w-full items-end overflow-hidden">
      <div ref={scaleRef} className="absolute inset-0">
        <Image
          src={MENU_INTRO.image}
          alt="The U2E Kitchen"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/45" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1300px] px-6 pb-14 text-paper md:px-10 md:pb-20">
        <div className="mb-5 flex items-center gap-2 font-montserrat text-xs uppercase tracking-[0.2em] text-paper/70">
          <Link href="/" className="transition-colors duration-300 ease-brand hover:text-paper">
            Home
          </Link>
          <span>/</span>
          <Link href="/dining" className="transition-colors duration-300 ease-brand hover:text-paper">
            Dining
          </Link>
          <span>/</span>
          <span className="text-brand">Menu</span>
        </div>
        <RevealHeading
          as="h1"
          onMount
          className="max-w-3xl font-cinzel text-5xl leading-tight text-paper md:text-7xl"
        >
          {MENU_INTRO.title}
        </RevealHeading>
        <p ref={bodyRef} className="mt-6 max-w-xl font-lato text-base leading-relaxed text-paper/85 md:text-lg">
          {MENU_INTRO.body}
        </p>
      </div>
    </section>
  );
}
