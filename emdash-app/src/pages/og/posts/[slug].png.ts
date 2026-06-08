import type { APIRoute } from "astro";
import { decodeSlug, getEmDashEntry } from "emdash";

import { createOgImageResponse } from "../../../lib/og-image";
import { asSeoData, entrySeoDescription, entrySeoTitle } from "../../../lib/seo";

export const GET: APIRoute = async ({ params }) => {
	const slug = decodeSlug(params.slug);
	if (!slug) return new Response("Not found", { status: 404 });

	const { entry: post } = await getEmDashEntry("posts", slug);
	if (!post) return new Response("Not found", { status: 404 });

	const data = post.data as unknown as Record<string, unknown>;
	const seo = asSeoData(data.seo);

	return createOgImageResponse({
		title: entrySeoTitle(seo, String(data.title || "Simple Things post")),
		description: entrySeoDescription(
			seo,
			data.excerpt,
			data.content,
			"A technical note from Simple Things.",
		),
		kicker: "Blog post",
		label: "Blog",
	});
};
