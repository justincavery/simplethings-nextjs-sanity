import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DB_NAME = "simplethings-cms-prod";
const NOW = new Date().toISOString();

const repeaterFields = {
	stack: {
		label: "Capabilities",
		validation: {
			subFields: [
				{ slug: "category", label: "Category", type: "string", required: true },
				{
					slug: "capabilities",
					label: "Capabilities (comma separated)",
					type: "text",
					required: true,
				},
			],
			minItems: 1,
		},
	},
	business_benefits: {
		label: "Business benefits",
		validation: {
			subFields: [{ slug: "benefit", label: "Benefit", type: "string", required: true }],
			minItems: 1,
			maxItems: 4,
		},
	},
	technical_highlights: {
		label: "Technical highlights",
		validation: {
			subFields: [{ slug: "highlight", label: "Highlight", type: "string", required: true }],
			minItems: 1,
			maxItems: 4,
		},
	},
	gallery: {
		label: "Gallery",
		validation: {
			subFields: [
				{ slug: "title", label: "Image title", type: "string" },
				{ slug: "image_url", label: "Image URL", type: "url" },
				{ slug: "caption", label: "Caption", type: "text" },
			],
		},
	},
};

const textFields = {
	repo_url: {
		label: "Repository URL",
		validation: {
			helpText:
				"Paste a full GitHub URL, a Markdown link, or GitHub shorthand such as org/repo.",
		},
	},
};

