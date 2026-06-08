export type HomeSectionKind =
	| "hero"
	| "steps"
	| "services"
	| "projects"
	| "posts"
	| "rich_text"
	| "cta";

export type HomeSection = {
	type: HomeSectionKind;
	eyebrow?: string;
	title?: string;
	summary?: string;
	body?: string;
	primary_label?: string;
	primary_url?: string;
	secondary_label?: string;
	secondary_url?: string;
	items?: string;
	source?: "manual" | "projects" | "posts";
	limit?: number;
	variant?: "default" | "field" | "compact";
};

export type SectionItem = {
	title: string;
	summary?: string;
	url?: string;
	meta?: string;
};

const sectionTypes = new Set<HomeSectionKind>([
	"hero",
	"steps",
	"services",
	"projects",
	"posts",
	"rich_text",
	"cta",
]);

export const defaultServicesText = [
	"Architecture and technical direction | CTO-style support for platform choices, delivery planning, vendor decisions, and readable technical strategy.",
	"Automation and modernisation | CMS migrations, publishing workflows, practical automation, and platform moves with fewer moving parts.",
	"APIs, indexing and data platforms | Resilient APIs, search and indexing systems, blockchain data flows, and product-ready integration layers.",
	"DevOps, servers and reliability | CI/CD, observability, deployments, server configuration, automation, and infrastructure made boring enough to trust.",
	"Web platforms and CMS publishing | Fast sites, practical editing flows, content models, and publishing tools that are pleasant to use.",
	"Performance and edge-ready systems | Performance optimisation, caching strategy, modern hosting, and fast delivery paths close to users.",
].join("\n");

export const defaultFieldNotesText = [
	"Best fit | Small teams with messy platforms, migrations, brittle infra, or unclear technical choices.",
	"Method | Trace the failure path, simplify the surface area, document the trade-offs, leave the team stronger.",
	"Bias | Fast platforms, boring automation, readable docs, fewer moving parts.",
].join("\n");

export const defaultStepsText = [
	"Understand | We agree what matters, what is stuck, and what a useful outcome looks like.",
	"Simplify | We reduce the moving parts, fix the riskiest path first, and keep decisions visible.",
	"Hand over | You get a working system, clear notes, and a calmer way to run it next time.",
].join("\n");

export const defaultHomeSections: HomeSection[] = [
	{
		type: "hero",
		eyebrow: "Independent technology consultancy",
		title: "Empowering your business through technology.",
		summary:
			"I help teams design, modernise, and ship web platforms: practical automation, CMS migrations, resilient APIs, indexing, DevOps, performance optimisation, and edge-ready infrastructure.",
		primary_label: "Services",
		primary_url: "/services",
		secondary_label: "Selected work",
		secondary_url: "/projects",
		items: defaultFieldNotesText,
		variant: "field",
	},
	{
		type: "steps",
		eyebrow: "Simple steps",
		title: "A calm way through technical work",
		items: defaultStepsText,
	},
	{
		type: "services",
		title: "What I help with",
		primary_label: "View services",
		primary_url: "/services",
		items: defaultServicesText,
	},
	{
		type: "projects",
		title: "Projects",
		primary_label: "View all",
		primary_url: "/projects",
		source: "projects",
		limit: 4,
	},
	{
		type: "posts",
		title: "Recent writing",
		primary_label: "Read the blog",
		primary_url: "/blog",
		source: "posts",
		limit: 4,
	},
];

export function textValue(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

export function asPositiveInteger(value: unknown, fallback: number): number {
	const parsed = typeof value === "number" ? value : Number.parseInt(textValue(value), 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function normaliseHomeSections(value: unknown): HomeSection[] {
	const parsed = typeof value === "string" ? parseJsonArray(value) : value;
	if (!Array.isArray(parsed)) return [];

	return parsed
		.map((section): HomeSection | null => {
			if (!section || typeof section !== "object" || Array.isArray(section)) return null;
			const record = section as Record<string, unknown>;
			const type = textValue(record.type) as HomeSectionKind;
			if (!sectionTypes.has(type)) return null;

			const normalised: HomeSection = {
				type,
				eyebrow: textValue(record.eyebrow),
				title: textValue(record.title),
				summary: textValue(record.summary),
				body: textValue(record.body),
				primary_label: textValue(record.primary_label),
				primary_url: textValue(record.primary_url),
				secondary_label: textValue(record.secondary_label),
				secondary_url: textValue(record.secondary_url),
				items: textValue(record.items),
				source: normaliseSource(record.source),
				limit: asPositiveInteger(record.limit, 0) || undefined,
				variant: normaliseVariant(record.variant),
			};

			return normalised;
		})
		.filter((section): section is HomeSection => Boolean(section));
}

export function parseSectionItems(value: unknown): SectionItem[] {
	return textValue(value)
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [title = "", summary = "", url = "", meta = ""] = line
				.split("|")
				.map((part) => part.trim());
			return { title, summary, url, meta };
		})
		.filter((item) => item.title);
}

function parseJsonArray(value: string): unknown[] {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function normaliseSource(value: unknown): HomeSection["source"] {
	const source = textValue(value);
	return source === "projects" || source === "posts" ? source : "manual";
}

function normaliseVariant(value: unknown): HomeSection["variant"] {
	const variant = textValue(value);
	return variant === "field" || variant === "compact" ? variant : "default";
}
