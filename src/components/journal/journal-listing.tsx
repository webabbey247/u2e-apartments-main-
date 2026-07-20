"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  JOURNAL_POSTS,
  JOURNAL_CATEGORIES,
  JOURNAL_PAGE_SIZE,
  type JournalPost,
} from "@/lib/content/journal";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useImageScale } from "@/hooks/use-animations";
import { cn } from "@/lib/utils/cn";

const TABS = ["All", ...JOURNAL_CATEGORIES] as const;

function PostCard({ post }: { post: JournalPost }) {
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
        <p className="mt-2 font-lato text-sm leading-relaxed text-ink/65">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-colors duration-500 ease-brand group-hover:text-brand">
          Explore
          <span aria-hidden className="transition-transform duration-500 ease-brand group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}

/**
 * Journal listing — ports `section_blog_listing`: a category tab filter
 * (`data-w-tab`) over a post-card grid. Each card image scales in and zooms on
 * hover; "Explore" links to the article.
 */
export function JournalListing() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () => (tab === "All" ? JOURNAL_POSTS : JOURNAL_POSTS.filter((p) => p.category === tab)),
    [tab],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / JOURNAL_PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice(
    (current - 1) * JOURNAL_PAGE_SIZE,
    current * JOURNAL_PAGE_SIZE,
  );

  const selectTab = (t: (typeof TABS)[number]) => {
    setTab(t);
    setPage(1);
  };

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="bg-mist px-6 py-24 md:px-10 md:py-32">
      <div ref={topRef} className="mx-auto max-w-[1300px] scroll-mt-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <RevealHeading className="font-cinzel text-4xl leading-tight text-ink md:text-5xl">
            Discover All Our Stories
          </RevealHeading>
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => selectTab(t)}
                aria-pressed={tab === t}
                className={cn(
                  "rounded-full px-5 py-2.5 font-montserrat text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-500 ease-brand",
                  tab === t
                    ? "bg-brand text-paper"
                    : "border border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {pageCount > 1 && (
          <nav
            aria-label="Journal pagination"
            className="mt-16 flex items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => goToPage(current - 1)}
              disabled={current === 1}
              aria-label="Previous page"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 ease-brand hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                aria-current={p === current ? "page" : undefined}
                className={cn(
                  "h-11 w-11 rounded-full font-montserrat text-sm transition-all duration-500 ease-brand",
                  p === current
                    ? "bg-brand text-paper"
                    : "border border-ink/20 text-ink/70 hover:border-brand hover:text-brand",
                )}
              >
                {String(p).padStart(2, "0")}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(current + 1)}
              disabled={current === pageCount}
              aria-label="Next page"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 ease-brand hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
