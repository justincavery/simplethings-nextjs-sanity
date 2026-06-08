import Link from "next/link";

import { ContentEntry, formatDate } from "@/lib/content";

type PostListProps = {
  posts: ContentEntry[];
};

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-8">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="grid gap-4 border-t border-gray-200 pt-8 sm:grid-cols-[11rem_1fr]"
        >
          <div className="text-sm text-gray-500">{formatDate(post.date)}</div>
          <div>
            <h2 className="text-2xl font-semibold tracking-normal text-gray-950">
              <Link href={`/posts/${post.slug}`} className="underline decoration-gray-300 transition-colors hover:text-red-500">
                {post.title}
              </Link>
            </h2>
            {post.description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">{post.description}</p>
            )}
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
