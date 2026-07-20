"use client";

import Image from "next/image";
import { ABOUT, asset } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { BrandButton } from "@/components/ui/brand-button";
import { useParallax } from "@/hooks/use-animations";

/**
 * About Us — text column beside two offset images that parallax in opposite
 * directions on scroll (ports `home_about_images` forward/reverse).
 */
export function About() {
  const forward = useParallax<HTMLDivElement>(0.18);
  const reverse = useParallax<HTMLDivElement>(-0.18);

  return (
    <section id="about" className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {ABOUT.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {ABOUT.title}
          </RevealHeading>
          <p className="mt-6 font-lato text-base leading-relaxed text-ink/70 md:text-lg">
            {ABOUT.body}
          </p>
          <div className="mt-9">
            <BrandButton href={ABOUT.cta.href} variant="outline">
              {ABOUT.cta.label}
            </BrandButton>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <div ref={forward} className="relative h-72 w-1/2 overflow-hidden rounded-lg md:h-[26rem]">
            <Image src="/assets/u2e-light.webp" alt="U2E interior" fill sizes="(max-width:768px) 50vw, 300px" className="object-cover" />
          </div>
          <div ref={reverse} className="relative mt-12 h-72 w-1/2 overflow-hidden rounded-lg md:h-[26rem]">
            <Image src="/assets/u2e-dark.webp" alt="U2E suite" fill sizes="(max-width:768px) 50vw, 300px" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
