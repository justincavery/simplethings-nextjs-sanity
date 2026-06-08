import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DB_NAME = "simplethings-cms-prod";
const SLUG = "distributed-performance-testing-platform";
const NOW = new Date().toISOString();

const summary =
	"A distributed performance-testing platform with k6 browser and API presets, regional agents, CI gates, retained reports, and Grafana dashboards for release confidence.";

const stack = [
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
];

const businessBenefits = [
	{ benefit: "Makes performance a release habit" },
	{ benefit: "Compares latency across regional paths" },
	{ benefit: "Preserves evidence for incidents" },
	{ benefit: "Turns ad hoc checks into presets" },
];

const technicalHighlights = [
	{ highlight: "k6 API/browser agents with Web Vitals" },
	{ highlight: "Kamal matrix rollout with tunnels" },
	{ highlight: "InfluxDB and Grafana region dashboards" },
	{ highlight: "CI gate model with retained reports" },
];

const blocks = [
	{ style: "h2", text: "Context" },
	"FPT was built because performance testing had started to look like a set of one-off scripts: useful in the moment, but hard to repeat, compare, or trust during a release. The aim was to turn those checks into a product surface that engineers and operators could run before launch, during incident response, and after infrastructure changes.",
	"The first version was scoped as a fast delivery sprint with clear package boundaries: shared types, core config parsing, k6 script generation, an agent, a controller, a dashboard, a CLI, and a metrics collector. That gave the project a working spine before the harder operational problems appeared.",
	"The later v2 work moved the platform from local orchestration into a regional agent model with browser-capable k6 runs, reusable YAML presets, Cloudflare Tunnel access, InfluxDB metrics, Grafana dashboards, and a lightweight web UI served directly by the agents.",
	{ style: "h2", text: "What was built" },
	"The platform accepts YAML or JSON-style test definitions and turns them into k6 scripts. Presets cover API-only checks, browser flows, hybrid scenarios, weighted request mixes, ramping load, stress profiles, and explicit thresholds. The same shape can be run from the CLI, through the agent API, or from the browser UI.",
	"For API checks, the generator creates request scenarios with status checks, custom error-rate metrics, response-time trends, request counters, weighted selection, round-robin execution, and k6 thresholds. For browser checks, it generates k6/browser scenarios so Web Vitals such as LCP, FCP, TTFB, and CLS can be compared alongside HTTP metrics.",
	"Safety was part of the configuration model rather than left to memory. The schema supports maximum VUs, maximum duration, browser-specific limits, threshold expressions, and baseline tolerance fields. That let quick PR checks and heavier stress runs share the same language without sharing the same risk profile.",
	{ style: "h2", text: "Regional execution model" },
	"The agent fleet was designed around regional evidence, not just raw load. One nearby region acted as the fast baseline for everyday checks, a second nearby region helped distinguish local noise from repeatable problems, and distant regions gave a view of longer network paths and edge-routing behaviour. The public case study should describe those roles without publishing exact agent names, hostnames, tunnel names, or targets.",
	"Every agent runs the same container image and receives its regional identity through environment configuration. The executor adds that region as a k6 tag, so the same test can be grouped in Grafana by region, URL, endpoint, or Web Vital. That is what turns a run from a single pass/fail number into useful diagnosis: one route may be healthy locally while another path shows rising p95 or browser timing drift.",
	"The registry separates browser/API access from peer-to-peer dispatch. Public access goes through Cloudflare Tunnel, while peer dispatch can use a private route with the public host preserved for proxy routing. That solved a real coordination issue: Cloudflare Access is valuable for human-facing routes, but agent-to-agent calls needed a controlled internal path that did not depend on browser login state.",
	{ style: "h2", text: "Deployment model" },
	"The early deployment path was a direct SSH and Docker Compose workflow. It tested server access, prepared the remote directory, installed Docker where needed, copied the monorepo pieces required for builds, wrote environment configuration, rebuilt containers, started the agent, and checked local health. That was enough to prove the model, but it also exposed where manual deployment scripts become brittle.",
	"The first major deployment issue was a build-context mismatch. The script copied files too flat, while docker-compose expected the monorepo path to exist. The fix was to preserve the package structure on the remote host: root package files plus the agent, core, and types packages under a packages directory. A shell validation test was added to assert the expected Dockerfile path, build context, and copied package directories before deploy work continued.",
	"The later deployment path moved to Kamal 2 and GitHub Container Registry. A GitHub Actions workflow deploys regional destinations through a matrix, but keeps rollout serial to reduce blast radius. Each destination can be selected manually or deployed as part of the full fleet. The workflow installs Kamal, prepares SSH access, bootstraps servers, releases stale locks, boots accessories, deploys the agent image, and records a deployment summary.",
	"Kamal owns the repeatable runtime shape: an agent service on the application port, Cloudflare TLS at the edge, forwarded headers, health checks, retained containers, log rotation, persisted artifacts, persisted presets, and accessory services. Cloudflared runs alongside every agent, while the primary metrics node carries InfluxDB and Grafana accessories with provisioned datasources and dashboards.",
	{ style: "h2", text: "Delivery assurance" },
	"The CI gate was designed as a progressive control rather than a single huge test. A pull request can run a quick preset from a fast region, upload HTML reports and JSON summaries, and fail when a threshold or regression condition is breached. Manual dispatch can choose a preset and regions for deeper checks when a change has wider performance risk.",
	"The baseline work captures p50, p95, p99, error rate, request rate, and the test that produced the baseline. Regression comparison treats p95 as a percentage change and error rate as an absolute percentage-point change, with protection for zero-baseline edge cases. This gives teams a way to say not just whether a run passed, but whether a change degraded a known good state.",
	"Reports are retained as evidence. Each run can produce a k6 summary JSON file and an HTML report, and the workflow uploads those artifacts with a fixed retention period so release discussions can refer to a concrete run rather than a lost terminal scrollback.",
	{ style: "h2", text: "Presets and operator UX" },
	"Reusable presets are the heart of making performance testing habitual. The repo includes quick, standard, stress, PR, API, GraphQL, and browser-oriented presets. They encode the target shape, load profile, thresholds, regions, and safety limits so operators can choose intent rather than rebuild a test script every time.",
	"Presets are seeded into the runtime container, then copied into the mounted presets directory at startup. One subtle bug was stale preset drift: once the directory was volume-mounted, new seed presets could be hidden behind old copies. The startup copy behaviour was changed so updated presets overwrite stale versions after deploy, keeping the fleet aligned with source.",
	"The operator UI keeps the workflow close to the agent. It lists presets, shows whether the agent is busy, exposes run buttons, shows multi-region status, links to the live k6 dashboard while a test is running, and provides a test-history page with summaries, Web Vitals, check counts, iteration duration, and report links.",
	{ style: "h2", text: "Observability and dashboards" },
	"k6 streams metrics into InfluxDB with region tags, while the executor also writes summary and report artifacts per test. Grafana is provisioned from code, with dashboards for regional API performance and browser/Web Vitals performance. The panels cover all-region p95, error rate, requests per second, active VUs, p50 and p95 by region, throughput, data transfer, endpoint breakdowns, and Web Vitals by page and region.",
	"The live k6 dashboard is also proxied through the agent, which sounds small until you run tests back to back. The dashboard originally hit port conflicts caused by sockets in TIME_WAIT, producing k6 dashboard failures. The fix was a rotating dashboard port pool and a proxy target that follows the currently running test.",
	"Dashboard proxying also needed path fixes. The k6 dashboard serves assets and internal UI routes that assume root paths, while operators access it through the agent route. The implementation rewrites the dashboard prefix, fixes redirect locations, and proxies internal UI asset paths only while a test is running.",
	{ style: "h2", text: "Setup issues and fixes" },
	"Agent-to-agent calls initially ran through the public tunnel path, which conflicted with Cloudflare Access and made multi-region dispatch unreliable. The solution was to give agents a private peer route while preserving the public host header for the Kamal proxy. Node fetch was not suitable because it would not preserve the Host header in the required way, so the coordinator uses http.request for those calls and applies longer timeouts for cross-region dispatch.",
	"Browser testing exposed container-level constraints. k6 browser runs need Chromium-compatible runtime flags, and the environment variable format mattered: comma-separated values without command-line prefixes. The agent image uses the k6 browser base, adds Node for the HTTP server, sets headless mode, disables GPU and shared-memory assumptions that do not fit small containers, and caps browser stress presets to safe per-server limits.",
	"YAML parsing also created small but real failures. Threshold strings often contain comparison operators and comments, so inline comments had to be stripped without corrupting quoted threshold values. Fixing that made preset editing less fragile and helped non-specialists adjust thresholds safely.",
	"Other fixes were operational polish: correcting region labels in presets, adding missing API headers to product-specific checks, increasing coordinator timeouts, surfacing result links on completion, and making sure a busy agent rejects new work rather than silently running overlapping tests.",
	{ style: "h2", text: "Public-safe boundary" },
	"The useful public story is the delivery pattern: regional agents, Kamal rollouts, tunnel-backed access, reusable presets, CI gates, retained reports, InfluxDB metrics, Grafana dashboards, and practical fixes discovered during rollout. Exact agent endpoints, region identifiers, tunnel names, direct peer routes, target URLs, tokens, account IDs, and credentials should stay private.",
];

