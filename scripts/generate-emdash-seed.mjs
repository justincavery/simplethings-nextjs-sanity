import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const repoRoot = path.resolve(import.meta.dirname, "..");
const nextAppRoot = path.join(repoRoot, "nextjs-app");
const emdashRoot = path.join(repoRoot, "emdash-app");
const contentRoot = path.join(nextAppRoot, "content");

const requireFromNext = createRequire(path.join(nextAppRoot, "package.json"));
const matter = requireFromNext("gray-matter");

let keyCounter = 0;

const site = JSON.parse(fs.readFileSync(path.join(contentRoot, "site.json"), "utf8"));

const services = [
	{
		title: "Cloud, DevOps and reliability",
		summary:
			"Infrastructure design, automation, cost control, observability, deployment pipelines, and pragmatic recovery work when production needs calm hands.",
		outcomes: ["Lower running costs", "Clearer release paths", "Recoverable systems"],
	},
	{
		title: "Blockchain data and subgraphs",
		summary:
			"Subgraph design, indexing reliability, The Graph troubleshooting, protocol data pipelines, and the small scripts that make flaky workflows survivable.",
		outcomes: ["Stable indexing", "Cleaner data access", "Less operator toil"],
	},
	{
		title: "Web platforms and product engineering",
		summary:
			"Fast sites, internal tools, API integrations, CMS migrations, and web products that keep their operational shape after launch.",
		outcomes: ["Faster delivery", "Better maintainability", "Useful documentation"],
	},
	{
		title: "Technical strategy for small teams",
		summary:
			"Senior engineering judgement without hiring a full team: architecture reviews, vendor decisions, delivery planning, and hands-on implementation.",
		outcomes: ["Sharper priorities", "Reduced risk", "More confident decisions"],
	},
];

function generateKey() {
	return `k${(keyCounter++).toString(36)}`;
}

function parseInline(text) {
	const spans = [];
	const markDefs = [];
	const pattern =
		/(\*\*(.+?)\*\*)|(_(.+?)_)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))|(~~(.+?)~~)/g;
	let lastIndex = 0;
	let match;

	while ((match = pattern.exec(text)) !== null) {
		if (match.index > lastIndex) {
			spans.push({
				_type: "span",
				_key: generateKey(),
				text: text.slice(lastIndex, match.index),
				marks: [],
			});
		}

		if (match[2] != null) {
			spans.push({ _type: "span", _key: generateKey(), text: match[2], marks: ["strong"] });
		} else if (match[4] != null) {
			spans.push({ _type: "span", _key: generateKey(), text: match[4], marks: ["em"] });
		} else if (match[6] != null) {
			spans.push({ _type: "span", _key: generateKey(), text: match[6], marks: ["code"] });
		} else if (match[8] != null && match[9] != null) {
			const key = generateKey();
			markDefs.push({ _key: key, _type: "link", href: match[9] });
			spans.push({ _type: "span", _key: generateKey(), text: match[8], marks: [key] });
		} else if (match[11] != null) {
			spans.push({
				_type: "span",
				_key: generateKey(),
				text: match[11],
				marks: ["strike-through"],
			});
		}

		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		spans.push({ _type: "span", _key: generateKey(), text: text.slice(lastIndex), marks: [] });
	}

	if (spans.length === 0) {
		spans.push({ _type: "span", _key: generateKey(), text, marks: [] });
	}

	return { spans, markDefs };
}

function makeBlock(text, style = "normal") {
	const { spans, markDefs } = parseInline(text);
	return { _type: "block", _key: generateKey(), style, markDefs, children: spans };
}

function makeListBlock(text, listItem, level) {
	const { spans, markDefs } = parseInline(text);
	return {
		_type: "block",
		_key: generateKey(),
		style: "normal",
		listItem,
		level,
		markDefs,
		children: spans,
	};
}