const projects = {
	"diabolical-machines": {
		stack: [
			{ category: "Migration", capabilities: "Cloudflare, static assets, NFT metadata" },
			{ category: "Preservation", capabilities: "archive recovery, cache-first hosting" },
		],
		business_benefits: [
			"Kept the artwork project accessible",
			"Moved hosting to a small footprint",
			"Created a maintainable preservation path",
		],
		technical_highlights: [
			"Recovered data from an abandoned build",
			"Separated artwork delivery from heavy infrastructure",
			"Designed cache-friendly static hosting",
		],
	},
	"distributed-performance-testing-platform": {
		stack: [
			{
				category: "Testing",
				capabilities: "k6, k6/browser, Web Vitals, thresholds, HTML reports",
			},
			{
				category: "Platform",
				capabilities: "TypeScript monorepo, Express agents, CLI v2, YAML presets",
			},
			{
				category: "Deployment",
				capabilities: "Kamal 2, Docker, GHCR, GitHub Actions, Cloudflare Tunnel",
			},
			{
				category: "Observability",
				capabilities: "InfluxDB, Grafana, region tags, JSON summaries",
			},
			{
				category: "Reliability",
				capabilities: "health checks, direct peer dispatch, rotating dashboard ports",
			},
		],
		business_benefits: [
			"Makes performance a release habit",
			"Compares latency across regional paths",
			"Preserves evidence for incidents",
			"Turns ad hoc checks into presets",
		],
		technical_highlights: [
			"k6 API/browser agents with Web Vitals",
			"Kamal matrix rollout with tunnels",
			"InfluxDB and Grafana region dashboards",
			"CI gate model with retained reports",
		],
	},
	"dynamic-nft-metadata-token-art-api": {
		stack: [
			{ category: "API", capabilities: "Node.js, TypeScript, Express, GraphQL" },
			{ category: "Media", capabilities: "SVG, PNG, Sharp, IPFS metadata" },
			{ category: "Deployment", capabilities: "Docker, GHCR, Kamal, GitHub Actions" },
		],
		business_benefits: [
			"Improves marketplace token presentation",
			"Keeps metadata consistent as contracts evolve",
			"Supports safer display of sensitive imagery",
		],
		technical_highlights: [
			"Stable metadata routes for product surfaces",
			"Dynamic branded token-card generation",
			"Environment-aware container deployments",
		],
	},
	"edge-proxy-configuration-manager": {
		stack: [
			{ category: "Proxy", capabilities: "HAProxy, TLS, health checks" },
			{ category: "Tooling", capabilities: "Go, Makefile, SSH, SFTP" },
			{ category: "Operations", capabilities: "GitHub Actions, remote validation, controlled reloads" },
		],
		business_benefits: [
			"Reduces risk in traffic-routing changes",
			"Improves uptime with validated rollouts",
			"Creates an audit trail for edge changes",
		],
		technical_highlights: [
			"Generates per-node HAProxy configs",
			"Diffs and validates remote candidates",
			"Promotes only after HAProxy accepts config",
		],
	},
	"flaunch-admin-revenue-operations-dashboard": {
		stack: [
			{ category: "App", capabilities: "Next.js, React, TypeScript, Auth0" },
			{ category: "Reporting", capabilities: "BigQuery, GraphQL, Postgres, Recharts" },
			{ category: "Operations", capabilities: "GitHub Actions, scheduled jobs, backfills" },
		],
		business_benefits: [
			"Centralises moderation and operations",
			"Improves confidence in revenue reporting",
			"Speeds leadership decisions with clearer metrics",
		],
		technical_highlights: [
			"Protected admin workflows",
			"Scheduled collectors and recovery backfills",
			"Warehouse-backed product-health reporting",
		],
	},
	"flaunch-edge-token-image-worker": {
		stack: [
			{ category: "Cloudflare", capabilities: "Workers, KV, Images, edge resizing" },
			{ category: "Data", capabilities: "GraphQL, IPFS, metadata cache" },
			{ category: "Delivery", capabilities: "Wrangler, staging, production deploys" },
		],
		business_benefits: [
			"Speeds token images in feeds and embeds",
			"Keeps public image URLs stable",
			"Reduces backend load through edge caching",
		],
		technical_highlights: [
			"Edge resolution from token to current image",
			"KV-backed cache with controlled invalidation",
			"Fallback handling for missing or flagged media",
		],
	},
	"flaunch-fee-simulator": {
		stack: [
			{ category: "Cloudflare", capabilities: "Workers, D1, KV, scheduled Workers" },
			{ category: "App", capabilities: "React, Vite, TypeScript, Drizzle" },
			{ category: "Sharing", capabilities: "dynamic metadata, Open Graph images, Playwright" },
		],
		business_benefits: [
			"Makes protocol economics understandable",
			"Creates shareable campaign loops",
			"Keeps campaign traffic fast at the edge",
		],
		technical_highlights: [
			"Worker API and React product surface",
			"Scheduled sync for token context",
			"Dynamic social previews for result pages",
		],
	},
	"flaunch-media-moderation-api": {
		stack: [
			{ category: "API", capabilities: "Python, FastAPI, Pydantic, aiohttp" },
			{ category: "Media", capabilities: "Pillow, static images, GIF frame analysis" },
			{ category: "Deployment", capabilities: "Docker, GHCR, Kamal, GitHub Actions" },
		],
		business_benefits: [
			"Protects public surfaces from unsafe media",
			"Creates clear pass, flag, and fail outcomes",
			"Supports launch-scale review workflows",
		],
		technical_highlights: [
			"Authenticated moderation endpoint",
			"Static and animated media handling",
			"Healthchecked container deployment",
		],
	},
	"flaunch-web2-token-launch-api": {
		stack: [
			{ category: "API", capabilities: "Node.js, TypeScript, Express, Viem" },
			{ category: "Jobs", capabilities: "Redis, BullMQ, IPFS, Cloudflare Stream" },
			{ category: "Operations", capabilities: "Docker, GHCR, Kamal, PM2, Caddy, OpenTelemetry" },
		],
		business_benefits: [
			"Makes launches easier from normal web apps",
			"Reduces manual launch support",
			"Adds visibility around async launch jobs",
		],
		technical_highlights: [
			"Media upload and moderation before launch",
			"Queue-based blockchain work",
			"Role-based deploys for API and workers",
		],
	},
	"flaunchy-openclaw-launch-assistant": {
		stack: [
			{ category: "Agent", capabilities: "OpenClaw, Node.js, TypeScript, launch automation" },
			{ category: "Channels", capabilities: "Twitter/X API, XMTP, ENS" },
			{ category: "Operations", capabilities: "systemd, journal logs, heartbeat routines, env files" },
		],
		business_benefits: [
			"Turns social requests into launch journeys",
			"Expands distribution through an always-on channel",
			"Reduces support with sensible defaults",
		],
		technical_highlights: [
			"Shared assistant behaviour across channels",
			"Queueing and duplicate protection",
			"Recoverable transport services",
		],
	},
	"graphql-data-proxy-web3-products": {
		stack: [
			{ category: "Proxy", capabilities: "Varnish, NGINX, GraphQL, HTTP caching" },
			{ category: "Deployment", capabilities: "Docker, GHCR, Kamal, GitHub Actions" },
			{ category: "Reliability", capabilities: "health checks, response normalisation, provider isolation" },
		],
		business_benefits: [
			"Improves speed for repeated reads",
			"Reduces dependency on one data provider",
			"Creates stable product-facing routes",
		],
		technical_highlights: [
			"Clean routes over upstream GraphQL sources",
			"Request-aware cache behaviour",
			"Containerised proxy rollout",
		],
	},
	"infrastructure-management-operational-map": {
		stack: [
			{ category: "IaC", capabilities: "OpenTofu, Cloudflare, R2 remote state, GitHub Actions" },
			{ category: "Metrics", capabilities: "Prometheus, Alertmanager, Blackbox Exporter, tuned scrape jobs" },
			{ category: "Reporting", capabilities: "Grafana dashboards, Explore links, derived fields" },
			{ category: "Logs and traces", capabilities: "Grafana Alloy, Loki, Tempo, OpenTelemetry, R2 retention" },
			{ category: "Access", capabilities: "Tailscale, UFW allowlists, sideband metrics plane" },
		],
		business_benefits: [
			"Turns operations into one readable view",
			"Cuts diagnosis time across APIs and sites",
			"Keeps monitoring off public traffic paths",
			"Escalates only customer-facing risk",
		],
		technical_highlights: [
			"Prometheus jobs with tuned cadences",
			"Grafana joins metrics, logs, and traces",
			"Content-aware RPC and GraphQL probes",
			"R2-backed Loki and Tempo retention",
		],
	},
	"instameme-mobile-token-creation": {
		stack: [
			{ category: "App", capabilities: "Next.js, React, TypeScript, Tailwind, PWA" },
			{ category: "Wallet", capabilities: "Privy, wagmi, RainbowKit" },
			{ category: "Data", capabilities: "React Query, InstantDB, social interactions" },
		],
		business_benefits: [
			"Makes token creation feel mobile-native",
			"Creates a social surface for new launches",
			"Softens wallet onboarding for consumers",
		],
		technical_highlights: [
			"Feed, create, profile, and token pages",
			"Multi-step capture and launch flow",
			"PWA caching with auth-sensitive exclusions",
		],
	},
	"meebmarket-cloudflare-nft-marketplace": {
		stack: [
			{ category: "Cloudflare", capabilities: "Workers, D1, KV, R2, Images, Durable Objects, Cron" },
			{ category: "App", capabilities: "Hono, Vite, React, TypeScript, Wrangler" },
			{ category: "Web3", capabilities: "NFTX, 0x, OpenSea, wagmi, viem, RainbowKit" },
			{ category: "Growth", capabilities: "SEO, OG images, alerts, analytics, Turnstile" },
		],
		business_benefits: [
			"Dedicated marketplace beyond generic NFT listings",
			"Search, buy, swap, watch, and share in one flow",
			"Low-ops Cloudflare stack with measurable growth loops",
		],
		technical_highlights: [
			"Worker-first API and SPA with D1 catalogue",
			"OpenSea/NFTX indexer plus atomic buy and swap flows",
			"Crawlable pages, JSON-LD offers, OG cards, and live activity",
		],
	},
	"reflaunch-backend-api-realtime-platform": {
		stack: [
			{ category: "API", capabilities: "Fastify 5, TypeScript, JSON schemas, Swagger/OpenAPI, V2 plugin" },
			{ category: "Indexing", capabilities: "Envio HyperIndex, Hasura GraphQL, Redis Streams, consumer groups" },
			{ category: "Data", capabilities: "Redis sorted sets, hashes, sets, lists, Postgres, Prisma, Neon" },
			{ category: "Real-time", capabilities: "WebSockets, Redis Pub/Sub, Postgres LISTEN/NOTIFY, backfill buffers" },
			{ category: "Delivery", capabilities: "GitHub Actions, GHCR, Kamal 2, Docker, Prisma migrations, previews" },
			{ category: "Observability", capabilities: "Prometheus, OpenTelemetry, Pino logs, Caddy metrics proxy" },
		],
		business_benefits: [
			"Makes indexed chain data feel live",
			"Keeps discovery feeds fast under load",
			"Gives builders governed API access",
			"Makes previews and releases repeatable",
		],
		technical_highlights: [
			"Envio streams hydrate Redis hot indexes",
			"WebSocket broadcasts before cache writes",
			"V2 auth, rate limits, and usage metering",
			"Neon previews with Kamal guardrails",
		],
	},
};

