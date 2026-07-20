import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleHero } from "@/components/journal/article-hero";
import { ArticleBody } from "@/components/journal/article-body";
import { RelatedPosts } from "@/components/journal/related-posts";
import { SocialMediaMarquee } from "@/components/home/social-marquee";
import {
  getPost,
  getRelatedPosts,
  JOURNAL_SLUGS,
  JOURNAL_WELLNESS,
} from "@/lib/content/journal";

export function generateStaticParams() {
  return JOURNAL_SLUGS.map((postSlug) => ({ postSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}): Promise<Metadata> {
  const { postSlug } = await params;
  const post = getPost(postSlug);
  if (!post) return { title: "Story not found — U2E Apartments" };
  return {
    title: `${post.title} — U2E Journal`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) {
  const { postSlug } = await params;
  const post = getPost(postSlug);
  if (!post) notFound();

  const related = getRelatedPosts(postSlug, 3);

  return (
    <>
      <Navbar />
      <main>
        <ArticleHero post={post} />
        <ArticleBody post={post} />
        <RelatedPosts posts={related} />
        <SocialMediaMarquee />
      </main>
      <Footer />
    </>
  );
}
