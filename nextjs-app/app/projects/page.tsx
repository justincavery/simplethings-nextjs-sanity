import type { Metadata } from "next";

import ProjectList from "@/app/components/ProjectList";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected Simple Things project notes with technical highlights and business benefits.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="section-shell">
      <div className="max-w-3xl">
        <p className="eyebrow">Projects</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-gray-950 sm:text-6xl">
          Work shown as engineering decisions and business outcomes.
        </h1>
        <p className="mt-5 text-lg leading-8 text-gray-600">
          A small set of project notes drawn from infrastructure, blockchain data, recovery work, and web platform builds.
        </p>
      </div>
      <div className="mt-12">
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}
