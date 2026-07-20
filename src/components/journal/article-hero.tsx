"use client";

import Link from "next/link";
import Image from "next/image";
import type { JournalPost } from "@/lib/content/journal";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useMoveY, useImageScale } from "@/hooks/use-animations";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[(m ?? 1) - 1]} ${d}, ${y}`;
}

/**
 * Article hero — ports `section_hero_global`: a breadcrumb + category +
 * `title-stagger` title + meta (date) on a dark band, followed by the cover
 * image with a slow `image-scale`.
 */
export function ArticleHero({ post }: { post: JournalPost }) {
  const metaRef = useMoveY<HTMLDivElement>({ delay: 0.35, onMount: true });
  const imgRef = useImageScale<HTMLDivElement>();

  return (
    <section>
      <div className="bg-ink px-6 pb-14 pt-36 text-center text-paper md:pb-16 md:pt-44">
        <div ref={metaRef} className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="mb-6 flex items-center justify-center gap-2 font-montserrat text-xs uppercase tracking-[0.2em] text-paper/60">
            <Link href="/" className="transition-colors duration-300 ease-brand hover:text-paper">
              Home
            </Link>
            <span>/</span>
            <Link href="/journal" className="transition-colors duration-300 ease-brand hover:text-paper">
              Journal
            </Link>
            <span>/</span>
            <span className="text-brand">{post.category}</span>
          </div>
        </div>
        <RevealHeading
          as="h1"
          onMount
          className="mx-auto max-w-4xl font-cinzel text-4xl leading-tight text-paper md:text-6xl"
        >
          {post.title}
        </RevealHeading>
        <p className="mt-6 font-montserrat text-xs uppercase tracking-[0.2em] text-paper/60">
          {formatDate(post.date)}
        </p>
      </div>

      <div ref={imgRef} className="relative h-[52vh] min-h-[360px] w-full overflow-hidden md:h-[68vh]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
