import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";

import { createOgImageResponse } from "../../lib/og-image";

export const GET: APIRoute = async () => {
	const settings = await getSiteSettings();

	return createOgImageResponse({
		title: settings?.title || "Simple Things Limited",
		description:
			settings?.tagline ||
			"Recovery, migration, delivery, and calmer technical systems for small teams.",
		kicker: "Independent technical consultancy",
		label: "Simple",
	});
};
