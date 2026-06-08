import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DB_NAME = "simplethings-cms-prod";
const SLUG = "infrastructure-management-operational-map";
const NOW = new Date().toISOString();

const title = "FLAI infrastructure observability and reporting platform";
const summary =
	"A source-controlled observability and reporting platform for a multi-chain web estate, using Prometheus, Grafana, Loki, Tempo, Alloy, synthetic checks, and reviewed infrastructure-as-code.";

const stack = [
	{
		category: "IaC",
		capabilities: "OpenTofu, Cloudflare, R2 remote state, GitHub Actions",
	},
	{
		category: "Metrics",
		capabilities: "Prometheus, Alertmanager, Blackbox Exporter, tuned scrape jobs",
	},
	{
		category: "Reporting",
		capabilities: "Grafana dashboards, Explore links, derived fields",
	},
	{
		category: "Logs and traces",
		capabilities: "Grafana Alloy, Loki, Tempo, OpenTelemetry, R2 retention",
	},
	{
		category: "Access",
		capabilities: "Tailscale, UFW allowlists, sideband metrics plane",
	},
];

const businessBenefits = [
	{ benefit: "Turns operations into one readable view" },
	{ benefit: "Cuts diagnosis time across APIs and sites" },
	{ benefit: "Keeps monitoring off public traffic paths" },
	{ benefit: "Escalates only customer-facing risk" },
];

const technicalHighlights = [
	{ highlight: "Prometheus jobs with tuned cadences" },
	{ highlight: "Grafana joins metrics, logs, and traces" },
	{ highlight: "Content-aware RPC and GraphQL probes" },
	{ highlight: "R2-backed Loki and Tempo retention" },
];

