"use client";

import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/lib/content/journal";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";

function RelatedCard({ post }: { post: JournalPost }) {
  const ref = useImageScale<HTMLDivElement>();
  return (
    <article className="group flex flex-col">
      <Link href={`/journal/${post.slug}`} className="block">
        <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
          />
        </div>
        <span className="mt-5 font-montserrat text-[11px] uppercase tracking-[0.2em] text-brand">
          {post.category}
        </span>
        <h3 className="mt-2 font-cinzel text-2xl text-ink transition-colors duration-300 ease-brand group-hover:text-brand">
          {post.title}
        </h3>
      </Link>
    </article>
  );
}

/**
 * Related posts — ports `section_title_global` + `section_blog_cards`: a "More
 * Stories" grid of related articles, each image scaling in on scroll.
 */
export function RelatedPosts({ posts }: { posts: JournalPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-14">
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            More Stories
          </RevealHeading>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <RelatedCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
