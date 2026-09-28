import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "../../data/blogs";
import { formatDate } from "../../utils/date";
import { readingTime } from "../../utils/reading-time";
import { parseMarkdown } from "../../utils/markdown";
import { extractFirstImagePath } from "../../utils/image-marker";
import { readImageSizes } from "../../utils/image-sizes";
import Navbar from "../../components/Navbar";
import JsonLd from "../../components/JsonLd";
import { articleSchema, breadcrumbSchema } from "../../lib/structured-data";

interface JournalPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: JournalPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  const firstImage = extractFirstImagePath(post.content);
  const images = firstImage ? [firstImage] : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} · Kevin Chen`,
      description: post.excerpt,
      url: `/journal/${post.slug}`,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · Kevin Chen`,
      description: post.excerpt,
      images,
    },
  };
}

export default async function JournalPostPage({
  params,
}: JournalPostPageProps) {
  const { slug } = await params;
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const firstImage = extractFirstImagePath(post.content);
  const imageSizes = await readImageSizes(post.content);
  // blogPosts runs newest first, the same order as the journal index.
  const postIndex = blogPosts.indexOf(post);
  const newerPost = blogPosts[postIndex - 1];
  const olderPost = blogPosts[postIndex + 1];

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: bgColor }}
    >
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            date: post.date,
            author: post.author,
            image: firstImage,
            tags: post.tags,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/journal" },
            { name: post.title, path: `/journal/${post.slug}` },
          ]),
        ]}
      />
      <Navbar />
      <main className="px-6 sm:px-10 md:px-12 lg:px-20 xl:px-24 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/journal"
            className="inline-block mb-8 text-sm md:text-base transition-opacity duration-500 hover:underline hover:opacity-70"
            style={{
              color: textColor,
              fontFamily:
                "var(--font-serif)",
              opacity: 0.8,
            }}
          >
            ← Back to Journal
          </Link>

          {/* Article */}
          <article>
            {/* Date · reading time · author */}
            <div
              className="text-sm mb-4 font-medium"
              style={{
                color: textColor,
                fontFamily:
                  "var(--font-serif)",
                opacity: 0.7,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatDate(post.date)} · {readingTime(post.content)} min read
              {post.author && ` • ${post.author}`}
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6 leading-tight"
              style={{
                color: textColor,
                fontFamily:
                  "var(--font-serif)",
              }}
            >
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${textColor}15`,
                      color: textColor,
                      border: `1px solid ${textColor}40`,
                      fontFamily:
                        "var(--font-serif)",
                      opacity: 0.8,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              style={{
                color: textColor,
                lineHeight: "1.8",
              }}
            >
              {parseMarkdown(post.content, {
                palette: {
                  text: textColor,
                  textSecondary: textColor,
                  border: textColor,
                  primary: textColor,
                },
                imageSizes,
                leadImage: firstImage,
              })}
            </div>
          </article>

          {/* Older / newer posts */}
          {(olderPost || newerPost) && (
            <nav
              aria-label="More from the journal"
              className="mt-16 md:mt-20 pt-8 border-t grid gap-6 sm:grid-cols-2"
              style={{ borderColor: `${textColor}26` }}
            >
              {olderPost && (
                <Link href={`/journal/${olderPost.slug}`} className="group block">
                  <span
                    className="block text-xs md:text-sm mb-1"
                    style={{
                      color: textColor,
                      fontFamily: "var(--font-serif)",
                      opacity: 0.7,
                    }}
                  >
                    ← Older post
                  </span>
                  <span
                    className="block text-lg md:text-xl group-hover:underline"
                    style={{ color: textColor, fontFamily: "var(--font-serif)" }}
                  >
                    {olderPost.title}
                  </span>
                </Link>
              )}
              {newerPost && (
                <Link
                  href={`/journal/${newerPost.slug}`}
                  className="group block sm:col-start-2 sm:text-right"
                >
                  <span
                    className="block text-xs md:text-sm mb-1"
                    style={{
                      color: textColor,
                      fontFamily: "var(--font-serif)",
                      opacity: 0.7,
                    }}
                  >
                    Newer post →
                  </span>
                  <span
                    className="block text-lg md:text-xl group-hover:underline"
                    style={{ color: textColor, fontFamily: "var(--font-serif)" }}
                  >
                    {newerPost.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>
    </div>
  );
}