function markdownToPortableText(markdown) {
	const blocks = [];
	const lines = markdown.replace(/\r\n/g, "\n").split("\n");
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		if (line.trim() === "") {
			i++;
			continue;
		}

		if (line.startsWith("```")) {
			const language = line.slice(3).trim();
			const code = [];
			i++;
			while (i < lines.length && !lines[i].startsWith("```")) {
				code.push(lines[i]);
				i++;
			}
			blocks.push({
				_type: "code",
				_key: generateKey(),
				language: language || undefined,
				code: code.join("\n"),
			});
			i++;
			continue;
		}

		const heading = line.match(/^(#{1,6})\s+(.+)$/);
		if (heading) {
			blocks.push(makeBlock(heading[2], `h${heading[1].length}`));
			i++;
			continue;
		}

		if (line.startsWith("> ")) {
			blocks.push(makeBlock(line.slice(2), "blockquote"));
			i++;
			continue;
		}

		const unordered = line.match(/^(\s*)[-*+]\s+(.+)$/);
		if (unordered) {
			blocks.push(makeListBlock(unordered[2], "bullet", Math.floor(unordered[1].length / 2) + 1));
			i++;
			continue;
		}

		const ordered = line.match(/^(\s*)\d+\.\s+(.+)$/);
		if (ordered) {
			blocks.push(makeListBlock(ordered[2], "number", Math.floor(ordered[1].length / 2) + 1));
			i++;
			continue;
		}

		const paragraph = [line.trim()];
		i++;
		while (
			i < lines.length &&
			lines[i].trim() !== "" &&
			!lines[i].startsWith("```") &&
			!lines[i].match(/^(#{1,6})\s+/) &&
			!lines[i].startsWith("> ") &&
			!lines[i].match(/^(\s*)[-*+]\s+/) &&
			!lines[i].match(/^(\s*)\d+\.\s+/)
		) {
			paragraph.push(lines[i].trim());
			i++;
		}
		blocks.push(makeBlock(paragraph.join(" ")));
	}

	return blocks;
}

function readCollection(collection) {
	const directory = path.join(contentRoot, collection);
	return fs
		.readdirSync(directory)
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => {
			const source = fs.readFileSync(path.join(directory, filename), "utf8");
			const { content, data } = matter(source);
			return {
				slug: filename.replace(/\.mdx$/, ""),
				body: content.trim(),
				data,
			};
		});
}

function toArray(value) {
	return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item) : [];
}

function contentImage(value) {
	return typeof value === "string" && value.startsWith("/") ? value : "";
}

function termSlug(value) {
	return value
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function dateOnly(date) {
	if (!date) return "";
	return new Date(date).toISOString().slice(0, 10);
}

function pageContent(title, paragraphs) {
	return [
		makeBlock(title, "h1"),
		...paragraphs.flatMap((paragraph) => {
			if (Array.isArray(paragraph)) {
				return paragraph.map((item) => makeListBlock(item, "bullet", 1));
			}
			return [makeBlock(paragraph)];
		}),
	];
}

const posts = readCollection("posts")
	.sort((a, b) => new Date(b.data.date ?? 0).getTime() - new Date(a.data.date ?? 0).getTime())
	.map(({ slug, body, data }) => ({
		id: `post-${slug}`,
		slug,
		status: "published",
		data: {
			title: data.title ?? slug,
			excerpt: data.description ?? "",
			date: dateOnly(data.date),
			tweet_url: data.tweetUrl || "",
			social_draft: data.socialDraft || "",
			links: Array.isArray(data.links) ? data.links : [],
			featured_image: contentImage(data.coverImage),
			content: markdownToPortableText(body),
		},
		bylines: [{ byline: "justin-avery" }],
		taxonomies: {
			tag: toArray(data.tags),
		},
	}));

const projects = readCollection("projects")
	.sort((a, b) => Number(Boolean(b.data.featured)) - Number(Boolean(a.data.featured)))
	.map(({ slug, body, data }) => ({
		id: `project-${slug}`,
		slug,
		status: "published",
		data: {
			title: data.title ?? slug,
			summary: data.description ?? "",
			featured_image: contentImage(data.coverImage),
			client: data.client || "Simple Things",
			year: data.year || "",
			project_status: data.status || "",
			stack: toArray(data.stack),
			business_benefits: toArray(data.businessBenefits),
			technical_highlights: toArray(data.technicalHighlights),
			content: markdownToPortableText(body),
			gallery: [],
			url: data.liveUrl || "",
			repo_url: data.repoUrl || "",
		},
		taxonomies: {
			tag: toArray(data.stack).map(termSlug),
		},
	}));

const tagTerms = new Map();
for (const post of posts) {
	for (const tag of post.taxonomies.tag) tagTerms.set(termSlug(tag), tag);
}
for (const project of projects) {
	for (const stack of project.data.stack) tagTerms.set(termSlug(stack), stack);
}

const serviceContent = services.flatMap((service) => [
	makeBlock(service.title, "h2"),
	makeBlock(service.summary),
	...service.outcomes.map((outcome) => makeListBlock(outcome, "bullet", 1)),
]);

const seed = {
	$schema: "https://emdashcms.com/seed.schema.json",
	version: "1",
	meta: {
		name: "Simple Things",
		description: "Migrated Sanity content and schema for the Simple Things agency site.",
		author: "Justin Avery",
	},
	settings: {
		title: site.title,
		tagline: site.description,
		description: site.heroDescription,
		siteUrl: site.url,
	},
	collections: [
		{
			slug: "posts",
			label: "Posts",
			labelSingular: "Post",
			supports: ["drafts", "revisions", "search", "seo"],
			commentsEnabled: true,
			urlPattern: "/posts/{slug}",
			fields: [
				{ slug: "title", label: "Title", type: "string", required: true, searchable: true },
				{ slug: "excerpt", label: "Excerpt", type: "text", searchable: true },
				{ slug: "date", label: "Original publish date", type: "datetime" },
				{ slug: "featured_image", label: "Featured Image", type: "image" },
				{ slug: "content", label: "Content", type: "portableText", searchable: true },
				{ slug: "tweet_url", label: "Referenced tweet URL", type: "url" },
				{ slug: "links", label: "Linkbacks", type: "json" },
				{ slug: "social_draft", label: "Social post draft", type: "text" },
			],
		},
		{
			slug: "projects",
			label: "Projects",
			labelSingular: "Project",
			supports: ["drafts", "revisions", "search", "seo"],
			urlPattern: "/projects/{slug}",
			fields: [
				{ slug: "title", label: "Title", type: "string", required: true, searchable: true },
				{ slug: "summary", label: "Summary", type: "text", searchable: true },
				{ slug: "featured_image", label: "Featured Image", type: "image" },
				{ slug: "client", label: "Client", type: "string" },
				{ slug: "year", label: "Year", type: "string" },
				{ slug: "project_status", label: "Status", type: "string" },
				{ slug: "stack", label: "Technical stack", type: "json" },
				{ slug: "business_benefits", label: "Business benefits", type: "json" },
				{ slug: "technical_highlights", label: "Technical highlights", type: "json" },
				{ slug: "content", label: "Content", type: "portableText", searchable: true },
				{ slug: "gallery", label: "Gallery", type: "json" },
				{ slug: "url", label: "Project URL", type: "url" },
				{ slug: "repo_url", label: "Repository URL", type: "url" },
			],
		},
		{
			slug: "pages",
			label: "Pages",
			labelSingular: "Page",
			supports: ["drafts", "revisions", "search", "seo"],
			fields: [
				{ slug: "title", label: "Title", type: "string", required: true, searchable: true },
				{ slug: "content", label: "Content", type: "portableText", searchable: true },
			],
		},
	],
	taxonomies: [
		{
			name: "tag",
			label: "Tags",
			labelSingular: "Tag",
			hierarchical: false,
			collections: ["posts", "projects"],
			terms: [...tagTerms.entries()].map(([slug, label]) => ({ slug, label })),
		},
	],
	bylines: [
		{
			id: "justin-avery",
			slug: "justin-avery",
			displayName: site.author.name,
			bio: site.author.role,
			websiteUrl: site.url,
		},
	],
	menus: [
		{
			name: "primary",
			label: "Primary Navigation",
			items: [
				{ type: "custom", label: "Home", url: "/" },
				{ type: "custom", label: "Services", url: "/services" },
				{ type: "custom", label: "Projects", url: "/projects" },
				{ type: "custom", label: "Blog", url: "/blog" },
				{ type: "custom", label: "Contact", url: "/contact" },
			],
		},
	],
	redirects: [{ source: "/posts", destination: "/blog", type: 301, enabled: true }],
	content: {
		pages: [
			{
				id: "page-about",
				slug: "about",
				status: "published",
				data: {
					title: "About",
					content: pageContent("About Simple Things", [
						"Simple Things is the independent technology practice of Justin Avery. It helps small teams turn messy infrastructure, brittle deployment paths, blockchain data problems, and CMS migrations into systems they can understand and operate.",
						"The work is deliberately practical: clear architecture, useful automation, calm recovery, and documentation that survives beyond the week it was written.",
					]),
				},
			},
			{
				id: "page-services",
				slug: "services",
				status: "published",
				data: {
					title: "Services",
					content: [makeBlock("Services", "h1"), ...serviceContent],
				},
			},
		],
		posts,
		projects,
	},
};

fs.mkdirSync(path.join(emdashRoot, "seed"), { recursive: true });
fs.writeFileSync(path.join(emdashRoot, "seed", "seed.json"), `${JSON.stringify(seed, null, "\t")}\n`);

console.log(`Generated EmDash seed with ${posts.length} posts and ${projects.length} projects.`);
