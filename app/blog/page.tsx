import { activePalette } from "../color-palettes";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16"
      style={{
        backgroundColor: activePalette.background,
        color: activePalette.text,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-lg hover:underline"
          style={{ color: activePalette.primary }}
        >
          ← Back to Home
        </Link>
        <h1
          className="text-5xl sm:text-6xl font-bold mb-12"
          style={{ color: activePalette.text }}
        >
          Blog
        </h1>
        <div className="space-y-12">
          {[1, 2, 3, 4, 5].map((post) => (
            <article
              key={post}
              className="p-8 rounded-lg"
              style={{
                backgroundColor: activePalette.surface,
                border: `1px solid ${activePalette.border}`,
              }}
            >
              <div
                className="text-sm mb-3 font-medium"
                style={{ color: activePalette.primary }}
              >
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h3
                className="text-3xl font-semibold mb-4"
                style={{ color: activePalette.text }}
              >
                Blog Post Title {post}
              </h3>
              <p
                className="mb-4 leading-relaxed"
                style={{ color: activePalette.textSecondary }}
              >
                This is the expanded blog page with full blog post content. Here
                you would write about your thoughts, experiences, and insights on
                software development, design, or other topics of interest.
              </p>
              <p style={{ color: activePalette.textSecondary }}>
                More detailed content would go here. This is placeholder text for
                the blog post content.
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

