import Link from "next/link";

import PostList from "@/app/components/PostList";
import ProjectList from "@/app/components/ProjectList";
import { getAllPosts, getAllProjects, site } from "@/lib/content";
import { services } from "@/lib/services";

export default function Page() {
  const posts = getAllPosts().slice(0, 3);
  const projects = getAllProjects().filter((project) => project.featured).slice(0, 2);

  return (
    <>
      <section
        className="relative overflow-hidden border-b border-gray-100 bg-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,222,220,0.95) 0%, rgba(255,255,255,0.9) 38%, rgba(255,255,255,0.68) 100%), url('/images/posts/machine-for-dying.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white" />
        <div className="container relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <p className="eyebrow">{site.heroHeading}</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-normal text-black min-[360px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="text-red-500">Simple</span>
              <span>Things</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700 sm:text-xl">
              {site.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/services"
                className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-red-500"
              >
                Work together
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-gray-300 bg-white/80 px-5 py-3 text-sm font-medium text-gray-800 transition-colors hover:border-red-300 hover:text-red-500"
              >
                See project notes
              </Link>
              <span className="font-mono text-sm text-gray-600">{site.heroAvailability}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Single person agency</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-gray-950 sm:text-4xl">
              Senior technical help for small teams, weird systems, and useful launches.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className="rounded-md border border-gray-200 p-5">
                <h3 className="font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{service.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="section-shell">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Projects</p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-gray-950">
                Technical detail with business shape.
              </h2>
            </div>
            <Link href="/projects" className="hidden text-sm font-medium text-red-500 hover:underline sm:block">
              All projects
            </Link>
          </div>
          <ProjectList projects={projects} />
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Writing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-gray-950">
              Blog notes from real work.
            </h2>
          </div>
          <Link href="/blog" className="hidden text-sm font-medium text-red-500 hover:underline sm:block">
            All posts
          </Link>
        </div>
        <PostList posts={posts} />
      </section>
    </>
  );
}
