import type { APIRoute } from "astro";
import { decodeSlug, getEmDashEntry } from "emdash";

import { createOgImageResponse } from "../../../lib/og-image";
import { asSeoData, entrySeoDescription, entrySeoTitle } from "../../../lib/seo";

export const GET: APIRoute = async ({ params }) => {
	const slug = decodeSlug(params.slug);
	if (!slug) return new Response("Not found", { status: 404 });

	const { entry: project } = await getEmDashEntry("projects", slug);
	if (!project) return new Response("Not found", { status: 404 });

	const data = project.data as unknown as Record<string, unknown>;
	const seo = asSeoData(data.seo);

	return createOgImageResponse({
		title: entrySeoTitle(seo, String(data.title || "Simple Things project")),
		description: entrySeoDescription(
			seo,
			data.summary,
			data.content,
			"A Simple Things case study from a technical and business-benefit point of view.",
		),
		label: "Project",
	});
};
