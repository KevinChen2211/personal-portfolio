// schema.org JSON-LD builders. Each returns a plain object that gets serialized
// into a <script type="application/ld+json"> tag (see components/JsonLd.tsx).
// Structured data is what lets search engines show rich results (article cards,
// breadcrumbs, an author/person entity) and is the highest-leverage on-page SEO
// win beyond the basic metadata.

import { siteConfig, sameAs, absoluteUrl } from "./site";

const personId = `${siteConfig.url}/#person`;
const websiteId = `${siteConfig.url}/#website`;

// The Kevin Chen entity, referenced (by @id) from the website and every
// article/creative work so search engines resolve them to one author.
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.image),
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    knowsAbout: [...siteConfig.knowsAbout],
    sameAs,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: "en-AU",
    publisher: { "@id": personId },
  };
}

// Breadcrumbs: pass ordered crumbs like [{ name: "Journal", path: "/journal" }].
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author?: string;
  image?: string;
  tags?: string[];
}) {
  const url = absoluteUrl(`/journal/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": personId, name: post.author ?? siteConfig.name },
    publisher: { "@id": personId },
    ...(post.image ? { image: absoluteUrl(post.image) } : {}),
    ...(post.tags && post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    inLanguage: "en-AU",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export function creativeWorkSchema(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
}) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    ...(project.image ? { image: absoluteUrl(project.image) } : {}),
    author: { "@id": personId },
    creator: { "@id": personId },
    inLanguage: "en-AU",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export function imageGallerySchema(collection: {
  title: string;
  slug: string;
  images: string[];
}) {
  const url = absoluteUrl(`/gallery/collection/${collection.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: collection.title,
    author: { "@id": personId },
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: collection.images.map((src) => absoluteUrl(src)),
  };
}
