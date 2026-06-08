import { defineMiddleware } from "astro:middleware";

const CONTENT_API_PREFIX = "/_emdash/api/content/";
const URL_DATA_FIELDS = new Set(["repo_url", "tweet_url", "url"]);
const GITHUB_REPO_SHORTHAND = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/.*)?$/;
const MARKDOWN_LINK = /^\s*\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/;
const SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normaliseUrlValue(field: string, value: unknown): unknown {
	if (typeof value !== "string") return value;

	const trimmed = value.trim();
	if (!trimmed) return null;

	const markdownUrl = MARKDOWN_LINK.exec(trimmed)?.[1];
	const candidate = markdownUrl || trimmed;

	if (SCHEME.test(candidate)) return candidate;
	if (/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:[/:?#].*)?$/.test(candidate)) {
		return `https://${candidate}`;
	}
	if (field === "repo_url" && GITHUB_REPO_SHORTHAND.test(candidate)) {
		return `https://github.com/${candidate}`;
	}

	return candidate;
}

function normaliseEmDashContentBody(body: unknown): { body: unknown; changed: boolean } {
	if (!isRecord(body)) return { body, changed: false };

	let changed = false;
	const nextBody: Record<string, unknown> = { ...body };

	if (isRecord(nextBody.data)) {
		const nextData = { ...nextBody.data };
		for (const field of URL_DATA_FIELDS) {
			if (!(field in nextData)) continue;
			const normalised = normaliseUrlValue(field, nextData[field]);
			if (normalised !== nextData[field]) {
				nextData[field] = normalised;
				changed = true;
			}
		}
		nextBody.data = nextData;
	}

	if (isRecord(nextBody.seo) && "canonical" in nextBody.seo) {
		const nextSeo = { ...nextBody.seo };
		const normalised = normaliseUrlValue("canonical", nextSeo.canonical);
		if (normalised !== nextSeo.canonical) {
			nextSeo.canonical = normalised;
			nextBody.seo = nextSeo;
			changed = true;
		}
	}

	return { body: nextBody, changed };
}

function isContentWriteRequest(pathname: string, method: string) {
	if (method !== "POST" && method !== "PUT") return false;
	if (!pathname.startsWith(CONTENT_API_PREFIX)) return false;

	const rest = pathname.slice(CONTENT_API_PREFIX.length).split("/").filter(Boolean);
	return (
		(method === "POST" && rest.length === 1) ||
		(method === "PUT" && rest.length === 2)
	);
}

export const onRequest = defineMiddleware(async (context, next) => {
	const design = context.url.searchParams.get("design");

	if (design === "field" || design === "current") {
		context.cookies.set("design", design, {
			httpOnly: false,
			maxAge: 60 * 60 * 24 * 365,
			path: "/",
			sameSite: "lax",
			secure: context.url.protocol === "https:",
		});
	}

	if (isContentWriteRequest(context.url.pathname, context.request.method)) {
		try {
			const originalBody = await context.request.clone().json();
			const { body, changed } = normaliseEmDashContentBody(originalBody);
			if (changed) {
				const headers = new Headers(context.request.headers);
				headers.set("content-type", "application/json");
				headers.delete("content-length");

				return next(
					new Request(context.request.url, {
						method: context.request.method,
						headers,
						body: JSON.stringify(body),
					}),
				);
			}
		} catch {
			// Leave non-JSON or malformed requests to EmDash's own parser.
		}
	}

	return next();
});
