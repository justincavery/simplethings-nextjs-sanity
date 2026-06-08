import type { APIRoute } from "astro";
import { getEmDashCollection, getSiteSettings } from "emdash";

export const GET: APIRoute = async ({ site, url }) => {
	const siteUrl = site?.toString() || url.origin;
	const settings = await getSiteSettings();
	const { entries } = await getEmDashCollection("posts", { limit: 20 });
	const posts = entries.sort((a, b) => String(b.data.date || "").localeCompare(String(a.data.date || "")));

	const items = posts
		.map((post) => {
			const data = post.data as Record<string, any>;
			const postUrl = `${siteUrl.replace(/\/$/, "")}/posts/${post.id}`;
			const date = data.date ? new Date(data.date).toUTCString() : new Date().toUTCString();
			return `<item><title>${escapeXml(String(data.title || "Untitled"))}</title><link>${postUrl}</link><guid>${postUrl}</guid><pubDate>${date}</pubDate><description>${escapeXml(String(data.excerpt || ""))}</description></item>`;
		})
		.join("");

	return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(settings?.title || "Simple Things")}</title><description>${escapeXml(settings?.tagline || "")}</description><link>${siteUrl}</link>${items}</channel></rss>`, {
		headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
	});
};

function escapeXml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
