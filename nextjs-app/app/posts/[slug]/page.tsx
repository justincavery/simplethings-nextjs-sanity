import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import MdxBody from "@/app/components/MdxBody";
import PostList from "@/app/components/PostList";
import { absoluteUrl, formatDate, getAllPosts, getPostBySlug, site } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const image = post.coverImage ? absoluteUrl(post.coverImage) : absoluteUrl("/og/simplethings.svg");

  return {
    authors: post.author ? [{ name: post.author }] : [{ name: site.author.name }],
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      images: [{ url: image, alt: post.coverAlt || post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  } satisfies Metadata;
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const morePosts = getAllPosts().filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <>
      <article>
        <header className="section-shell">
          <div className="max-w-4xl">
            <p className="eyebrow">{formatDate(post.date)}</p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal text-gray-950 sm:text-6xl lg:text-7xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{post.description}</p>
            )}
            <p className="mt-6 text-sm text-gray-500">By {post.author || site.author.name}</p>
          </div>
        </header>

        {post.coverImage && (
          <div className="container">
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-gray-100">
              <Image
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                fill
                priority
                sizes="(min-width: 1280px) 1180px, calc(100vw - 4rem)"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="container grid gap-12 py-12 lg:grid-cols-[minmax(0,42rem)_18rem] lg:py-16">
          <MdxBody source={post.body} />
          <aside className="space-y-6 text-sm">
            {(post.tweetUrl || post.links.length > 0) && (
              <div className="rounded-md border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-950">Linkbacks</h2>
                <div className="mt-4 grid gap-3">
                  {post.tweetUrl && (
                    <a href={post.tweetUrl} className="text-red-500 hover:underline" target="_blank" rel="noreferrer">
                      Original tweet
                    </a>
                  )}
                  {post.links.map((link) => (
                    <a key={link.href} href={link.href} className="text-red-500 hover:underline" target="_blank" rel="noreferrer">
                      {link.title || link.href}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {post.socialDraft && (
              <div className="rounded-md border border-red-100 bg-red-50 p-5">
                <h2 className="font-semibold text-gray-950">Social version</h2>
                <p className="mt-3 leading-6 text-gray-700">{post.socialDraft}</p>
              </div>
            )}
          </aside>
        </div>
      </article>

      {morePosts.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="section-shell">
            <div className="mb-8">
              <p className="eyebrow">Keep reading</p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-gray-950">Recent posts</h2>
            </div>
            <PostList posts={morePosts} />
          </div>
        </section>
      )}
    </>
  );
}
