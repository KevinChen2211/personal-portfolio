import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts } from "./data/blogs";
import { allImages, parseCollection } from "./gallery/data";
import { siteConfig, absoluteUrl } from "./lib/site";

const baseUrl = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/gallery",
    "/journal",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
    images: project.image ? [absoluteUrl(project.image)] : undefined,
  }));

  const postRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const firstImage = post.content.match(/!\[IMAGE:([^\]]+)\]/)?.[1];
    return {
      url: `${baseUrl}/journal/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly",
      priority: 0.6,
      images: firstImage ? [absoluteUrl(firstImage)] : undefined,
    };
  });

  const collectionSlugs = Array.from(
    new Set(allImages.map((src) => parseCollection(src).slug)),
  );
  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map(
    (slug) => ({
      url: `${baseUrl}/gallery/collection/${slug}`,
      changeFrequency: "yearly",
      priority: 0.5,
      images: allImages
        .filter((src) => parseCollection(src).slug === slug)
        .map((src) => absoluteUrl(src)),
    }),
  );

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...postRoutes,
    ...collectionRoutes,
  ];
}
