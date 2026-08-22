import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { monotonicFactory } from "ulidx";

const DB_NAME = "simplethings-cms-prod";
const AUTHOR_ID = "01KT9TQNGGEBT4B2E9HEFTEFSD";
const BYLINE_ID = "01KT9PRAT0KE95S17A3FZ89HN8";
const DRAFT_PATH = new URL(
	"../drafts/see-your-website-the-way-chatgpt-does.md",
	import.meta.url,
);
const NOW = new Date().toISOString();
const ulid = monotonicFactory();

let keyIndex = 0;

function key(prefix) {
	keyIndex += 1;
	return `${prefix}${keyIndex.toString(36)}`;
}

function sqlString(value) {
	if (value === null || value === undefined) return "NULL";
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
	return sqlString(JSON.stringify(value));
}

function stripQuotes(value) {
	const trimmed = value.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function parseDraft(markdown) {
	const normalised = markdown.replace(/\r\n/g, "\n");
	const match = normalised.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) throw new Error(`Invalid frontmatter in ${DRAFT_PATH.pathname}`);

	const metadata = {};
	for (const line of match[1].split("\n")) {
		const separator = line.indexOf(":");
		if (separator === -1) continue;
		metadata[line.slice(0, separator).trim()] = stripQuotes(
			line.slice(separator + 1),
		);
	}

	return { metadata, body: match[2].trim() };
}

function sameMarks(left, right) {
	return left.length === right.length && left.every((mark, index) => mark === right[index]);
}

function pushSpan(children, text, marks = []) {
	if (!text) return;
	const previous = children.at(-1);
	if (previous && sameMarks(previous.marks || [], marks)) {
		previous.text += text;
		return;
	}
	children.push({ _type: "span", _key: key("s"), text, marks });
}

function parseInline(text) {
	const children = [];
	const markDefs = [];
	let index = 0;

	while (index < text.length) {
		if (text[index] === "[") {
			const labelEnd = text.indexOf("]", index + 1);
			const hrefStart = labelEnd === -1 ? -1 : text.indexOf("(", labelEnd);
			const hrefEnd = hrefStart === -1 ? -1 : text.indexOf(")", hrefStart);
			if (labelEnd !== -1 && hrefStart === labelEnd + 1 && hrefEnd !== -1) {
				const markKey = key("m");
				const href = text.slice(hrefStart + 1, hrefEnd);
				markDefs.push({
					_type: "link",
					_key: markKey,
					href,
					blank: /^https?:\/\//i.test(href),
				});
				pushSpan(children, text.slice(index + 1, labelEnd), [markKey]);
				index = hrefEnd + 1;
				continue;
			}
		}

		if (text.startsWith("**", index)) {
			const end = text.indexOf("**", index + 2);
			if (end !== -1) {
				pushSpan(children, text.slice(index + 2, end), ["strong"]);
				index = end + 2;
				continue;
			}
		}

		if (text[index] === "_" || text[index] === "`") {
			const marker = text[index];
			const end = text.indexOf(marker, index + 1);
			if (end !== -1) {
				pushSpan(children, text.slice(index + 1, end), [marker === "_" ? "em" : "code"]);
				index = end + 1;
				continue;
			}
		}

		const positions = ["[", "**", "_", "`"]
			.map((token) => text.indexOf(token, index + 1))
			.filter((position) => position !== -1)
			.sort((a, b) => a - b);
		const next = positions[0] ?? text.length;
		pushSpan(children, text.slice(index, next));
		index = next;
	}

	return { children, markDefs };
}

function makeBlock(text, style = "normal") {
	const { children, markDefs } = parseInline(text);
	return { _type: "block", _key: key("b"), style, markDefs, children };
}

