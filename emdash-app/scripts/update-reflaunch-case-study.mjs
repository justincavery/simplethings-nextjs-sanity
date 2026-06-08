import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DB_NAME = "simplethings-cms-prod";
const SLUG = "reflaunch-backend-api-realtime-platform";
const NOW = new Date().toISOString();

const summary =
	"A Fastify backend data engine for Flaunch and Reflaunch product surfaces, combining Envio-indexed events, Redis hot indexes, WebSockets, Postgres state, and governed builder API access.";

const stack = [
	{
		category: "API",
		capabilities: "Fastify 5, TypeScript, JSON schemas, Swagger/OpenAPI, V2 plugin",
	},
	{
		category: "Indexing",
		capabilities: "Envio HyperIndex, Hasura GraphQL, Redis Streams, consumer groups",
	},
	{
		category: "Data",
		capabilities: "Redis sorted sets, hashes, sets, lists, Postgres, Prisma, Neon",
	},
	{
		category: "Real-time",
		capabilities: "WebSockets, Redis Pub/Sub, Postgres LISTEN/NOTIFY, restart-safe backfill buffers",
	},
	{
		category: "Delivery",
		capabilities: "GitHub Actions, GHCR, Kamal 2, Docker, Prisma migrations, preview environments",
	},
	{
		category: "Observability",
		capabilities: "Prometheus, OpenTelemetry, Pino logs, slow dependency metrics, Caddy metrics proxy",
	},
];

const businessBenefits = [
	{ benefit: "Makes indexed chain data feel live" },
	{ benefit: "Keeps discovery feeds fast under load" },
	{ benefit: "Gives builders governed API access" },
	{ benefit: "Makes previews and releases repeatable" },
];

const technicalHighlights = [
	{ highlight: "Envio streams hydrate Redis hot indexes" },
	{ highlight: "WebSocket broadcasts before cache writes" },
	{ highlight: "V2 auth, rate limits, and usage metering" },
	{ highlight: "Neon previews with Kamal guardrails" },
];

