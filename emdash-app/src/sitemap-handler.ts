import { servicePages } from "./lib/services";

type SitemapEnv = {
	DB?: D1Database;
};

type SitemapEntry = {
	loc: string;
	lastmod: string;
};

const SITE_URL = "https://simplethin.gs";
const STATIC_LASTMOD = "2026-06-10T12:00:00.000Z";
const BRAND_LASTMOD = "2026-07-07T00:00:00.000Z";
const XML_HEADERS = {
	"Content-Type": "application/xml; charset=utf-8",
	"Cache-Control": "public, max-age=3600",
};

const staticPageEntries: SitemapEntry[] = [
	{ loc: "/", lastmod: STATIC_LASTMOD },
	{ loc: "/services", lastmod: STATIC_LASTMOD },
	...servicePages.map((service) => ({
		loc: `/services/${service.slug}`,
		lastmod: STATIC_LASTMOD,
	})),
	{ loc: "/projects", lastmod: STATIC_LASTMOD },
	{ loc: "/blog", lastmod: STATIC_LASTMOD },
	{ loc: "/about", lastmod: STATIC_LASTMOD },
	{ loc: "/brand", lastmod: BRAND_LASTMOD },
	{ loc: "/contact", lastmod: STATIC_LASTMOD },
];

const sitemapRoutes = new Set([
	"/sitemap.xml",
	"/sitemap-pages.xml",
	"/sitemap-posts.xml",
	"/sitemap-projects.xml",
]);

export function isSitemapPath(pathname: string) {
	return sitemapRoutes.has(pathname);
}

export async function handleSitemapGet(request: Request, env: SitemapEnv) {
	const { pathname } = new URL(request.url);

	if (pathname === "/sitemap.xml") {
		return sitemapIndex(env);
	}

	if (pathname === "/sitemap-pages.xml") {
		return urlset(staticPageEntries);
	}

	if (pathname === "/sitemap-posts.xml") {
		return contentUrlset(env, "posts", "/posts");
	}

	if (pathname === "/sitemap-projects.xml") {
		return contentUrlset(env, "projects", "/projects");
	}

	return new Response("Not found", { status: 404 });
}

async function sitemapIndex(env: SitemapEnv) {
	const [postsLastmod, projectsLastmod] = await Promise.all([
		collectionLastmod(env, "posts"),
		collectionLastmod(env, "projects"),
	]);
	const pageLastmod = latestLastmod(staticPageEntries);
	const entries = [
		{ loc: "/sitemap-pages.xml", lastmod: pageLastmod },
		{ loc: "/sitemap-posts.xml", lastmod: postsLastmod || STATIC_LASTMOD },
		{ loc: "/sitemap-projects.xml", lastmod: projectsLastmod || STATIC_LASTMOD },
	];
	const lines = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.flatMap((entry) => [
			"  <sitemap>",
			`    <loc>${escapeXml(absoluteUrl(entry.loc))}</loc>`,
			`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
			"  </sitemap>",
		]),
		"</sitemapindex>",
	];

	return new Response(lines.join("\n"), { headers: XML_HEADERS });
}

async function contentUrlset(env: SitemapEnv, collection: "posts" | "projects", prefix: string) {
	if (!env.DB) {
		return new Response("<!-- Database not configured -->", {
			status: 500,
			headers: XML_HEADERS,
		});
	}

	const table = collection === "posts" ? "ec_posts" : "ec_projects";
	const { results } = await env.DB.prepare(`
		SELECT c.id, c.slug, c.updated_at
		FROM ${table} c
		LEFT JOIN _emdash_seo s
			ON s.collection = ?
			AND s.content_id = c.id
		WHERE c.status = 'published'
			AND c.deleted_at IS NULL
			AND (s.seo_no_index IS NULL OR s.seo_no_index = 0)
		ORDER BY c.updated_at DESC
	`)
		.bind(collection)
		.all<{ id: string; slug: string | null; updated_at: string }>();

	return urlset(
		(results || []).map((row) => ({
			loc: `${prefix}/${encodeURIComponent(row.slug || row.id)}`,
			lastmod: row.updated_at,
		})),
	);
}

async function collectionLastmod(env: SitemapEnv, collection: "posts" | "projects") {
	if (!env.DB) return null;
	const table = collection === "posts" ? "ec_posts" : "ec_projects";
	const row = await env.DB.prepare(`
		SELECT MAX(c.updated_at) AS lastmod
		FROM ${table} c
		LEFT JOIN _emdash_seo s
			ON s.collection = ?
			AND s.content_id = c.id
		WHERE c.status = 'published'
			AND c.deleted_at IS NULL
			AND (s.seo_no_index IS NULL OR s.seo_no_index = 0)
	`)
		.bind(collection)
		.first<{ lastmod: string | null }>();

	return row?.lastmod || null;
}

function urlset(entries: SitemapEntry[]) {
	const lines = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.flatMap((entry) => [
			"  <url>",
			`    <loc>${escapeXml(absoluteUrl(entry.loc))}</loc>`,
			`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
			"  </url>",
		]),
		"</urlset>",
	];

	return new Response(lines.join("\n"), { headers: XML_HEADERS });
}

function latestLastmod(entries: SitemapEntry[]) {
	return entries
		.map((entry) => entry.lastmod)
		.sort((a, b) => b.localeCompare(a))[0] || STATIC_LASTMOD;
}

function absoluteUrl(path: string) {
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function escapeXml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}
