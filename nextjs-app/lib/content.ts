import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

type LinkReference = string | { href?: string; title?: string };

type Frontmatter = {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  coverImage?: string;
  coverAlt?: string;
  tags?: string[];
  tweetUrl?: string;
  links?: LinkReference[];
  socialDraft?: string;
  featured?: boolean;
  stack?: string[];
  businessBenefits?: string[];
  technicalHighlights?: string[];
  client?: string;
  role?: string;
  year?: string;
  status?: string;
  liveUrl?: string;
  repoUrl?: string;
};

export type ContentEntry = {
  slug: string;
  body: string;
  title: string;
  description: string;
  date?: string;
  author?: string;
  coverImage?: string;
  coverAlt?: string;
  tags: string[];
  tweetUrl?: string;
  links: Array<{ href: string; title?: string }>;
  socialDraft?: string;
  featured: boolean;
  stack: string[];
  businessBenefits: string[];
  technicalHighlights: string[];
  client?: string;
  role?: string;
  year?: string;
  status?: string;
  liveUrl?: string;
  repoUrl?: string;
};

export type SiteConfig = {
  title: string;
  description: string;
  heroHeading: string;
  heroDescription: string;
  heroAvailability: string;
  url: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
};

const contentRoot = path.join(process.cwd(), "content");

export const site = JSON.parse(
  fs.readFileSync(path.join(contentRoot, "site.json"), "utf8")
) as SiteConfig;

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];
}

function toLinks(value: unknown): Array<{ href: string; title?: string }> {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return { href: item };
      if (item && typeof item === "object" && "href" in item && typeof item.href === "string") {
        return {
          href: item.href,
          title: "title" in item && typeof item.title === "string" ? item.title : undefined,
        };
      }
      return null;
    })
    .filter((item): item is { href: string; title?: string } => Boolean(item));
}

function readCollection(collection: "posts" | "projects"): ContentEntry[] {
  const directory = path.join(contentRoot, collection);
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const source = fs.readFileSync(path.join(directory, filename), "utf8");
      const { content, data } = matter(source);
      const frontmatter = data as Frontmatter;

      return {
        slug,
        body: content,
        title: frontmatter.title ?? slug,
        description: frontmatter.description ?? "",
        date: frontmatter.date,
        author: frontmatter.author,
        coverImage: frontmatter.coverImage,
        coverAlt: frontmatter.coverAlt ?? frontmatter.title,
        tags: toStringArray(frontmatter.tags),
        tweetUrl: frontmatter.tweetUrl || undefined,
        links: toLinks(frontmatter.links),
        socialDraft: frontmatter.socialDraft || undefined,
        featured: Boolean(frontmatter.featured),
        stack: toStringArray(frontmatter.stack),
        businessBenefits: toStringArray(frontmatter.businessBenefits),
        technicalHighlights: toStringArray(frontmatter.technicalHighlights),
        client: frontmatter.client,
        role: frontmatter.role,
        year: frontmatter.year,
        status: frontmatter.status,
        liveUrl: frontmatter.liveUrl,
        repoUrl: frontmatter.repoUrl,
      };
    });
}

export function getAllPosts() {
  return readCollection("posts").sort((a, b) => {
    const aDate = a.date ? new Date(a.date).getTime() : 0;
    const bDate = b.date ? new Date(b.date).getTime() : 0;
    return bDate - aDate;
  });
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllProjects() {
  return readCollection("projects").sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function getProjectBySlug(slug: string) {
  return getAllProjects().find((project) => project.slug === slug);
}

export function formatDate(date?: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, site.url).toString();
}
