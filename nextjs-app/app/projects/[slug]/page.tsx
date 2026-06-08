import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import MdxBody from "@/app/components/MdxBody";
import { absoluteUrl, getAllProjects, getProjectBySlug } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const project = getProjectBySlug(params.slug);

  if (!project) return { title: "Project not found" };

  const image = project.coverImage ? absoluteUrl(project.coverImage) : absoluteUrl("/og/simplethings.svg");

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: image, alt: project.coverAlt || project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [image],
    },
  };
}

export default async function ProjectPage(props: Props) {
  const params = await props.params;
  const project = getProjectBySlug(params.slug);

  if (!project) return notFound();

  return (
    <article>
      <header className="section-shell">
        <div className="max-w-4xl">
          <p className="eyebrow">{project.year || project.status || "Project"}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-normal text-gray-950 sm:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{project.description}</p>
        </div>
      </header>

      {project.coverImage && (
        <div className="container">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-gray-100">
            <Image
              src={project.coverImage}
              alt={project.coverAlt || project.title}
              fill
              priority
              sizes="(min-width: 1280px) 1180px, calc(100vw - 4rem)"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="container grid gap-12 py-12 lg:grid-cols-[minmax(0,42rem)_20rem] lg:py-16">
        <MdxBody source={project.body} />
        <aside className="space-y-6 text-sm">
          {project.stack.length > 0 && (
            <div className="rounded-md border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-950">Technical stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.businessBenefits.length > 0 && (
            <div className="rounded-md border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-950">Business benefits</h2>
              <ul className="mt-4 grid gap-2 text-gray-600">
                {project.businessBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {project.technicalHighlights.length > 0 && (
            <div className="rounded-md border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-950">Technical highlights</h2>
              <ul className="mt-4 grid gap-2 text-gray-600">
                {project.technicalHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {(project.liveUrl || project.repoUrl) && (
            <div className="rounded-md border border-red-100 bg-red-50 p-5">
              <h2 className="font-semibold text-gray-950">Links</h2>
              <div className="mt-4 grid gap-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} className="text-red-500 hover:underline" target="_blank" rel="noreferrer">
                    Live project
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} className="text-red-500 hover:underline" target="_blank" rel="noreferrer">
                    Repository
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
