import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ulid } from "ulidx";

const DB_NAME = "simplethings-cms-prod";
const remote = !process.argv.includes("--local");
const dryRun = process.argv.includes("--print");

const sectionsValidation = {
	helpText:
		"Use this on the Home page. Add rows in display order. For item lists, add one line per item in the format: Title | Description | URL. Code snippets and demos belong inside the Content editor on posts and projects.",
	subFields: [
		{
			slug: "type",
			label: "Section type",
			type: "select",
			required: true,
			options: ["hero", "steps", "services", "projects", "posts", "rich_text", "cta"],
		},
		{ slug: "eyebrow", label: "Eyebrow", type: "string" },
		{ slug: "title", label: "Title", type: "string" },
		{ slug: "summary", label: "Summary", type: "text" },
		{ slug: "body", label: "Body", type: "text" },
		{ slug: "primary_label", label: "Primary link label", type: "string" },
		{ slug: "primary_url", label: "Primary link URL", type: "url" },
		{ slug: "secondary_label", label: "Secondary link label", type: "string" },
		{ slug: "secondary_url", label: "Secondary link URL", type: "url" },
		{ slug: "items", label: "Items", type: "text" },
		{
			slug: "source",
			label: "Content source",
			type: "select",
			options: ["manual", "projects", "posts"],
		},
		{ slug: "limit", label: "Item limit", type: "integer" },
		{
			slug: "variant",
			label: "Visual variant",
			type: "select",
			options: ["default", "field", "compact"],
		},
	],
};

const homeContent = [
	{
		_type: "block",
		_key: "home-intro",
		style: "normal",
		markDefs: [],
		children: [
			{
				_type: "span",
				_key: "home-intro-span",
				text: "Homepage sections are managed through the sections repeater below.",
				marks: [],
			},
		],
	},
];

const homeSections = [
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
		items:
			"Best fit | Small teams with messy platforms, migrations, brittle infra, or unclear technical choices.\nMethod | Trace the failure path, simplify the surface area, document the trade-offs, leave the team stronger.\nBias | Fast platforms, boring automation, readable docs, fewer moving parts.",
		variant: "field",
	},
	{
		type: "steps",
		eyebrow: "Simple steps",
		title: "A calm way through technical work",
		items:
			"Understand | We agree what matters, what is stuck, and what a useful outcome looks like.\nSimplify | We reduce the moving parts, fix the riskiest path first, and keep decisions visible.\nHand over | You get a working system, clear notes, and a calmer way to run it next time.",
	},
	{
		type: "services",
		title: "What I help with",
		primary_label: "View services",
		primary_url: "/services",
		items:
			"Architecture and technical direction | CTO-style support for platform choices, delivery planning, vendor decisions, and readable technical strategy.\nAutomation and modernisation | CMS migrations, publishing workflows, practical automation, and platform moves with fewer moving parts.\nAPIs, indexing and data platforms | Resilient APIs, search and indexing systems, blockchain data flows, and product-ready integration layers.\nDevOps, servers and reliability | CI/CD, observability, deployments, server configuration, automation, and infrastructure made boring enough to trust.\nWeb platforms and CMS publishing | Fast sites, practical editing flows, content models, and publishing tools that are pleasant to use.\nPerformance and edge-ready systems | Performance optimisation, caching strategy, modern hosting, and fast delivery paths close to users.",
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

const homeData = {
	title: "Home",
	content: homeContent,
	sections: homeSections,
};

function sqlString(value) {
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
	return sqlString(JSON.stringify(value));
}

function d1Args(extra) {
	return ["wrangler", "d1", "execute", DB_NAME, remote ? "--remote" : "--local", ...extra];
}

function runD1(extra, options = {}) {
	const result = spawnSync("npx", d1Args(extra), {
		encoding: "utf8",
		stdio: options.stdio ?? "pipe",
	});
	if ((result.status ?? 1) !== 0) {
		if (result.stdout) process.stderr.write(result.stdout);
		if (result.stderr) process.stderr.write(result.stderr);
		process.exit(result.status ?? 1);
	}
	return result.stdout;
}

function queryJson(command) {
	const output = runD1(["--json", "--command", command]);
	return JSON.parse(output);
}

const pageColumns = queryJson("PRAGMA table_info(ec_pages);")[0]?.results ?? [];
const hasSectionsColumn = pageColumns.some((column) => column.name === "sections");

const homeRows =
	queryJson(
		hasSectionsColumn
			? "SELECT id, sections FROM ec_pages WHERE slug = 'home' AND deleted_at IS NULL LIMIT 1;"
			: "SELECT id, NULL AS sections FROM ec_pages WHERE slug = 'home' AND deleted_at IS NULL LIMIT 1;",
	)[0]
		?.results ?? [];
const existingHome = homeRows[0];

const now = new Date().toISOString();
const statements = [];

if (!hasSectionsColumn) {
	statements.push("ALTER TABLE ec_pages ADD COLUMN sections JSON;");
}

statements.push(`
INSERT INTO _emdash_fields (
	id,
	collection_id,
	slug,
	label,
	type,
	column_type,
	required,
	"unique",
	default_value,
	validation,
	widget,
	options,
	sort_order,
	searchable,
	translatable
)
SELECT
	'field-pages-sections',
	id,
	'sections',
	'Homepage sections',
	'repeater',
	'JSON',
	0,
	0,
	NULL,
	${sqlJson(sectionsValidation)},
	NULL,
	NULL,
	2,
	0,
	1
FROM _emdash_collections
WHERE slug = 'pages'
	AND NOT EXISTS (
		SELECT 1
		FROM _emdash_fields
		WHERE collection_id = _emdash_collections.id
			AND slug = 'sections'
	);

UPDATE _emdash_fields
SET
	label = 'Homepage sections',
	type = 'repeater',
	column_type = 'JSON',
	validation = ${sqlJson(sectionsValidation)},
	sort_order = 2,
	searchable = 0,
	translatable = 1
WHERE slug = 'sections'
	AND collection_id = (SELECT id FROM _emdash_collections WHERE slug = 'pages');
`);

if (!existingHome) {
	const pageId = ulid();
	const revisionId = ulid();
	statements.push(`
INSERT INTO revisions (id, collection, entry_id, data, author_id, created_at)
VALUES (
	${sqlString(revisionId)},
	'pages',
	${sqlString(pageId)},
	${sqlJson(homeData)},
	NULL,
	${sqlString(now)}
);

INSERT INTO ec_pages (
	id,
	slug,
	status,
	created_at,
	updated_at,
	published_at,
	version,
	live_revision_id,
	draft_revision_id,
	locale,
	translation_group,
	title,
	content,
	sections
)
VALUES (
	${sqlString(pageId)},
	'home',
	'published',
	${sqlString(now)},
	${sqlString(now)},
	${sqlString(now)},
	1,
	${sqlString(revisionId)},
	NULL,
	'en',
	${sqlString(pageId)},
	'Home',
	${sqlJson(homeContent)},
	${sqlJson(homeSections)}
);
`);
} else if (!existingHome.sections || existingHome.sections === "[]" || existingHome.sections === "") {
	statements.push(`
UPDATE ec_pages
SET
	sections = ${sqlJson(homeSections)},
	updated_at = ${sqlString(now)}
WHERE id = ${sqlString(existingHome.id)};
`);
}

const sql = statements.join("\n");

if (dryRun) {
	console.log(sql);
	process.exit(0);
}

const dir = mkdtempSync(join(tmpdir(), "simplethings-homepage-sections-"));
const file = join(dir, "update.sql");
writeFileSync(file, sql);

runD1(["--file", file], { stdio: "inherit" });
