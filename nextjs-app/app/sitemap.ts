import type { MetadataRoute } from "next";

import { absoluteUrl, getAllPosts, getAllProjects } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog", "/services", "/projects"].map((route) => ({
    url: absoluteUrl(route || "/"),
  }));

  const posts = getAllPosts().map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: post.date ? new Date(post.date) : undefined,
  }));

  const projects = getAllProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
  }));

  return [...staticRoutes, ...posts, ...projects];
}