const blocks = [
	{ style: "h2", text: "Context" },
	"Reflaunch and Flaunch needed a backend that could make blockchain-derived data feel immediate in a normal product interface. The hard part is not only serving token data. It is reconciling indexed chain events, onchain reads, cached product state, moderation decisions, account data, notifications, and live activity without making the frontend wait on the slowest dependency.",
	"The result is a Fastify-based data engine. Envio HyperIndex remains the indexing layer, Hasura GraphQL provides the query surface over indexed data, Redis becomes the hot product model for discovery and real-time state, and Postgres stores application state such as users, bans, overrides, chat, offers, notifications, builder accounts, API keys, and usage rows.",
	"This is the kind of backend work that is easy to underestimate from the outside. The visible product surface is a feed, a token detail page, a position view, or a live activity notification. Underneath, the system has to preserve correctness, stay fast under repeated reads, push live updates, recover cleanly after deploys, and give operators enough evidence to debug production behaviour.",
	{ style: "h2", text: "Indexer-to-Redis product model" },
	"The indexer does more than populate a database. Envio publishes event categories directly into Redis Streams, and the backend consumes those streams into Redis data structures that are shaped for product reads: sorted sets for rankings, hashes for token state, reverse indexes for ownership, lists for WebSocket backfill, and scalar counters for protocol-wide aggregates.",
	"That direct stream path matters because the product does not need to wait for every read to become a GraphQL aggregation. A token list can come from a sorted set and a batch of hash reads. Recent activity can be buffered in Redis lists. Protocol volume can be incremented into hourly buckets. Detail pages can lean on Redis first, then fall back to indexed queries only where deeper context is needed.",
	"The backend uses different Redis key groupings for stream consumption and token state so Redis Cluster constraints are respected. Streams are grouped so multi-stream consumer reads work, while token ranking and token hashes live together for atomic Lua updates. That is a small implementation detail, but it is the kind of detail that prevents a high-throughput design from falling apart when it meets Redis Cluster.",
	{ style: "h2", text: "Bootstrap and recovery" },
	"Startup is intentionally staged. The server builds the Fastify app, registers compression, CORS, Redis, cache helpers, Swagger, WebSockets, V1 routes, and the scoped V2 plugin. After the server is listening, it warms the GraphQL connection pool, wires ETH/USD caching, bootstraps token state from the indexer into Redis, loads Twitter verification data, starts a background user-handle index, warms the first discovery page, initializes the broadcast bridge, starts Postgres notification listeners, and then starts the Redis Stream consumer.",
	"The bootstrap has two modes. When Redis is empty or nearly empty, it performs a full paginated load from the indexer in batches, excluding token bans and writing token hashes, market-cap rankings, eligibility rankings, created-at rankings, and owner reverse indexes. When Redis already has enough data, it refreshes the highest-impact tokens and runs backfills for newer Redis structures such as owner sets and created-at rankings.",
	"This makes restarts practical. The stream is treated as the incremental path, while bootstrap is the source-of-truth repair path. If a deployment restarts a process or a consumer loses its in-memory context, the backend can rebuild the hot Redis model from indexed data and then resume stream processing for new events.",
	{ style: "h2", text: "Hot feeds and cache behaviour" },
	"The main product read path is tuned for feed speed. Rankings come from Redis sorted sets, token cards come from batched hash reads, and the response can be assembled without touching Hasura when the required side data is already cached. When deeper data is missing, the service performs targeted GraphQL queries and then stores the expensive pieces back into Redis with bounded TTLs.",
	"The cache layer includes thundering-herd protection. A cold key is fulfilled by the caller that wins a short Redis lock, while concurrent callers retry the cache before falling back to their own fetch. BigInt values are serialized safely, cache headers expose useful debug information, and event-driven invalidation removes stale position, royalty, activity, and OHLCV data when stream events prove something changed.",
	"That gives the frontend fast repeated reads without pretending the chain is static. Swaps mark OHLCV data dirty, update lifetime volume, touch user position caches, and increment protocol volume buckets. Fee events invalidate royalty data and update lifetime fee totals. Claim events clear royalty, position, and activity caches for the claimer. Created, holder, and owner events update ranking and ownership structures directly.",
	{ style: "h2", text: "Stream consumer design" },
	"The consumer reads the indexer streams through a Redis consumer group with blocking reads and batch acknowledgements. It uses a dedicated duplicated Redis connection, because blocking stream reads would otherwise hold the main Redis connection and interfere with HTTP request pipelines. That was a real operational lesson in the project history: once the Redis-backed API became busy, stream consumption and request handling needed separate connections.",
	"Each stream category maps to a product update. State events atomically update price, liquidity, and market-cap ranking through Lua. Swap events update last-trade timestamps, lifetime volume, rolling volume buckets, OHLCV dirty flags, and user caches. Fee events update fee counters and royalty cache state. Holder and owner events keep eligibility and reverse-owner indexes accurate. Created events add new tokens to the hot model. Claim events clear the user-facing balances that would otherwise look stale.",
	"The consumer deliberately fires the real-time callback before completing the Redis writes. That sounds risky until you look at the user experience: a live feed should not feel delayed by slower cache maintenance. The callback is isolated so broadcast failures cannot block stream processing, while the Redis writes still catch the durable hot model up immediately after.",
	{ style: "h2", text: "Real-time WebSockets" },
	"The WebSocket path is built as a fanout bridge rather than a second data model. Stream events are enriched, pushed into Redis-backed backfill buffers, published over Redis Pub/Sub, and broadcast to each instance's local socket pool. That lets multiple API instances share the same event stream while keeping the socket connections local to the process that owns them.",
	"Clients receive recent activity on connect, then live trade, launch, claim, price, fee, protocol-fee, and large-buy style updates as the stream advances. User-specific notifications are handled through rooms: a client can subscribe to an address, receive a notification backfill from Postgres, and then receive offer or account events for that address while the socket remains open.",
	"The implementation also includes the less glamorous pieces that make WebSockets work in production: heartbeat pings, idle termination, TCP keepalive, connection-count metrics, dead-socket cleanup, restart-safe Redis buffers, and search-index updates from the same event path. A later fix tightened the connection lifecycle so open socket gauges and half-open connections stayed honest.",
	{ style: "h2", text: "Builder-facing V2 API" },
	"The V2 API was added as a scoped Fastify plugin, which is an important architectural choice. Auth, rate limiting, usage tracking, and V2 routes are encapsulated under the V2 prefix, so the builder-facing API does not leak hooks into the existing V1 product routes.",
	"Phase 1 exposes read-only product data through adapters over the same Redis, Postgres, and HyperIndex infrastructure used by V1. That avoids a second data path while still giving builders a cleaner API contract, generated OpenAPI documentation, account endpoints, key management, usage views, and admin controls.",
	"Authentication supports server-side API keys and Google ID tokens for the portal and admin surfaces. API keys are generated once, hashed before storage, cached in Redis for lookup speed, and invalidated when account tier, status, limits, or key state changes. The database also enforces the active-key constraint so concurrent requests cannot bypass the service-level check.",
	"Rate limits are fixed-window counters across minute, hour, and day scopes, implemented as a Redis pipeline so each request updates all relevant windows consistently. Usage metering is separate from rate limiting: authenticated non-5xx responses increment a hot Redis hash, and a background flusher drains that hash into Postgres on a cadence using a leader lock, staging keys, orphan recovery, and additive upserts.",
	{ style: "h2", text: "Application state and moderation" },
	"Postgres holds the state that should not be treated as cache: chat messages and reports, bans, token metadata overrides, revenue managers, import requests, Twitter verifications, royalty-member profile data, user display preferences, off-chain NFT offers, notifications, and the V2 account/key/usage model.",
	"Moderation is woven through the read and write paths. Bans are loaded from Postgres into in-memory sets at startup and refreshed through admin actions. Token bans are excluded from bootstrap, stream processing, search, details, and feeds. Buried tokens are handled differently: they are removed from public ranking surfaces while remaining searchable and detail-viewable. Image, user, group, and chat concerns are kept distinct so one kind of moderation action does not accidentally overreach.",
	"The repo history shows several iterations around correctness here: lowercase and checksummed address handling, token moderation enforcement, buried token behaviour, decoupling image bans from token bans, and ownership checks that prefer Redis but can fall back to onchain reads when required.",
	{ style: "h2", text: "Search and identity" },
	"Search is also a hybrid. Token search is built from Redis-backed token hashes and kept warm in memory, then updated from live launch and swap activity. User identity search pulls from wallet and profile sources, stores a Redis-backed handle index, and loads that index in the background so it does not block startup.",
	"That creates a more product-like search experience: token names, symbols, addresses, handles, and profile context can be resolved quickly, while slower external identity services are pushed out of the critical path where possible.",
	{ style: "h2", text: "Observability" },
	"The backend emits structured JSON logs through Fastify and Pino, Prometheus metrics for HTTP and V2 behaviour, optional OpenTelemetry traces, and slow-operation metrics for dependencies. Request logs carry canonical request IDs, incoming request IDs, Cloudflare request context, service and region fields, response durations, response sizes, and safe error context.",
	"Tracing covers Fastify, outbound HTTP, Postgres, Redis, and Undici, with manual spans in hot application paths such as GraphQL calls, cache work, database access, RPC reads, and V2 adapters. Sensitive headers, API keys, cookies, tokens, private keys, request bodies, and bound SQL values are kept out of logs.",
	"The deployment also includes a Caddy metrics proxy accessory so Prometheus scraping can be separated from the application listener while still reaching the same metrics contract. That is useful operational plumbing: it keeps observability accessible without turning the public API surface into the metrics surface.",
	{ style: "h2", text: "Deployment and preview infrastructure" },
	"The release path is more than a container deploy. Main branch deployments log into GHCR, install dependencies with pnpm, generate the Prisma client, typecheck, run Prisma migrations, seed database data, install Kamal, materialize runtime secrets, bootstrap servers, release stale deploy locks, deploy the app, and boot or refresh the metrics proxy accessory.",
	"Prisma migrations have explicit guardrails for Neon branch edge cases. The workflows handle known migration states where an inherited branch already contains objects or where a failed migration record blocks future runs. The workflow resolves the offending migration state and retries rather than leaving the deploy in a manual half-fixed state.",
	"Preview environments are coordinated across GitHub Actions, Neon, and Kamal. A pull request creates or reuses a branch-specific Neon database branch, waits for that branch to exist, retrieves the appropriate pooled and direct connection strings, generates a preview Kamal config from the branch name, deploys the preview service, and writes a useful deployment summary. Closing a pull request removes the preview deployment, while a separate cleanup workflow prunes orphaned Neon preview branches.",
	"The production topology is multi-region, with region-specific Redis and RPC configuration, health checks on a liveness endpoint, container-level health checks in Docker, Kamal proxy health checks, JSON-file log rotation, GHCR images, PM2 runtime inside the container, and OpenTelemetry pointed at the host observability stack. The public story should name the pattern without publishing exact hosts, tunnel names, database IDs, internal route maps, or credentials.",
	{ style: "h2", text: "Iterations and fixes" },
	"The commit history tells the delivery story. Redis blocking was fixed by moving stream reads onto a dedicated connection. Live WebSocket events were moved earlier in the stream-processing path so clients saw updates before slower cache writes finished. Half-open socket issues were addressed with TCP keepalive, heartbeat sweeps, active cleanup, and corrected connection gauges.",
	"Database and deployment work also evolved. Prisma and Neon migration permissions were adjusted, owner connections were fetched for migrations, preview secrets and Redis references were corrected, migration steps moved between workflows as the deployment model matured, and the main deploy now performs type checks and migration recovery before Kamal rollout.",
	"Product correctness kept moving too: token ownership fallbacks were hardened, builder CORS was updated to allow API-key calls, Google OAuth client configuration was wired through CI and Kamal, error logging was standardized, token moderation bans were enforced, website TXT verification was added, and ETH/USD pricing moved to a backend-controlled rate source with public USD values derived at read time from ETH data.",
	{ style: "h2", text: "Public-safe boundary" },
	"The useful public case study is the architecture and delivery pattern: Envio-indexed events, direct Redis Stream ingestion, Redis hot models, Fastify APIs, WebSocket fanout, V2 builder controls, Postgres state, moderation workflows, observability, Kamal deployments, and Neon preview automation.",
	"What should stay private is the operational map: exact hostnames, IP addresses, database URLs, Neon project identifiers, indexer URLs, Redis URLs, RPC keys, internal route maps, admin keys, metrics tokens, preview branch identifiers, and any provider-specific account details. The case study should show breadth and judgment without publishing the coordinates of the system.",
];

function portableText(items) {
	return items.map((item, index) => {
		const value = typeof item === "string" ? { style: "normal", text: item } : item;
		return {
			_type: "block",
			_key: `reflaunch${index + 1}`,
			style: value.style || "normal",
			markDefs: [],
			children: [
				{
					_type: "span",
					_key: `reflaunch${index + 1}s`,
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

const dir = mkdtempSync(join(tmpdir(), "simplethings-reflaunch-case-study-"));
const file = join(dir, "update.sql");
writeFileSync(file, sql);

const result = spawnSync("npx", ["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file], {
	encoding: "utf8",
	stdio: "inherit",
});

process.exit(result.status ?? 1);
