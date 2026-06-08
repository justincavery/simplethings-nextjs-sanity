const DESCRIPTION_MAX_LENGTH = 155;
const TRAILING_SLASH_RE = /\/$/;

type SeoData = {
	title?: unknown;
	description?: unknown;
	image?: unknown;
	canonical?: unknown;
};

export function asSeoData(value: unknown): SeoData {
	return value && typeof value === "object" ? (value as SeoData) : {};
}

export function textValue(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

export function siteOrigin(settingsUrl: unknown, requestUrl: URL): string {
	const candidates = [textValue(settingsUrl), requestUrl.origin];
	for (const candidate of candidates) {
		if (!candidate) continue;
		try {
			const parsed = new URL(candidate);
			if (parsed.protocol === "http:" || parsed.protocol === "https:") {
				return parsed.origin;
			}
		} catch {
			// Fall through to the next candidate.
		}
	}
	return requestUrl.origin;
}

export function absoluteUrl(value: string, origin: string): string {
	try {
		return new URL(value, origin).href;
	} catch {
		return new URL("/", origin).href;
	}
}

export function canonicalFor(requestUrl: URL, settingsUrl: unknown, canonical?: string | null): string {
	const origin = siteOrigin(settingsUrl, requestUrl);
	const value = canonical?.trim();
	const url = value ? new URL(value, origin) : new URL(requestUrl.pathname, origin);
	url.search = "";
	url.hash = "";
	return url.href;
}

export function ogImageFor(requestUrl: URL, settingsUrl: unknown, path: string): string {
	return absoluteUrl(path, siteOrigin(settingsUrl, requestUrl));
}

export function entrySeoTitle(seo: SeoData, fallback: string): string {
	return textValue(seo.title) || fallback;
}

export function entrySeoDescription(
	seo: SeoData,
	primary: unknown,
	content: unknown,
	fallback: string,
): string {
	return truncateDescription(
		textValue(seo.description) || textValue(primary) || portableTextExcerpt(content) || fallback,
	);
}

export function entrySeoCanonical(seo: SeoData): string | null {
	return textValue(seo.canonical) || null;
}

export function entrySeoImage(seo: SeoData, generatedImage: string): string {
	return textValue(seo.image) || generatedImage;
}

export function portableTextExcerpt(value: unknown): string {
	if (!Array.isArray(value)) return "";
	const parts: string[] = [];

	for (const block of value) {
		if (!block || typeof block !== "object") continue;
		const children = (block as { children?: unknown }).children;
		if (!Array.isArray(children)) continue;

		for (const child of children) {
			if (!child || typeof child !== "object") continue;
			const text = (child as { text?: unknown }).text;
			if (typeof text === "string" && text.trim()) parts.push(text.trim());
		}

		if (parts.join(" ").length >= DESCRIPTION_MAX_LENGTH) break;
	}

	return truncateDescription(parts.join(" "));
}

export function truncateDescription(value: string, maxLength = DESCRIPTION_MAX_LENGTH): string {
	const normalised = value.replace(/\s+/g, " ").trim();
	if (normalised.length <= maxLength) return normalised;
	const clipped = normalised.slice(0, maxLength);
	const lastSpace = clipped.lastIndexOf(" ");
	return clipped
		.slice(0, lastSpace > 80 ? lastSpace : clipped.length)
		.replace(/[,:;.-]+$/, "")
		.trim();
}

export function stripTrailingSlash(value: string): string {
	return value.replace(TRAILING_SLASH_RE, "");
}
