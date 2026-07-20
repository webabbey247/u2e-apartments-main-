"use client";

import Image from "next/image";
import { JOURNAL } from "@/lib/content/home";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";

function PostCard({ tag, title, image }: { tag: string; title: string; image: string }) {
  const ref = useImageScale<HTMLDivElement>();
  return (
    <article className="group flex flex-col">
      <div ref={ref} className="relative aspect-[3/2] overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
        />
      </div>
      <span className="mt-5 font-montserrat text-[11px] uppercase tracking-[0.2em] text-brand">
        {tag}
      </span>
      <h3 className="mt-2 font-cinzel text-xl leading-snug text-ink transition-colors duration-300 ease-brand group-hover:text-brand">
        {title}
      </h3>
    </article>
  );
}

/** Journal / blog teaser — ports `section_blog_cards` scroll-in cards. */
export function Journal() {
  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14 max-w-xl">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.3em] text-brand">
            {JOURNAL.eyebrow}
          </p>
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            {JOURNAL.title}
          </RevealHeading>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {JOURNAL.posts.map((post) => (
            <PostCard key={post.title} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