function toBenefitRows(values) {
	return values.map((benefit) => ({ benefit }));
}

function toHighlightRows(values) {
	return values.map((highlight) => ({ highlight }));
}

function sqlString(value) {
	if (value === null || value === undefined) return "NULL";
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
	return sqlString(JSON.stringify(value));
}

function jsonExpr(value) {
	return `json(${sqlJson(value)})`;
}

const statements = [];

for (const [slug, config] of Object.entries(repeaterFields)) {
	statements.push(`
UPDATE _emdash_fields
SET label = ${sqlString(config.label)},
	type = 'repeater',
	column_type = 'JSON',
	validation = ${sqlJson(config.validation)},
	widget = NULL,
	options = NULL
WHERE slug = ${sqlString(slug)}
	AND collection_id = (SELECT id FROM _emdash_collections WHERE slug = 'projects');`);
}

for (const [slug, config] of Object.entries(textFields)) {
	statements.push(`
UPDATE _emdash_fields
SET label = ${sqlString(config.label)},
	type = 'text',
	column_type = 'TEXT',
	validation = ${sqlJson(config.validation)},
	widget = 'text',
	options = NULL
WHERE slug = ${sqlString(slug)}
	AND collection_id = (SELECT id FROM _emdash_collections WHERE slug = 'projects');`);
}

