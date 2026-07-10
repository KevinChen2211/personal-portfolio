import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts } from "./data/blogs";
import { allImages, parseCollection } from "./gallery/data";

const baseUrl = "https://kevinchen.com.au";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/gallery",
    "/journal",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const collectionSlugs = Array.from(
    new Set(allImages.map((src) => parseCollection(src).slug)),
  );
  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map(
    (slug) => ({
      url: `${baseUrl}/gallery/collection/${slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    }),
  );

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...postRoutes,
    ...collectionRoutes,
  ];
}