function portableText(items) {
	return items.map((item, index) => {
		const value = typeof item === "string" ? { style: "normal", text: item } : item;
		return {
			_type: "block",
			_key: `perf${index + 1}`,
			style: value.style || "normal",
			markDefs: [],
			children: [
				{
					_type: "span",
					_key: `perf${index + 1}s`,
					text: value.text,
					marks: [],
				},
			],
		};
	});
}

function sqlString(value) {
	if (value === null || value === undefined) return "NULL";
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
	return sqlString(JSON.stringify(value));
}

const content = portableText(blocks);

const sql = `
UPDATE ec_projects
SET summary = ${sqlString(summary)},
	stack = ${sqlJson(stack)},
	business_benefits = ${sqlJson(businessBenefits)},
	technical_highlights = ${sqlJson(technicalHighlights)},
	content = ${sqlJson(content)},
	updated_at = ${sqlString(NOW)}
WHERE slug = ${sqlString(SLUG)}
	AND locale = 'en'
	AND deleted_at IS NULL;

UPDATE revisions
SET data = json_set(
	data,
	'$.summary', ${sqlString(summary)},
	'$.stack', json(${sqlJson(stack)}),
	'$.business_benefits', json(${sqlJson(businessBenefits)}),
	'$.technical_highlights', json(${sqlJson(technicalHighlights)}),
	'$.content', json(${sqlJson(content)})
)
WHERE collection = 'projects'
	AND entry_id = (
		SELECT id
		FROM ec_projects
		WHERE slug = ${sqlString(SLUG)}
			AND locale = 'en'
			AND deleted_at IS NULL
	)
	AND id IN (
		SELECT draft_revision_id
		FROM ec_projects
		WHERE slug = ${sqlString(SLUG)}
			AND locale = 'en'
			AND deleted_at IS NULL
		UNION
		SELECT live_revision_id
		FROM ec_projects
		WHERE slug = ${sqlString(SLUG)}
			AND locale = 'en'
			AND deleted_at IS NULL
	);
`;

const dir = mkdtempSync(join(tmpdir(), "simplethings-performance-case-study-"));
const file = join(dir, "update.sql");
writeFileSync(file, sql);

const result = spawnSync("npx", ["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file], {
	encoding: "utf8",
	stdio: "inherit",
});

process.exit(result.status ?? 1);