for (const [slug, project] of Object.entries(projects)) {
	const stack = project.stack;
	const businessBenefits = toBenefitRows(project.business_benefits);
	const technicalHighlights = toHighlightRows(project.technical_highlights);

	statements.push(`
UPDATE ec_projects
SET stack = ${sqlJson(stack)},
	business_benefits = ${sqlJson(businessBenefits)},
	technical_highlights = ${sqlJson(technicalHighlights)},
	gallery = COALESCE(gallery, '[]'),
	updated_at = ${sqlString(NOW)}
WHERE slug = ${sqlString(slug)}
	AND locale = 'en'
	AND deleted_at IS NULL;`);

	statements.push(`
UPDATE revisions
SET data = json_set(
	COALESCE(data, '{}'),
	'$.stack', ${jsonExpr(stack)},
	'$.business_benefits', ${jsonExpr(businessBenefits)},
	'$.technical_highlights', ${jsonExpr(technicalHighlights)},
	'$.gallery', COALESCE(json_extract(data, '$.gallery'), json('[]'))
)
WHERE id = (
	SELECT COALESCE(draft_revision_id, live_revision_id)
	FROM ec_projects
	WHERE slug = ${sqlString(slug)}
		AND locale = 'en'
		AND deleted_at IS NULL
);`);
}

const sql = `${statements.join("\n")}\n`;

if (process.argv.includes("--print")) {
	process.stdout.write(sql);
	process.exit(0);
}

const dir = mkdtempSync(join(tmpdir(), "simplethings-project-editor-fields-"));
const file = join(dir, "project-editor-fields.sql");
writeFileSync(file, sql, "utf8");

const result = spawnSync(
	"npx",
	["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file],
	{ stdio: "inherit" },
);

process.exit(result.status ?? 1);