const blocks = [
	{ style: "h2", text: "Context" },
	"Simple Things helped turn FLAI infrastructure reporting from a set of separate consoles and host-level checks into one operational view. The work spans source-controlled infrastructure, Prometheus scrape design, Grafana dashboards, logs, traces, synthetic checks, and alert routing.",
	"The important product outcome is calm operational judgement. Operators can see whether public sites are reachable, API fleets are healthy, RPC providers are returning real chain data, GraphQL indexes are fresh, Redis is available, routes are slowing down, or one region is behaving differently from the rest.",
	"The work is intentionally written up as a public-safe case study. It should show the shape and judgement of the platform without publishing exact hostnames, IP addresses, tunnel names, bucket names, webhook URLs, bearer tokens, provider keys, or internal route maps.",
	{ style: "h2", text: "Operating model" },
	"The project has two connected halves. The first is governance: OpenTofu with remote state, GitHub Actions plan and apply workflows, pull request review, saved-plan applies, and careful import work so infrastructure changes are reviewed instead of made only through dashboards.",
	"The second half is the reporting plane. Prometheus, Grafana, Loki, Tempo, Alloy, Alertmanager, and synthetic checks sit beside the production services as a sideband observability system. The goal is not to add another dashboard. The goal is one place where an operator can answer whether the product is healthy, where it is slow, and what evidence explains the symptom.",
	"This is especially useful for a multi-chain product estate. A user-facing issue can come from the application, proxy path, index freshness, RPC response quality, Redis availability, host capacity, queue behaviour, or public website reachability. The reporting platform is shaped so those layers can be compared quickly instead of investigated one console at a time.",
	{ style: "h2", text: "Prometheus scrape design" },
	"Prometheus is treated as a dedicated control point rather than an afterthought inside each service. The configuration groups jobs by job purpose: application metrics, Kamal or proxy metrics, node exporters, Redis checks, RPC checks, public website probes, GraphQL freshness checks, and SSL expiry checks.",
	"Scrape cadence is tuned by signal. Fast-moving service and external-response probes run more frequently, RPC node checks run on a short cadence because chain access is product-critical, standard app and host exporters run at a normal operational interval, public website blackbox probes run slightly slower, and database or slower dependency checks are kept less noisy.",
	"The health checks are intentionally content-aware. RPC checks perform real JSON-RPC calls rather than only testing TCP reachability. GraphQL checks validate response bodies and index freshness instead of only accepting a 200 response. That matters because the user-facing failure mode is often stale data or a bad upstream response, not a dead server.",
	"Prometheus configuration is managed as an artifact. Changes can be reviewed, pushed to the observability host, and reloaded in place. That keeps the monitoring plane adjustable without turning the server into a hand-edited source of truth.",
	{ style: "h2", text: "Visual reporting" },
	"Grafana is the operator surface. The dashboards are arranged around glance rows first: public origins, proxy targets, app targets, Redis, request rate, 4xx percentage, 5xx percentage, p95 latency, and host capacity. That lets someone decide quickly whether they are looking at a site problem, an API problem, a dependency problem, or a capacity problem.",
	"Deeper rows turn that glance into diagnosis. Panels break traffic down by route, status, instance, and region. Slow routes are ranked. Dependency latency and dependency errors are separated from application latency. Redis internals and host resources sit beside request metrics so the dashboard can show whether symptoms line up across layers.",
	"Service-specific dashboards go further where needed. For the Web2 API, the reporting surface includes RPC operation health, dependency latency, dependency errors, queue behaviour, Node runtime signals, and request geography from Cloudflare country context. That makes the dashboard useful for product and operations, not only infrastructure.",
	"The dashboard language is deliberately operator-friendly. It favours names, rows, and links that map to decisions: are origins up, are app targets up, which routes are slow, where are 5xxs coming from, are dependencies slow, and what changed around the same time.",
	{ style: "h2", text: "Logs, traces, and evidence" },
	"Grafana Alloy collects structured Docker container logs and labels them by service, environment, region, instance, and container before shipping them to Loki. The retention model uses R2-backed long-term storage with a compacted index and bounded retention, giving enough time for incident review without turning logs into an unmanaged archive.",
	"Application traces flow over OTLP/HTTP into host-level Alloy, then into Tempo with R2-backed retention. Slow request and slow dependency thresholds are emitted as first-class signals, so traces, logs, and metrics describe the same operational event from different angles.",
	"The Grafana experience connects those angles. Derived fields turn trace IDs in logs into links to traces. Trace views link back to the matching logs. Traces can also link to relevant metrics over the same time window. The result is a practical investigation path: start from a dashboard symptom, jump to logs or traces, and come back to the metric context without manually rebuilding filters.",
	"This is the difference between collecting telemetry and using telemetry. The system is designed so an operator can move from a high-level graph to the relevant evidence and back again while preserving service, region, instance, and time context.",
	{ style: "h2", text: "Synthetic checks" },
	"The front-of-house checks cover public websites separately from backend health endpoints. Blackbox probes answer whether users can reach the public surfaces. Service health endpoints answer whether the app believes it is ready. RPC and GraphQL probes answer whether critical data paths are returning useful content.",
	"Graph response checks are more than uptime probes. They issue a real query and validate body-level freshness so a page does not look healthy while serving stale indexed data. RPC probes perform real chain calls so provider or regional problems become visible before a product team has to infer them from user reports.",
	"SSL expiry is tracked as its own operational signal with warning and urgent windows. That sort of check is simple, but it avoids a class of avoidable production incidents that can otherwise sit outside application monitoring.",
	{ style: "h2", text: "Alerting and escalation" },
	"Alertmanager separates warning, critical, and page-level routes. The rules focus on symptoms that matter: sustained 5xx rate, high p95 latency, service quorum loss, host capacity risk, RPC failure rate, all-RPC failure, queue backlog, stalled work, and SSL expiry windows.",
	"The escalation model is designed to reduce noise. A single transient probe should not wake someone up. A sustained 5xx rate, loss of quorum, all providers failing, or an expiry window that is close enough to create customer impact should. The case study can talk about that severity model without publishing receiver URLs or phone-routing details.",
	"Alerts also line up with the dashboard structure. If a rule fires for p95, 5xx rate, RPC failure, queue backlog, or capacity, there is a matching reporting view that helps explain the alert rather than forcing an operator to start from a blank Explore tab.",
	{ style: "h2", text: "Access and deployment discipline" },
	"The observability plane is deliberately separate from public traffic. Metrics access is allowlisted at the firewall, human access travels through private access paths, and public services do not need to expose their internal metrics endpoints directly.",
	"That separation is important. It lets Prometheus reach the signals it needs while keeping metrics endpoints away from normal customer routes. It also means operational tooling can evolve without increasing the public attack surface of every application.",
	"The deploy model favours reviewed configuration and controlled reloads. Dashboards, rules, scrape configs, log collection, and trace collection are treated as operational assets rather than clicks in a console. That is what makes the reporting system maintainable as the platform changes.",
	{ style: "h2", text: "Public-safe boundary" },
	"The useful public story is the architecture and operating model: reviewed infrastructure changes, sideband observability, Prometheus jobs, Grafana dashboards, Loki logs, Tempo traces, Alloy collection, synthetic probes, R2-backed retention, and alert routing.",
	"What should stay private is the map itself: exact hostnames, IP addresses, bucket names, account identifiers, tunnel names, service inventory, provider URLs, webhook routes, SMS configuration, bearer tokens, credentials, and any internal routing details that could help someone target the system.",
];

function portableText(items) {
	return items.map((item, index) => {
		const value = typeof item === "string" ? { style: "normal", text: item } : item;
		return {
			_type: "block",
			_key: `flai${index + 1}`,
			style: value.style || "normal",
			markDefs: [],
			children: [
				{
					_type: "span",
					_key: `flai${index + 1}s`,
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
SET title = ${sqlString(title)},
	summary = ${sqlString(summary)},
	project_status = 'Draft case study',
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
	COALESCE(data, '{}'),
	'$.title', ${sqlString(title)},
	'$.summary', ${sqlString(summary)},
	'$.project_status', 'Draft case study',
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

const dir = mkdtempSync(join(tmpdir(), "simplethings-flai-infrastructure-case-study-"));
const file = join(dir, "update.sql");
writeFileSync(file, sql);

if (process.argv.includes("--print")) {
	console.log(sql);
	process.exit(0);
}

const result = spawnSync("npx", ["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file], {
	encoding: "utf8",
	stdio: "inherit",
});

process.exit(result.status ?? 1);
