import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DB_NAME = "simplethings-cms-prod";
const NOW = new Date().toISOString();

function block(key, style, text, extra = {}) {
	return {
		_type: "block",
		_key: key,
		style,
		...extra,
		markDefs: [],
		children: [
			{
				_type: "span",
				_key: `${key}s`,
				text,
				marks: [],
			},
		],
	};
}

const aboutContent = [
	block("about1", "h1", "About Simple Things"),
	block(
		"about2",
		"normal",
		"I help teams design, modernise, and ship web platforms: CMS migrations, automation, APIs, indexing, DevOps, performance optimisation, and edge-ready infrastructure.",
	),
	block(
		"about3",
		"normal",
		"Simple Things is the independent technology practice of Justin Avery. The work sits somewhere between senior engineer, technical architect, head of digital, and fractional CTO: shaping the technical direction, then getting close enough to the code and infrastructure to make it real.",
	),
	block(
		"about4",
		"normal",
		"The work is deliberately practical: clear architecture, useful automation, resilient APIs, clean CMS workflows, observable deployments, and documentation that helps the team keep moving after handover.",
	),
];

const servicesContent = [
	block("services1", "h1", "Services"),
	block(
		"services2",
		"normal",
		"Calm senior engineering for teams building faster web platforms, cleaner CMS workflows, practical automation, resilient APIs, search/indexing systems, DevOps foundations, and performance-focused infrastructure.",
	),
	block("services3", "h2", "DevOps, servers and reliability"),
	block(
		"services4",
		"normal",
		"Infrastructure design, automation, cost control, observability, deployment pipelines, server configuration, and production systems that need senior judgement without unnecessary drama.",
	),
	block("services5", "normal", "Lower running costs", { listItem: "bullet", level: 1 }),
	block("services6", "normal", "Clearer release paths", { listItem: "bullet", level: 1 }),
	block("services7", "normal", "Operational confidence", { listItem: "bullet", level: 1 }),
	block("services8", "h2", "APIs, indexing and data platforms"),
	block(
		"services9",
		"normal",
		"API design, integration layers, search and indexing reliability, protocol data pipelines, WebSocket flows, and the small pieces of automation that make complex data products easier to operate.",
	),
	block("services10", "normal", "Stable indexing", { listItem: "bullet", level: 1 }),
	block("services11", "normal", "Cleaner data access", { listItem: "bullet", level: 1 }),
	block("services12", "normal", "Less operator toil", { listItem: "bullet", level: 1 }),
	block("services13", "h2", "Web platforms and product engineering"),
	block(
		"services14",
		"normal",
		"Fast sites, internal tools, API integrations, CMS migrations, content models, and web products that keep their operational shape after launch.",
	),
	block("services15", "normal", "Faster delivery", { listItem: "bullet", level: 1 }),
	block("services16", "normal", "Better maintainability", { listItem: "bullet", level: 1 }),
	block("services17", "normal", "Useful documentation", { listItem: "bullet", level: 1 }),
	block("services18", "h2", "Technical strategy for small teams"),
	block(
		"services19",
		"normal",
		"CTO-style technical direction without hiring a full leadership team: architecture reviews, platform choices, vendor decisions, delivery planning, and hands-on implementation where it matters.",
	),
	block("services20", "normal", "Sharper priorities", { listItem: "bullet", level: 1 }),
	block("services21", "normal", "Reduced technical risk", { listItem: "bullet", level: 1 }),
	block("services22", "normal", "More confident decisions", { listItem: "bullet", level: 1 }),
];

function sqlString(value) {
	if (value === null || value === undefined) return "NULL";
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
	return sqlString(JSON.stringify(value));
}

function updatePageSql(slug, content) {
	return `
UPDATE ec_pages
SET content = ${sqlJson(content)},
	updated_at = ${sqlString(NOW)}
WHERE slug = ${sqlString(slug)}
	AND locale = 'en'
	AND deleted_at IS NULL;

UPDATE revisions
SET data = json_set(
	data,
	'$.content', json(${sqlJson(content)})
)
WHERE collection = 'pages'
	AND entry_id = (
		SELECT id
		FROM ec_pages
		WHERE slug = ${sqlString(slug)}
			AND locale = 'en'
			AND deleted_at IS NULL
	)
	AND id IN (
		SELECT draft_revision_id
		FROM ec_pages
		WHERE slug = ${sqlString(slug)}
			AND locale = 'en'
			AND deleted_at IS NULL
		UNION
		SELECT live_revision_id
		FROM ec_pages
		WHERE slug = ${sqlString(slug)}
			AND locale = 'en'
			AND deleted_at IS NULL
	);
`;
}

const sql = `
${updatePageSql("about", aboutContent)}
${updatePageSql("services", servicesContent)}
`;

const dir = mkdtempSync(join(tmpdir(), "simplethings-positioning-copy-"));
const file = join(dir, "update.sql");
writeFileSync(file, sql);

const result = spawnSync("npx", ["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file], {
	encoding: "utf8",
	stdio: "inherit",
});

process.exit(result.status ?? 1);