function markdownToPortableText(markdown) {
	const blocks = [];
	let paragraph = [];

	function flushParagraph() {
		const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
		paragraph = [];
		if (text) blocks.push(makeBlock(text));
	}

	for (const line of markdown.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) {
			flushParagraph();
			continue;
		}

		const heading = trimmed.match(/^(#{2,6})\s+(.+)$/);
		if (heading) {
			flushParagraph();
			blocks.push(makeBlock(heading[2], `h${heading[1].length}`));
			continue;
		}

		paragraph.push(trimmed);
	}

	flushParagraph();
	return blocks;
}

const { metadata, body } = parseDraft(readFileSync(DRAFT_PATH, "utf8"));
const requiredMetadata = ["title", "excerpt", "date", "slug", "featured_image"];
for (const field of requiredMetadata) {
	if (!metadata[field]) throw new Error(`Missing ${field} in ${DRAFT_PATH.pathname}`);
}

const postId = ulid();
const postRevisionId = ulid();
const bylineCreditId = ulid();
const postContent = markdownToPortableText(body);
const postDate = `${metadata.date}T08:00:00.000Z`;
const postData = {
	title: metadata.title,
	excerpt: metadata.excerpt,
	date: postDate,
	featured_image: metadata.featured_image,
	content: postContent,
	tweet_url: null,
	links: [],
	social_draft:
		"A site can look perfect in a browser and still hand an AI answer engine an empty shell. I built a free AEO Audit that shows what survives when a page is fetched without JavaScript — including crawler access, structured meaning, content structure, and answerability.",
};

const projectId = ulid();
const projectRevisionId = ulid();
const projectData = {
	title: "AEO Audit",
	summary:
		"A free Cloudflare-hosted auditor that shows what AI answer engines can retrieve, understand, and cite from any page.",
	featured_image: "https://aeo.simplethin.gs/og.png",
	client: "Simple Things",
	year: "2026",
	project_status: "Live",
	stack: [
		{ category: "Platform", capabilities: "Cloudflare Workers, edge caching, email alerts" },
		{ category: "Audit", capabilities: "HTML parsing, robots.txt, JSON-LD, sitemap sampling" },
		{ category: "AI", capabilities: "answer-engine access, bounded language-model summaries" },
	],
	business_benefits: [
		{ benefit: "Shows teams what AI answer engines can actually retrieve from their public pages." },
		{ benefit: "Rolls repeated findings up to the template level so one fix can improve many URLs." },
		{ benefit: "Turns a sampled audit into a prioritised, practical improvement list." },
	],
	technical_highlights: [
		{ highlight: "Fetches raw HTML without JavaScript, cookies or login and refuses to grade unreadable responses." },
		{ highlight: "Separates training-crawler policy from the agents used to fetch live answers." },
		{ highlight: "Samples ten sitemap URLs across the estate and groups shared issues." },
		{ highlight: "Uses pacing, caching and fail-closed ceilings to keep public operating costs bounded." },
	],
	content: [
		makeBlock(
			"AEO Audit makes the gap between a browser view and a crawler view visible. Give it a page and it shows the raw readable text, heading outline, declared entities, crawler permissions, and the changes most likely to improve the result.",
		),
		makeBlock(
			"The tool treats uncertainty as a result rather than hiding it. Challenge pages, origin errors, and other unreadable responses are explained without a fabricated score. Training crawlers and live answer-engine agents are assessed separately so an editorial choice is not confused with an accidental block.",
		),
		makeBlock(
			"The public service runs on Cloudflare Workers with sitemap sampling, shared-issue rollups, short-lived report caching, per-address pacing, account-wide ceilings, and a constrained model that summarises only the deterministic findings.",
		),
	],
	gallery: [],
	url: "https://aeo.simplethin.gs",
	repo_url: null,
};

const postColumns = [
	"title",
	"excerpt",
	"date",
	"featured_image",
	"content",
	"tweet_url",
	"links",
	"social_draft",
];
const projectColumns = [
	"title",
	"summary",
	"featured_image",
	"client",
	"year",
	"project_status",
	"stack",
	"business_benefits",
	"technical_highlights",
	"content",
	"gallery",
	"url",
	"repo_url",
];

function fieldValue(data, field) {
	const value = data[field];
	return Array.isArray(value) || (value && typeof value === "object")
		? sqlJson(value)
		: sqlString(value);
}

function upsertEntry({ table, collection, id, slug, revisionId, data, columns }) {
	const insertColumns = [
		"id",
		"slug",
		"status",
		"author_id",
		"created_at",
		"updated_at",
		"published_at",
		"version",
		"live_revision_id",
		"draft_revision_id",
		"locale",
		"translation_group",
		...columns,
	];
	const values = [
		sqlString(id),
		sqlString(slug),
		"'published'",
		sqlString(AUTHOR_ID),
		sqlString(NOW),
		sqlString(NOW),
		sqlString(NOW),
		"1",
		sqlString(revisionId),
		"NULL",
		"'en'",
		sqlString(id),
		...columns.map((field) => fieldValue(data, field)),
	];
	const updates = [
		"status = 'published'",
		`author_id = ${sqlString(AUTHOR_ID)}`,
		`updated_at = ${sqlString(NOW)}`,
		`published_at = ${sqlString(NOW)}`,
		"scheduled_at = NULL",
		`live_revision_id = ${sqlString(revisionId)}`,
		"draft_revision_id = NULL",
		"version = COALESCE(version, 0) + 1",
		...columns.map((field) => `${field} = excluded.${field}`),
	];

	return `
INSERT INTO revisions (id, collection, entry_id, data, author_id, created_at)
VALUES (
\t${sqlString(revisionId)},
\t${sqlString(collection)},
\tCOALESCE(
\t\t(SELECT id FROM ${table} WHERE slug = ${sqlString(slug)} AND locale = 'en'),
\t\t${sqlString(id)}
\t),
\t${sqlJson(data)},
\t${sqlString(AUTHOR_ID)},
\t${sqlString(NOW)}
);

INSERT INTO ${table} (${insertColumns.join(", ")})
VALUES (${values.join(", ")})
ON CONFLICT(slug, locale) DO UPDATE SET
\t${updates.join(",\n\t")};`;
}

const sql = `${upsertEntry({
	table: "ec_posts",
	collection: "posts",
	id: postId,
	slug: metadata.slug,
	revisionId: postRevisionId,
	data: postData,
	columns: postColumns,
})}

INSERT INTO _emdash_content_bylines (
	id, collection_slug, content_id, byline_id, sort_order, role_label, created_at
)
SELECT
	${sqlString(bylineCreditId)},
	'posts',
	id,
	${sqlString(BYLINE_ID)},
	0,
	NULL,
	${sqlString(NOW)}
FROM ec_posts
WHERE slug = ${sqlString(metadata.slug)}
	AND locale = 'en'
	AND NOT EXISTS (
		SELECT 1
		FROM _emdash_content_bylines credits
		WHERE credits.collection_slug = 'posts'
			AND credits.content_id = ec_posts.id
			AND credits.byline_id = ${sqlString(BYLINE_ID)}
	);

${upsertEntry({
	table: "ec_projects",
	collection: "projects",
	id: projectId,
	slug: "aeo-audit",
	revisionId: projectRevisionId,
	data: projectData,
	columns: projectColumns,
})}
`;

if (process.argv.includes("--print") || process.argv.includes("--dry-run")) {
	process.stdout.write(sql);
	process.exit(0);
}

const directory = mkdtempSync(join(tmpdir(), "simplethings-aeo-audit-"));
const sqlPath = join(directory, "publish.sql");
writeFileSync(sqlPath, sql, "utf8");

console.log(`Publishing ${metadata.slug} (${postContent.length} blocks) and aeo-audit.`);

const result = spawnSync(
	"npx",
	["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", sqlPath],
	{ encoding: "utf8", stdio: "inherit" },
);

process.exit(result.status ?? 1);
