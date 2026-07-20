"use client";

import Image from "next/image";
import Link from "next/link";
import { FEATURED_POST } from "@/lib/content/journal";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale, useParallax } from "@/hooks/use-animations";

/**
 * Featured post — ports `section_blog_featured`: one large article with a
 * parallax feature image (`parallax` + `image-scale`) beside its category,
 * title, excerpt, and a "Read More" link.
 */
export function FeaturedPost() {
  const wrap = useParallax<HTMLDivElement>(0.12);
  const scale = useImageScale<HTMLDivElement>();
  const post = FEATURED_POST;

  return (
    <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div ref={wrap}>
          <Link href={`/journal/${post.slug}`} className="group block">
            <div ref={scale} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
              />
            </div>
          </Link>
        </div>

        <div className="max-w-xl">
          <span className="font-montserrat text-[11px] uppercase tracking-[0.2em] text-brand py-2">
            {post.category}
          </span>
          <RevealHeading className="mt-4 font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {post.title}
          </RevealHeading>
          <p className="mt-5 font-lato text-base leading-relaxed text-ink/70 md:text-lg">
            {post.excerpt}
          </p>
          <Link
            href={`/journal/${post.slug}`}
            className="group/link mt-8 inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-500 ease-brand hover:border-brand hover:text-brand"
          >
            Read More
            <span aria-hidden className="transition-transform duration-500 ease-brand group-hover/link:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
