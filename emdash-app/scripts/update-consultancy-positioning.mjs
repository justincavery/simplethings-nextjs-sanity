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

const homeSections = [
	{
		type: "hero",
		eyebrow: "Independent technical architect",
		title: "Technical architecture for calmer, faster delivery.",
		summary:
			"I help teams improve platforms, CI/CD, DevOps, performance, replatforming, CMS workflows, and end-to-end processes with practical AI where it genuinely helps.",
		primary_label: "Services",
		primary_url: "/services",
		secondary_label: "Selected work",
		secondary_url: "/projects",
		items:
			"Best fit | Small teams, scale-ups, and larger organisations with messy platforms, brittle delivery paths, unclear architecture, or expensive infrastructure.\nMethod | Trace the failure path, simplify the surface area, document the trade-offs, leave the team stronger.\nBias | Clear technical architecture, useful automation, faster delivery, careful AI adoption, and fewer moving parts.",
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
			"Technical architecture and direction | CTO-style support for platform choices, delivery planning, vendor decisions, and readable technical strategy. | /services/technical-architecture\nCI/CD, DevOps and reliability | CI/CD, observability, deployments, server configuration, automation, and infrastructure made boring enough to trust. | /services/devops-ci-cd\nPerformance and cost optimisation | Performance optimisation, cloud cost control, caching strategy, and faster delivery paths close to users. | /services/performance-cost-optimisation\nReplatforming and modernisation | CMS migrations, platform moves, hosting changes, and modernisation with fewer moving parts. | /services/replatforming-modernisation\nAI process improvement | End-to-end workflow improvement and practical AI integration that supports teams rather than threatening jobs. | /services/ai-process-improvement\nWeb platforms and CMS publishing | Fast sites, practical editing flows, content models, and publishing tools that are pleasant to use. | /services/web-platforms-cms",
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

const aboutContent = [
	block("about1", "h1", "About Simple Things"),
	block(
		"about2",
		"normal",
		"I help teams design, modernise, and ship better platforms: technical architecture, CMS migrations, automation, APIs, DevOps, CI/CD, performance optimisation, replatforming, and practical AI process improvement.",
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
	block(
		"about5",
		"normal",
		"AI work is treated as process improvement and team enablement: useful where it reduces repeated work, improves quality, or helps people make better decisions, but never as a lazy replacement for the people who understand the business.",
	),
];

const servicesContent = [
	block("services1", "h1", "Technical architecture and consultancy services"),
	block(
		"services2",
		"normal",
		"Calm senior engineering and technical architecture for teams improving CI/CD, DevOps, performance, costs, replatforming, CMS workflows, and end-to-end processes with practical AI where it genuinely helps.",
	),
	block("services3", "h2", "Technical architecture and direction"),
	block(
		"services4",
		"normal",
		"Architecture reviews, platform choices, delivery planning, technical due diligence, vendor decisions, and hands-on support where the plan needs someone senior close to the code.",
	),
	block("services5", "normal", "Clearer technical direction", { listItem: "bullet", level: 1 }),
	block("services6", "normal", "Reduced delivery risk", { listItem: "bullet", level: 1 }),
	block("services7", "normal", "Better decisions across product, engineering, and operations", {
		listItem: "bullet",
		level: 1,
	}),
	block("services8", "h2", "CI/CD, DevOps and reliability"),
	block(
		"services9",
		"normal",
		"Infrastructure design, automation, observability, deployment pipelines, server configuration, release confidence, and production systems that need senior judgement without unnecessary drama.",
	),
	block("services10", "normal", "Lower running costs", { listItem: "bullet", level: 1 }),
	block("services11", "normal", "Clearer release paths", { listItem: "bullet", level: 1 }),
	block("services12", "normal", "Operational confidence", { listItem: "bullet", level: 1 }),
	block("services13", "h2", "Performance, cost and replatforming"),
	block(
		"services14",
		"normal",
		"Performance reviews, platform migrations, hosting changes, caching strategy, Cloudflare work, CMS moves, and cost optimisation where the current system is slower or more expensive than it needs to be.",
	),
	block("services15", "normal", "Faster user experiences", { listItem: "bullet", level: 1 }),
	block("services16", "normal", "Cleaner platform moves", { listItem: "bullet", level: 1 }),
	block("services17", "normal", "Less waste in infrastructure and process", {
		listItem: "bullet",
		level: 1,
	}),
	block("services18", "h2", "AI process improvement"),
	block(
		"services19",
		"normal",
		"End-to-end workflow mapping and practical AI integration that supports teams, reduces repeated work, improves quality, and keeps human judgement in the right places.",
	),
	block("services20", "normal", "Workflow improvements people can trust", {
		listItem: "bullet",
		level: 1,
	}),
	block("services21", "normal", "Clear guardrails around data, approval, and ownership", {
		listItem: "bullet",
		level: 1,
	}),
	block("services22", "normal", "Adoption that treats staff as partners, not obstacles", {
		listItem: "bullet",
		level: 1,
	}),
];

function sqlString(value) {
	if (value === null || value === undefined) return "NULL";
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
	return sqlString(JSON.stringify(value));
}

function updatePageSql(slug, updates) {
	const setParts = [`updated_at = ${sqlString(NOW)}`];
	const revisionUpdates = [];

	for (const [key, value] of Object.entries(updates)) {
		setParts.push(`${key} = ${sqlJson(value)}`);
		revisionUpdates.push(`'$.${key}', json(${sqlJson(value)})`);
	}

	return `
UPDATE ec_pages
SET ${setParts.join(",\n\t")}
WHERE slug = ${sqlString(slug)}
	AND locale = 'en'
	AND deleted_at IS NULL;

UPDATE revisions
SET data = json_set(
	data,
	${revisionUpdates.join(",\n\t")}
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

const sql = [
	updatePageSql("home", { sections: homeSections }),
	updatePageSql("about", { content: aboutContent }),
	updatePageSql("services", { content: servicesContent }),
].join("\n");

const dir = mkdtempSync(join(tmpdir(), "simplethings-consultancy-positioning-"));
const file = join(dir, "update.sql");
writeFileSync(file, sql);

const result = spawnSync("npx", ["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file], {
	encoding: "utf8",
	stdio: "inherit",
});

process.exit(result.status ?? 1);
