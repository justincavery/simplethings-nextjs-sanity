import Link from "next/link";

import { ContentEntry } from "@/lib/content";

type ProjectListProps = {
  projects: ContentEntry[];
};

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <article key={project.slug} className="rounded-md border border-gray-200 bg-white p-6">
          <div className="eyebrow">{project.year || project.status || "Project"}</div>
          <h3 className="mt-3 text-2xl font-semibold tracking-normal">
            <Link href={`/projects/${project.slug}`} className="hover:text-red-500">
              {project.title}
            </Link>
          </h3>
          <p className="mt-4 text-sm leading-6 text-gray-600">{project.description}</p>
          {project.stack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((item) => (
                <span key={item} className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600">
                  {item}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
