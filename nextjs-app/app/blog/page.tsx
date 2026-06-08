import type { Metadata } from "next";

import PostList from "@/app/components/PostList";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Short technical notes, debugging write-ups, and project thinking from Simple Things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="section-shell">
      <div className="max-w-3xl">
        <p className="eyebrow">Blog</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-gray-950 sm:text-6xl">
          Notes before the feed gets them.
        </h1>
        <p className="mt-5 text-lg leading-8 text-gray-600">
          Practical write-ups, fixes, project notes, and link-backed thoughts that start here first.
        </p>
      </div>
      <div className="mt-12">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
