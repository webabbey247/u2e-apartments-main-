"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DEFAULT_AUTHOR,
  SAMPLE_ARTICLE_BODY,
  type ArticleBlock,
  type JournalPost,
} from "@/lib/content/journal";
import { useMoveY } from "@/hooks/use-animations";

function Block({ block }: { block: ArticleBlock }) {
  const ref = useMoveY<HTMLDivElement>();
  if (block.type === "heading") {
    return (
      <div ref={ref}>
        <h2 className="mt-4 font-cinzel text-3xl text-ink md:text-4xl">{block.text}</h2>
      </div>
    );
  }
  if (block.type === "figure") {
    return (
      <figure ref={ref} className="my-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={block.src} alt={block.caption ?? ""} fill sizes="(max-width:768px) 100vw, 720px" className="object-cover" />
        </div>
        {block.caption && (
          <figcaption className="mt-3 text-center font-lato text-sm italic text-ink/50">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  return (
    <div ref={ref}>
      <p className="font-lato text-base leading-relaxed text-ink/75 md:text-lg">{block.text}</p>
    </div>
  );
}

/** Social share row — copy link + share to X / Facebook / LinkedIn. */
function ShareRow({ post }: { post: JournalPost }) {
  const [copied, setCopied] = useState(false);
  const path = `/journal/${post.slug}`;

  const shareUrl = () =>
    typeof window !== "undefined" ? window.location.href : `https://u2eapartments.com${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const links = [
    { label: "X", href: (u: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(post.title)}` },
    { label: "Facebook", href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
    { label: "LinkedIn", href: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="font-montserrat text-[11px] uppercase tracking-[0.2em] text-ink/50">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href(shareUrl())}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center justify-center rounded-full border border-ink/20 px-3 font-montserrat text-[11px] uppercase tracking-[0.1em] text-ink/70 transition-colors duration-300 ease-brand hover:border-brand hover:text-brand"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="flex h-9 items-center justify-center rounded-full border border-ink/20 px-3 font-montserrat text-[11px] uppercase tracking-[0.1em] text-ink/70 transition-colors duration-300 ease-brand hover:border-brand hover:text-brand"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

/**
 * Article body — ports `section_blog_details_info`: an author strip + share
 * row above the rich-text prose (headings, paragraphs, figures). Each block
 * reveals with `move-y`.
 */
export function ArticleBody({ post }: { post: JournalPost }) {
  const author = DEFAULT_AUTHOR;
  return (
    <section className="bg-paper px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[760px]">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-mist2 pb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image src={author.avatar} alt={author.name} fill sizes="48px" className="object-cover" />
            </div>
            <div>
              <p className="font-cinzel text-lg text-ink">{author.name}</p>
              <p className="font-montserrat text-[11px] uppercase tracking-[0.15em] text-ink/50">
                {author.role}
              </p>
            </div>
          </div>
          <ShareRow post={post} />
        </div>

        <div className="mt-12 flex flex-col gap-6">
          {SAMPLE_ARTICLE_BODY.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}
