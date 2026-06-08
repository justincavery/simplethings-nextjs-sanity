import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { monotonicFactory } from "ulidx";

const DB_NAME = "simplethings-cms-prod";
const AUTHOR_ID = "01KT9TQNGGEBT4B2E9HEFTEFSD";
const NOW = new Date().toISOString();
const ulid = monotonicFactory();

const oldProjectSlugs = [
	"subgraph-deployment-reliability",
	"discourse-recovery",
	"infrastructure-diagramming",
];

const projects = [
	{
		slug: "flaunchy-openclaw-launch-assistant",
		title: "Flaunchy Bot on OpenClaw",
		summary:
			"A multi-channel launch assistant that turns social conversations into safer, lower-friction token launch workflows.",
		client: "Flayer Labs / Flaunch",
		year: "2026",
		stack: [
			"OpenClaw",
			"Node.js",
			"TypeScript",
			"Twitter/X API",
			"XMTP",
			"ENS",
			"Agent tooling",
			"Launch automation",
		],
		business_benefits: [
			"Turns social mentions and chat requests into low-friction launch journeys.",
			"Expands distribution through an always-on product channel.",
			"Reduces support load by filling sensible defaults and answering common questions.",
			"Creates a repeatable engagement loop around launches without relying on manual operator presence.",
		],
		technical_highlights: [
			"Shared assistant behaviour across several user-facing channels.",
			"Intent handling for launch requests, image changes, and general product questions.",
			"Queueing, duplicate protection, quality gates, and failure handling around public replies.",
			"Launch tooling that connects media, wallet, and protocol actions behind a conversational workflow.",
		],
		paragraphs: [
			"Simple Things helped shape Flaunchy as a product agent rather than a novelty bot. The useful interaction was deliberately simple: a user could arrive through a familiar social channel, ask for a launch in ordinary language, and have the assistant infer enough structure to move the request forward.",
			"The important work sat behind the personality. The system needed routing, queueing, duplicate protection, quality gates, and clear failure behaviour so it could be responsive in public without becoming noisy or brittle.",
			"From a business point of view, the assistant made token creation feel closer to a conversation than a dashboard. That matters in a category where the underlying action is technical, time-sensitive, and easy to make intimidating.",
		],
		repo_url: "https://github.com/flayerlabs/flaunchy-openclaw",
	},
	{
		slug: "flaunch-media-moderation-api",
		title: "Flaunch media moderation API",
		summary:
			"An authenticated moderation service for checking user-generated token artwork before it appears in public product surfaces.",
		client: "Flayer Labs / Flaunch",
		year: "2025",
		stack: [
			"Python",
			"FastAPI",
			"Pillow",
			"Pydantic",
			"aiohttp",
			"Content moderation",
			"GIF frame analysis",
			"Docker",
		],
		business_benefits: [
			"Helps protect the product and brand from unsafe token imagery.",
			"Creates a clearer review path with pass, flag, and fail outcomes.",
			"Supports launch-scale media checks instead of only manual review.",
			"Reduces operational risk from user-generated visual content.",
		],
		technical_highlights: [
			"Authenticated API endpoint for moderation requests.",
			"Image payload handling for static assets and animated media.",
			"Frame sampling for animated content so review decisions are not based on a single still.",
			"Batch processing support for auditing larger sets of existing token imagery.",
		],
		paragraphs: [
			"Simple Things built a moderation layer for token artwork, giving the Flaunch team a practical way to evaluate user-generated media before it appeared in product surfaces or social previews.",
			"The system was designed for the real shape of token imagery: small graphics, uploaded assets, remote media, and animated files. It returns structured outcomes that can be used by automated flows while still leaving room for human review where confidence is lower.",
			"Alongside the request path, batch tooling created a way to audit historical content. That gives the team a route to improve trust and safety across both new launches and the existing catalogue.",
		],
		repo_url: "https://github.com/flayerlabs/flaunch-moderator",
	},
	{
		slug: "dynamic-nft-metadata-token-art-api",
		title: "Dynamic NFT metadata and token art API",
		summary:
			"A metadata and image API that turns token records into marketplace-friendly responses and branded visual assets.",
		client: "Flayer Labs / Flaunch",
		year: "2025",
		stack: [
			"TypeScript",
			"Node.js",
			"Express",
			"GraphQL",
			"IPFS metadata",
			"SVG generation",
			"PNG rendering",
			"Sharp",
			"ENS",
		],
		business_benefits: [
			"Improves token presentation across marketplaces, embeds, and sharing surfaces.",
			"Turns protocol data into branded, readable visual assets.",
			"Keeps metadata responses consistent as product contracts and surfaces evolve.",
			"Supports safer display behaviour for sensitive or blocked imagery.",
		],
		technical_highlights: [
			"Metadata routes that translate token data into stable API responses.",
			"Dynamic image generation for branded token cards and marketplace assets.",
			"Creator display support using wallet and naming data.",
			"Compatibility work for legacy URL shapes and evolving product requirements.",
		],
		paragraphs: [
			"Simple Things created a metadata and image-generation API that made Flaunch tokens look consistent wherever they were rendered. The service translated token records, external metadata, creator information, and protocol state into clean API responses and branded visual outputs.",
			"The image pipeline gave the product a recognisable visual system while still reflecting each token's own artwork and data. This is the bridge between protocol activity and the user-facing surfaces where tokens are discovered.",
			"The API also handled product evolution over time, including new contract formats, redirects from older URL shapes, static image generation, and safer display handling for sensitive imagery.",
		],
		repo_url: "https://github.com/flayerlabs/flaunch-nft-api",
	},
	{
		slug: "graphql-data-proxy-web3-products",
		title: "GraphQL data proxy for Web3 products",
		summary:
			"A proxy layer that gives product teams stable GraphQL routes while insulating users from upstream data-provider changes.",
		client: "Flayer Labs",
		year: "2026",
		stack: [
			"Varnish",
			"NGINX",
			"Docker",
			"Kamal",
			"GitHub Actions",
			"GraphQL",
			"HTTP caching",
			"Load balancing",
		],
		business_benefits: [
			"Improves perceived speed for repeated data reads.",
			"Reduces dependency on any single upstream data provider.",
			"Creates stable product-facing routes that can survive backend migrations.",
			"Moves routing changes into a repeatable review and deployment flow.",
		],
		technical_highlights: [
			"Maps clean product-facing routes to underlying GraphQL data sources.",
			"Caches eligible GraphQL responses using request-aware cache keys.",
			"Handles health checks, preflight requests, redirects, and response normalisation.",
			"Packages proxy configuration as a deployable container rather than a one-off server edit.",
		],
		paragraphs: [
			"Flayer needed blockchain-indexed data to feel like a dependable product API rather than a collection of provider URLs. This work created a proxy layer that presents simple, durable routes to frontends while keeping the underlying graph infrastructure replaceable.",
			"The balance was speed without false freshness. Repeated reads can be absorbed close to the edge, while the routing layer still leaves room for fast-moving market and token data to change when it needs to.",
			"A large part of the value was operational. Provider migrations, route changes, and cache behaviour could be reviewed and deployed through a controlled workflow instead of being handled as live server surgery.",
		],
		repo_url: "https://github.com/flayerlabs/flayer-proxy-config",
	},
	{
		slug: "instameme-mobile-token-creation",
		title: "InstaMeme mobile token creation app",
		summary:
			"A mobile-first app that makes meme token creation feel like a camera and social feed workflow rather than a crypto dashboard.",
		client: "Flayer Labs / Flaunch",
		year: "2026",
		stack: [
			"Next.js",
			"React",
			"TypeScript",
			"PWA",
			"Tailwind CSS",
			"Privy",
			"wagmi",
			"RainbowKit",
			"React Query",
			"InstantDB",
		],
		business_benefits: [
			"Turns token creation into a familiar capture, upload, and publish flow.",
			"Creates a social surface around newly launched meme assets.",
			"Supports retention through profiles, comments, likes, and owned-token views.",
			"Makes wallet-based onboarding less intimidating for consumer users.",
		],
		technical_highlights: [
			"App Router structure covering feed, create, profile, and token detail experiences.",
			"Multi-step media capture, edit, preview, and launch flow.",
			"Wallet-aware UI using embedded and external wallet connections.",
			"Social interaction layer for comments, views, and likes.",
		],
		paragraphs: [
			"InstaMeme reframed token creation as a lightweight mobile creation flow: choose or capture an image, prepare it for launch, add the token details, and publish into a browsable feed.",
			"The product connects discovery with ownership. Users can browse recent launches, open token pages, interact socially, and return to a personal collection tied to their connected wallet.",
			"The strongest public story here is product UX: reducing friction in a technical category by hiding complexity behind familiar creation and social patterns.",
		],
		repo_url: "https://github.com/flayerlabs/insta-meme-app",
	},
	{
		slug: "edge-proxy-configuration-manager",
		title: "Edge proxy configuration manager",
		summary:
			"A configuration management workflow for generating, validating, and safely rolling out HAProxy changes across edge servers.",
		client: "Flayer Labs",
		year: "2026",
		stack: [
			"Go",
			"HAProxy",
			"Makefile",
			"GitHub Actions",
			"SSH automation",
			"SFTP",
			"TLS termination",
			"Health checks",
		],
		business_benefits: [
			"Reduces risk when changing production traffic routing.",
			"Improves uptime through health-checked backends and controlled reloads.",
			"Keeps multi-service edge routing consistent across environments.",
			"Gives infrastructure changes a clearer audit trail.",
		],
		technical_highlights: [
			"Generates per-node HAProxy configs from shared and host-specific inputs.",
			"Supports build, pull, diff, push, test, and deploy-style workflows.",
			"Validates candidate configurations before replacing active configuration.",
			"Allows targeted rollout when a change needs to be tested on a subset first.",
		],
		paragraphs: [
			"This project tackled a classic infrastructure problem: many services, multiple edge locations, and a high cost for mistakes. Instead of hand-editing live proxy config, the repo builds deterministic HAProxy outputs from version-controlled fragments.",
			"The workflow is deliberately operational. Configs can be generated locally, compared with what is running remotely, uploaded to a temporary location, validated by HAProxy itself, and only then promoted into service.",
			"The public value is reliability engineering: safer traffic management, clearer review cycles, and faster recovery from routing changes.",
		],
		repo_url: "https://github.com/flayerlabs/edge-proxy-config",
	},
	{
		slug: "flaunch-fee-simulator",
		title: "Flaunch fee simulator",
		summary:
			"A Cloudflare-hosted simulator that helps token communities understand potential trading-fee outcomes through a fast, shareable product experience.",
		client: "Flayer Labs / Flaunch",
		year: "2026",
		stack: [
			"Cloudflare Workers",
			"D1",
			"KV",
			"React",
			"Vite",
			"TypeScript",
			"Drizzle ORM",
			"Open Graph images",
			"Playwright",
		],
		business_benefits: [
			"Turns abstract protocol economics into an interactive user journey.",
			"Creates social loops through shareable token result pages.",
			"Supports campaign traffic with edge hosting and cache-friendly delivery.",
			"Keeps the experience timely by syncing token and market context.",
		],
		technical_highlights: [
			"Single Cloudflare-hosted app combining an edge API and React front end.",
			"Scheduled data ingestion for token and volume context.",
			"Historical modelling of potential fee outcomes.",
			"Dynamic metadata and social preview generation for token result pages.",
		],
		paragraphs: [
			"Simple Things helped turn Flaunch's fee model into a lightweight interactive product: search a token, choose a timeframe, and see how protocol mechanics could translate into creator-facing outcomes.",
			"The build combined a React front end with Cloudflare Workers, D1, and KV so the app could stay fast while syncing data in the background and serving social traffic efficiently.",
			"Shareability was treated as part of the product. Result pages generate dynamic metadata and preview images so the experience can move naturally from the site into social channels.",
		],
		repo_url: "https://github.com/flayerlabs/cf-if-flaunch",
	},
	{
		slug: "infrastructure-management-operational-map",
		title: "FLAI infrastructure observability and reporting platform",
		summary:
			"A source-controlled observability and reporting platform for a multi-chain web estate, using Prometheus, Grafana, Loki, Tempo, Alloy, synthetic checks, and reviewed infrastructure-as-code.",
		client: "Flayer Labs",
		year: "2026",
		stack: [
			"OpenTofu",
			"Cloudflare",
			"GitHub Actions",
			"Remote state",
			"Prometheus",
			"Alertmanager",
			"Blackbox Exporter",
			"Grafana",
			"Loki",
			"Tempo",
			"Grafana Alloy",
			"OpenTelemetry",
			"Docker Compose",
		],
		business_benefits: [
			"Turns live operations into one readable view.",
			"Cuts diagnosis time across APIs, RPCs, and public sites.",
			"Keeps monitoring separate from customer-facing traffic.",
			"Escalates only when symptoms point to customer-facing risk.",
		],
		technical_highlights: [
			"Prometheus jobs with tuned scrape cadences for services, RPCs, sites, and hosts.",
			"Grafana dashboards that join service health, route latency, errors, logs, and traces.",
			"Content-aware GraphQL and JSON-RPC probes rather than shallow uptime checks.",
			"R2-backed Loki and Tempo retention with Alloy collection on host nodes.",
		],
		paragraphs: [
			"Simple Things helped turn FLAI infrastructure reporting from a set of separate consoles and host-level checks into one operational view. The work spans source-controlled infrastructure, Prometheus scrape design, Grafana dashboards, logs, traces, synthetic checks, and alert routing.",
			"The important product outcome is calm operational judgement. Operators can see whether public sites are reachable, API fleets are healthy, RPC providers are returning real chain data, GraphQL indexes are fresh, Redis is available, routes are slowing down, or one region is behaving differently from the rest.",
			"The public case study should show the breadth of the system without publishing the coordinates of it. Exact hostnames, IP addresses, tunnel names, bucket names, webhook URLs, bearer tokens, provider keys, and internal route maps stay private.",
		],
		repo_url: "https://github.com/flayerlabs/infrastructure",
	},
	{
		slug: "flaunch-web2-token-launch-api",
		title: "Web2 token launch API for Flaunch",
		summary:
			"A TypeScript API that lets conventional web apps create Flaunch token experiences with media upload, creator identity options, and asynchronous launch handling.",
		client: "Flayer Labs / Flaunch",
		year: "2026",
		stack: [
			"TypeScript",
			"Node.js",
			"Express",
			"Redis",
			"BullMQ",
			"IPFS",
			"Cloudflare Stream",
			"Viem",
			"OpenTelemetry",
			"Prometheus",
		],
		business_benefits: [
			"Makes token launches easier from ordinary web product flows.",
			"Reduces manual support around launch preparation.",
			"Adds media review before metadata becomes public.",
			"Improves operational visibility for launch jobs.",
		],
		technical_highlights: [
			"Media upload and moderation flow before launch.",
			"Asynchronous job processing for slower blockchain actions.",
			"Creator identity resolution across wallet, social, and email-style paths.",
			"Structured logging, metrics, and tracing around launch work.",
		],
		paragraphs: [
			"This project turned Flaunch token creation into a web-friendly API surface. Instead of asking users or partner builders to coordinate wallet, metadata, media, and protocol details themselves, the backend packages those steps behind a clearer integration layer.",
			"The implementation includes practical production concerns: rate limiting, queue-based transaction processing, status polling, media validation, and observability. That makes the flow less fragile than a direct frontend-only integration.",
			"From a business perspective, this is the kind of API that lets product teams build friendlier launch surfaces without rebuilding the protocol plumbing every time.",
		],
		repo_url: "https://github.com/flayerlabs/flaunch-web2-api",
	},
	{
		slug: "flaunch-admin-revenue-operations-dashboard",
		title: "Flaunch admin and revenue operations dashboard",
		summary:
			"A private operations dashboard for moderation, user and token administration, revenue reporting, and executive product analytics.",
		client: "Flayer Labs / Flaunch",
		year: "2026",
		stack: [
			"Next.js",
			"React",
			"TypeScript",
			"Auth0",
			"Tailwind CSS",
			"Recharts",
			"BigQuery",
			"GraphQL",
			"Postgres",
		],
		business_benefits: [
			"Centralises moderation workflows in one operational surface.",
			"Improves confidence in revenue and product-health reporting.",
			"Speeds up leadership decision-making with clearer metric definitions.",
			"Reduces manual recovery work when data gaps appear.",
		],
		technical_highlights: [
			"Protected admin routes and server-side API surfaces.",
			"Moderation workflows for users, tokens, groups, and metadata.",
			"Scheduled revenue collection and warehouse-backed reporting.",
			"Reusable dashboard components for product, runway, and unit-economics views.",
		],
		paragraphs: [
			"This dashboard combines operational tooling with business intelligence. Moderators can review product content and account state, while leadership can inspect revenue, product health, runway, and unit economics from the same application.",
			"A major part of the work was turning messy operational questions into defensible metrics. The dashboard distinguishes live data from gaps, documents definitions, and exposes recovery paths so the team can trust the numbers rather than manually reconcile them every week.",
			"The result is an internal control room: not flashy, but valuable because it shortens the path between seeing an issue, understanding its impact, and deciding what to do next.",
		],
		repo_url: "https://github.com/flayerlabs/flaunch-admin-dashboard",
	},
	{
		slug: "flaunch-edge-token-image-worker",
		title: "Cloudflare image delivery for Flaunch tokens",
		summary:
			"A Cloudflare Worker that keeps token image URLs stable while resolving, transforming, moderating, and caching image assets at the edge.",
		client: "Flayer Labs / Flaunch",
		year: "2026",
		stack: [
			"Cloudflare Workers",
			"TypeScript",
			"Workers KV",
			"GraphQL",
			"IPFS",
			"Edge image resizing",
			"GitHub Actions",
		],
		business_benefits: [
			"Improves token image loading speed for feeds and embeds.",
			"Provides stable image URLs even when underlying metadata changes.",
			"Supports cleaner handling for flagged or sensitive images.",
			"Reduces backend load through edge caching.",
		],
		technical_highlights: [
			"Identifier-to-image resolution at the edge.",
			"KV-backed metadata cache with controlled invalidation.",
			"Image resizing and format negotiation close to the user.",
			"Fallback handling across image sources and moderation states.",
		],
		paragraphs: [
			"Flaunch needed image URLs that could stay stable while token metadata evolved. This Worker makes the token reference the durable public handle, then resolves the current image behind the scenes and serves an optimised response from the edge.",
			"The implementation folds together performance and moderation. It supports resizing, format negotiation, flagged-image presentation, and cache invalidation so admin updates can become visible without waiting for every stale response to expire.",
			"That makes the image layer a product feature in its own right: faster feeds, cleaner embeds, and fewer brittle dependencies between frontends and metadata storage.",
		],
		repo_url: "https://github.com/flayerlabs/cf-worker-flaunch-images",
	},
	{
		slug: "distributed-performance-testing-platform",
		title: "Distributed performance testing platform",
		summary:
			"A repeatable performance testing platform with load tests, browser checks, regional agents, live results, and dashboard reporting.",
		client: "Flayer Labs",
		year: "2026",
		stack: [
			"TypeScript monorepo",
			"k6",
			"Express",
			"React",
			"CLI tooling",
			"YAML presets",
			"Docker",
			"InfluxDB",
			"Grafana",
			"Playwright",
		],
		business_benefits: [
			"Catches performance regressions before users feel them.",
			"Supports capacity planning with repeatable baselines.",
			"Shortens incident diagnosis by preserving test results and metrics.",
			"Makes performance testing easy enough to run before releases.",
		],
		technical_highlights: [
			"Distributed test execution through reusable agents.",
			"Preset-based API and browser performance checks.",
			"Live UI, result artifacts, and summary reporting.",
			"Analysis layer for bottlenecks and operator-friendly recommendations.",
		],
		paragraphs: [
			"This project productised performance testing instead of leaving it as a folder of ad hoc scripts. Teams can run repeatable checks, compare results, and use presets for common product surfaces without rebuilding the test harness each time.",
			"The platform combines test execution, live visibility, and post-run analysis. It captures latency, throughput, error rate, and browser metrics, then turns them into summaries that are useful for release checks, incident response, and capacity conversations.",
			"The deeper value is cultural: performance becomes part of delivery, not something checked only after the product is already under pressure.",
		],
		repo_url: "https://github.com/flayerlabs/Performance-Testooor",
	},
	{
		slug: "reflaunch-backend-api-realtime-platform",
		title: "Reflaunch backend API and real-time data platform",
		summary:
			"A Fastify backend data engine for Flaunch and Reflaunch product surfaces, combining Envio-indexed events, Redis hot indexes, WebSockets, Postgres state, and governed builder API access.",
		client: "Flayer Labs / Flaunch",
		year: "2026",
		stack: [
			"Fastify 5",
			"TypeScript",
			"Envio HyperIndex",
			"Hasura GraphQL",
			"Redis Streams",
			"Redis sorted sets",
			"WebSockets",
			"Postgres",
			"Prisma",
			"Neon",
			"GitHub Actions",
			"GHCR",
			"Kamal 2",
			"Caddy metrics proxy",
			"Prometheus",
			"OpenTelemetry",
			"Viem",
		],
		business_benefits: [
			"Makes indexed chain data feel live.",
			"Keeps discovery feeds fast under load.",
			"Gives builders governed API access.",
			"Makes previews and releases repeatable.",
		],
		technical_highlights: [
			"Envio streams hydrate Redis hot indexes.",
			"WebSocket broadcasts before cache writes.",
			"V2 auth, rate limits, and usage metering.",
			"Neon previews with Kamal guardrails.",
		],
		paragraphs: [
			"Reflaunch and Flaunch needed a backend that could make blockchain-derived data feel immediate in a normal product interface. The hard part is reconciling indexed chain events, onchain reads, cached product state, moderation decisions, account data, notifications, and live activity without making the frontend wait on the slowest dependency.",
			"The architecture uses Envio HyperIndex as the indexing layer, Hasura GraphQL as the query surface over indexed data, Redis as the hot product model for discovery and real-time state, and Postgres for application state such as users, bans, overrides, offers, notifications, builder accounts, API keys, and usage rows.",
			"The visible product surface is a feed, a token detail page, a position view, or a live activity notification. Underneath, the system has to preserve correctness, stay fast under repeated reads, push live updates, recover cleanly after deploys, and give operators enough evidence to debug production behaviour.",
		],
		repo_url: "https://github.com/flayerlabs/reflaunch-backend",
	},
	{
		slug: "meebmarket-cloudflare-nft-marketplace",
		title: "MeebMarket Cloudflare-native NFT marketplace",
		summary:
			"A Meebits marketplace aggregator running entirely on Cloudflare, combining catalogue search, OpenSea and NFTX pricing, wallet buy and swap flows, live activity, alerts, SEO, and dynamic sharing images.",
		client: "Simple Things Limited",
		year: "2026",
		stack: [
			"Cloudflare Workers",
			"Hono",
			"Cloudflare D1",
			"Cloudflare KV",
			"Cloudflare R2",
			"Cloudflare Images",
			"Durable Objects",
			"Cloudflare Cron Triggers",
			"Vite",
			"React 18",
			"TypeScript",
			"wagmi",
			"viem",
			"RainbowKit",
			"NFTX v2",
			"0x Swap API",
			"OpenSea API",
			"OpenSea Stream",
			"Resend",
			"Turnstile",
			"workers-og",
			"HTMLRewriter",
			"GTM",
			"GA4",
			"Wrangler",
			"Playwright",
		],
		business_benefits: [
			"Creates a focused marketplace surface instead of relying only on generic NFT marketplace listings.",
			"Brings discovery, buying, swapping, watching, and sharing into one product journey.",
			"Reduces operating overhead by keeping app hosting, API, cache, database, media, cron, and real-time fanout on Cloudflare.",
			"Improves search and social visibility through crawlable token pages, structured data, sitemaps, and generated OG images.",
			"Supports product decisions with privacy-aware analytics that do not send raw wallet addresses into GA4.",
			"Turns a specialist Web3 workflow into a more familiar catalogue and commerce experience.",
		],
		technical_highlights: [
			"Worker-first Hono API serving JSON routes, canonical redirects, SEO surfaces, and the React SPA asset fallback.",
			"D1 schema covering the 20,000-token catalogue, traits, listing cache, watchlists, alert state, fee logs, and moderation data.",
			"Scheduled indexer that merges OpenSea orders and NFTX vault pricing while isolating source failures.",
			"Atomic buy and swap quote flows using NFTX MarketplaceZap transactions, wagmi, viem, and RainbowKit.",
			"Durable Object activity hub that maintains live marketplace activity and fans it out to browsers over SSE.",
			"Server-side SEO injection with HTMLRewriter, sitemap generation, Product and VisualArtwork JSON-LD, Offer fallback logic, and dynamic OG cards.",
			"Cloudflare Images and R2 media path that moves expensive image transforms out of the hot Worker request path.",
			"Double opt-in watchlist alerts through Resend, with Turnstile protection on user submissions.",
			"Skin-tone sampling, palette tooling, admin moderation, and user report flow for collection-specific browsing filters.",
		],
		paragraphs: [
			{ style: "h2", text: "Context and commercial aim" },
			"MeebMarket is a third-party marketplace aggregator for the Meebits collection. The goal was not to clone the official brand site, but to build a focused trading and discovery surface around a complete 20,000 item catalogue, with the product experience hosted on Cloudflare from the edge API down to the data stores and media path.",
			"The business value is in joining the pieces that are usually scattered across generic marketplace pages, token tools, wallet modals, and social links. A visitor can browse the collection, filter by traits, inspect a specific Meebit, compare listings, buy through NFTX, swap one Meebit for another, watch for listing changes, and share a token page that renders cleanly in search and social contexts.",
			"That makes the project a useful Simple Things case study because it combines product design, Cloudflare architecture, Web3 transaction design, SEO, analytics, operational runbooks, and the unglamorous reliability work that makes the whole thing usable after launch.",
			{ style: "h2", text: "Product surface" },
			"The catalogue is the centre of the experience: all 20,000 Meebits are queryable through a D1-backed API, with filters for type, trait combinations, rarity ordering, price ordering, ownership views, trait landing pages, and detail pages for each token. The browsing model was designed to make a dense collection feel approachable without flattening away the technical data collectors care about.",
			"The buy flow and swap flow are intentionally product-shaped wrappers around more complex onchain actions. A buy quote prepares a single transaction that routes ETH into the required vault action; a swap quote supports Meebit-for-Meebit movement with the required approval step and transaction state surfaced in the UI. The implementation keeps the language user-facing while still preserving the operational detail needed for debugging.",
			"Engagement loops were added around the marketplace rather than bolted on later. The live activity feed gives the site a sense of market movement, watchlist alerts let users opt into listing and price-drop signals, and analytics events give a way to measure views, wallet connection, quote attempts, transaction signing, transaction success, and browsing paths.",
			{ style: "h2", text: "Architecture" },
			"The app uses a Cloudflare Worker as the main entry point. Hono handles API routes, canonical redirects, health checks, image and OG routes, SEO surfaces, and the fallback to the Vite-built React app. The Worker runs before static assets, so the same deployment can serve API behaviour, server-side metadata, and client application routes from one Cloudflare application boundary.",
			"D1 stores the durable product model: Meebit records, traits, listing snapshots, watchlist subscriptions, alert state, skin-tone fields, report records, and fee-related audit structure. KV handles hot cache values such as NFTX pricing and summary data. R2 and Cloudflare Images support the media path. A Durable Object acts as the activity hub, holding a recent event buffer and streaming updates to browsers.",
			"The scheduled indexer refreshes marketplace data on a five-minute cadence. It pulls OpenSea listing data, collapses multiple orders down to the cheapest active order per token, fetches NFTX vault holdings and current buy price, writes the resulting listing cache, updates the KV floor-price cache, and then triggers watchlist alerts. Importantly, one source failing does not stop the other source from updating.",
			{ style: "h2", text: "Iteration history" },
			"Iteration 1 - Capture the live baseline. The starting point was already beyond scaffold: a live Cloudflare-hosted marketplace with catalogue browsing, indexer, wallet flows, activity feed, email alerts, dynamic OG, Cloudflare Images support, skin-tone tooling, Turnstile, and analytics. The first documentation pass rewrote the README to reflect the actual production state rather than an early prototype description.",
			"Iteration 2 - Make operations reproducible. The deployment model was made explicit through wrangler.jsonc, D1 migrations, package scripts, a one-shot provisioner, seed tooling, and local development commands. This matters because Cloudflare-native projects can otherwise become dashboard knowledge. Here the Worker, assets, database, cache, bucket, images binding, Durable Object, cron trigger, migrations, and secrets model are all represented in code or runbooks.",
			"Iteration 3 - Remove type and correctness friction. Several small fixes were deliberately handled before deeper feature work: a robots.txt newline issue, dead SwapModal branch checks, HTMLRewriter handler return types, the caches.default TypeScript gap caused by DOM typings, unused Worker values, and a deploy script that now runs tsc --noEmit before building and deploying. None of these are headline features, but together they reduce the chance of a fragile production release.",
			"Iteration 4 - Make token pages indexable. The original per-token route had rich client UI but thin server-rendered output. The SEO iteration used HTMLRewriter to inject page-specific metadata, JSON-LD, and crawlable HTML into the app shell for /meebit/:id. Crawlers now see headings, token context, item images, trait links, prev and next links, and a gallery route without needing to execute the React app.",
			"Iteration 5 - Add honest structured data. Search Console guidance drove a second SEO pass: token pages now combine Product and VisualArtwork JSON-LD, attach an Offer when an exact listing exists, and use a limited-availability floor-price fallback when there is not a direct listing but NFTX provides an indicative acquisition route. The important detail is honesty: the schema distinguishes an exact token listing from a collection-level vault path.",
			"Iteration 6 - Improve internal discovery. The Meebit detail page gained prev/next navigation and a similar-by-trait row. The similar endpoint chooses representative rare matching tokens per shared trait and avoids duplicate picks. This is useful for users, but also strengthens the internal link graph around the catalogue in a way that is measurable through analytics events.",
			"Iteration 7 - Move media work off the hot path. The image migration was driven by a real Worker constraint: large upstream renders and OG generation can trip CPU limits on cold social card renders. The fix moved images toward R2 and Cloudflare Images variants, with resumable bulk upload scripts, named variants for thumbnails/detail/OG, R2-backed OG fetches, cache versioning, and fallback paths for safe rollback.",
			"Iteration 8 - Add trust, alerts, and moderation loops. Watchlist alerts use double opt-in email verification, one-click unsubscribe, and indexer-driven diffs for new listings, sales, and price drops. Skin-tone tooling samples image regions, stores raw values, supports palette snapping, records confirmation state, and accepts Turnstile-gated community reports. This is a good example of product polish becoming operational data design.",
			{ style: "h2", text: "Public-safe boundaries" },
			"The public case study should show the architecture, product decisions, and iteration path, but not publish account identifiers, secret values, admin credentials, exact webhook verification mechanics, provider keys, internal account settings, or private operational routes. The current copy intentionally talks at capability level where more detail would create unnecessary attack surface.",
			"Likewise, the transaction work should be described in terms of user journey and route shape rather than exposing any private signing material or privileged operations. Contract addresses and public protocols are not secret, but the stronger portfolio story is the system design: a Cloudflare-native marketplace that combines catalogue data, onchain execution, media delivery, SEO, analytics, and operations into one maintained product.",
			{ style: "h2", text: "What this demonstrates" },
			"MeebMarket shows Simple Things operating across product and infrastructure at the same time. It is not just a frontend skin over existing marketplaces, and it is not just backend plumbing. It is a complete specialist product surface with crawlable pages, real-time updates, wallet actions, generated imagery, alerting, deployment discipline, and enough instrumentation to keep improving it after release.",
		],
		url: "https://meebmarket.com",
		repo_url: "https://github.com/SimpleThingsLtd/meebmarket",
	},
];

const deploymentStacks = {
	"flaunchy-openclaw-launch-assistant": [
		"systemd",
		"Journal logging",
		"Cron/heartbeat routines",
		"Environment files",
	],
	"flaunch-media-moderation-api": [
		"GitHub Actions",
		"GHCR",
		"Kamal",
		"Health checks",
	],
	"dynamic-nft-metadata-token-art-api": [
		"Docker",
		"GitHub Actions",
		"GHCR",
		"Kamal",
		"Health checks",
	],
	"graphql-data-proxy-web3-products": [
		"Varnish VCL",
		"Traefik routing",
		"Containerised proxy deploys",
	],
	"instameme-mobile-token-creation": [
		"Next.js deployment",
		"Security headers",
		"CSP",
		"PWA runtime caching",
	],
	"edge-proxy-configuration-manager": [
		"Remote config validation",
		"Controlled reloads",
		"Version-controlled routing",
	],
	"flaunch-fee-simulator": [
		"Wrangler",
		"Cloudflare D1 migrations",
		"Cloudflare scheduled Workers",
	],
	"infrastructure-management-operational-map": [
		"Prometheus",
		"Alertmanager",
		"Blackbox Exporter",
		"Grafana",
		"Grafana Alloy",
		"R2 remote state",
		"Docker Compose",
		"Loki",
		"Tempo",
		"OpenTelemetry",
		"Tailscale",
		"UFW",
	],
	"flaunch-web2-token-launch-api": [
		"Docker",
		"GitHub Actions",
		"GHCR",
		"Kamal",
		"PM2",
		"Caddy",
	],
	"flaunch-admin-revenue-operations-dashboard": [
		"GitHub Actions",
		"Scheduled jobs",
		"Data backfill workflows",
		"Warehouse reporting",
	],
	"flaunch-edge-token-image-worker": [
		"Wrangler",
		"Cloudflare Images",
		"Staging and production deploys",
	],
	"distributed-performance-testing-platform": [
		"Kamal",
		"Cloudflare Tunnel",
		"GitHub Actions",
		"NGINX",
		"Docker Compose",
		"k6 browser",
	],
	"reflaunch-backend-api-realtime-platform": [
		"Docker",
		"GitHub Actions",
		"GHCR",
		"Kamal",
		"Caddy",
		"Neon",
		"Preview environments",
		"Prisma migrations",
	],
	"meebmarket-cloudflare-nft-marketplace": [
		"Wrangler",
		"Cloudflare Worker assets",
		"D1 migrations",
		"KV namespace",
		"R2 bucket",
		"Cloudflare Images binding",
		"Durable Object migration",
		"Scheduled Workers",
		"Typecheck-gated deploys",
		"One-shot provisioner",
	],
};

const deploymentHighlights = {
	"flaunchy-openclaw-launch-assistant": [
		"systemd-managed transport services with journal-backed observability.",
		"OpenClaw heartbeat and scheduled routines for always-on agent behaviour.",
		"Runtime configuration separated from code through environment files.",
	],
	"flaunch-media-moderation-api": [
		"GitHub Actions publishes container images and deploys through GHCR and Kamal.",
		"Healthchecked API service with secret-backed runtime configuration.",
		"Deployment flow covers stale lock release, server bootstrap, environment push, and service rollout.",
	],
	"dynamic-nft-metadata-token-art-api": [
		"Branch and environment-specific Kamal configs for network-aware releases.",
		"Docker and GHCR deployment path with health checks and environment push.",
		"Backwards-compatible route handling for changing product and contract requirements.",
	],
	"graphql-data-proxy-web3-products": [
		"Varnish and NGINX proxy configuration packaged as a deployable container.",
		"Kamal rollout from GitHub Actions using registry-backed images.",
		"Request-aware caching and response normalisation handled in reviewed configuration.",
	],
	"instameme-mobile-token-creation": [
		"PWA runtime caching configured to avoid auth and wallet-sensitive paths.",
		"CSP headers and image host allow-listing in the Next.js config.",
		"Managed-platform friendly Next.js build rather than a bespoke server fleet.",
	],
	"edge-proxy-configuration-manager": [
		"Remote HAProxy validation before reload or promotion.",
		"Makefile and GitHub Actions deployment paths for controlled rollouts.",
		"Per-node config generation from shared and host-specific inputs.",
	],
	"flaunch-fee-simulator": [
		"Wrangler action deployment for Cloudflare Workers.",
		"D1 migrations and scheduled Worker sync for durable product data.",
		"KV caching and dynamic Open Graph output for shareable campaign traffic.",
	],
	"infrastructure-management-operational-map": [
		"OpenTofu pull request plans and saved-plan applies for Cloudflare changes.",
		"Prometheus scrape topology covering APIs, RPCs, public websites, hosts, app metrics, and synthetic checks.",
		"Grafana reporting views for fleet health, route latency, error rates, Redis state, capacity, slow dependencies, logs, and traces.",
		"R2-backed Loki and Tempo storage with Alloy collecting container logs and OpenTelemetry traces.",
		"Alertmanager routing with warning, critical, and page-level escalation paths.",
	],
	"flaunch-web2-token-launch-api": [
		"Kamal roles for API and transaction worker containers.",
		"Caddy metrics proxy accessory for OpenTelemetry and Prometheus flow.",
		"PM2-managed Node processes with healthchecked environment-specific deploys.",
	],
	"flaunch-admin-revenue-operations-dashboard": [
		"Scheduled and manual GitHub Actions collectors for revenue operations.",
		"Dry-run and missing-window recovery modes for reporting backfill.",
		"Warehouse-backed metrics surfaced through a protected Next.js admin app.",
	],
	"flaunch-edge-token-image-worker": [
		"Wrangler staging and production workflows for Worker deploys.",
		"KV-backed edge cache and image transformation path.",
		"Worker secrets and namespace identifiers kept outside source control.",
	],
	"distributed-performance-testing-platform": [
		"GitHub Actions matrix deploys regional Kamal agents.",
		"Docker Compose local stack and Cloudflare Tunnel-backed agent access.",
		"CI performance gates, k6 browser agents, and dashboard containers.",
	],
	"reflaunch-backend-api-realtime-platform": [
		"Envio-to-Redis stream ingestion for product state.",
		"Dedicated stream consumer connection and atomic Redis updates.",
		"WebSocket fanout via Redis Pub/Sub and Postgres notifications.",
		"V2 API keys, rate limits, usage metering, and admin controls.",
		"Neon preview branches with Prisma migration guardrails.",
	],
	"meebmarket-cloudflare-nft-marketplace": [
		"Wrangler deploy path runs TypeScript checks before building and publishing the Worker.",
		"Cloudflare bindings define the application boundary: Worker assets, D1, KV, R2, Images, Durable Object, and cron.",
		"Provisioning and migration scripts make the Cloudflare setup repeatable instead of dashboard-only knowledge.",
		"Dynamic OG images and server-side SEO metadata are generated at the edge and cached aggressively.",
	],
};

const deploymentParagraphs = {
	"flaunchy-openclaw-launch-assistant": [
		"The deployment story was intentionally lightweight rather than platform-heavy. The bot work used OpenClaw's scheduled and heartbeat model for agent routines, with Node services packaged so individual transports could be operated and restarted independently.",
		"For the social monitor, the repository includes a systemd unit with environment-file based configuration, journal logging, and an automatic restart policy. That matters because a public conversation channel needs boring reliability: if a provider hiccups or a process exits, the service should recover without a person noticing first.",
		"The public-safe lesson is that agent products still need normal operations work. We separated channel concerns, kept credentials out of code, and left enough logging around decisions, replies, and skipped actions that the team could review behaviour without exposing private prompt or account details.",
	],
	"flaunch-media-moderation-api": [
		"Deployment is handled through GitHub Actions, GitHub Container Registry, Docker, and Kamal. The workflow builds a container, prepares runtime configuration from repository secrets, releases stale deploy locks, bootstraps the target when needed, pushes environment values, and rolls the service forward through Kamal.",
		"The app itself is deployed as a healthchecked API service, which is important for a moderation dependency: callers need a predictable pass, flag, or fail path, and operators need an obvious signal if the review service is unavailable.",
		"In the public case study, the right level of detail is the pattern: containerised FastAPI moderation, reviewed deploys, secret-backed runtime configuration, and health checks. Hostnames, keys, provider settings, and moderation threshold internals should stay private.",
	],
	"dynamic-nft-metadata-token-art-api": [
		"GitHub Actions builds Docker images, pushes them to GHCR, and deploys with Kamal. The repository keeps separate Kamal configs for different environments and networks so product routing can move without turning every deploy into a manual checklist.",
		"The deploy path includes server bootstrap, environment push, stale lock recovery, container registry auth, and service health checks. That is worth naming because metadata services are often treated as simple APIs even though they sit on the path for marketplaces, embeds, and user trust.",
		"The deeper story is a product reliability layer: dynamic art generation, backwards-compatible routes, environment-aware deployment, and a release process that lets the team change contract or network support with less operational drama.",
	],
	"graphql-data-proxy-web3-products": [
		"Deployment work here is the project, not just a footnote. The proxy is packaged as a Varnish container, with NGINX and Varnish config in version control and GitHub Actions driving a Kamal rollout through GHCR.",
		"The config includes health endpoints, response normalisation, request-aware cache behaviour, and routing concerns that should be discussed only at the capability level. Exact backend mappings, host groups, cache limits, labels, and upstream provider details should stay out of public copy.",
		"The story for prospects is that Simple Things can turn production routing from a hand-edited risk into a reviewed artifact: Docker image, registry, deploy workflow, edge cache behaviour, and rollback-friendly operations.",
	],
	"instameme-mobile-token-creation": [
		"There were no bespoke GitHub deployment workflows in the repo. The app is built as a Next.js mobile PWA surface with the standard Next build and start path, making it suitable for a managed deployment platform while the product work sits in the app structure.",
		"The operational details are still useful: PWA generation, runtime caching choices that avoid caching auth and wallet-sensitive paths, CSP headers, image host allow-listing, and React Strict Mode all show the care needed for a consumer crypto front end.",
		"The case study should avoid implying a heavy custom deployment pipeline where one is not present. The stronger angle is mobile product delivery: a deployable Next.js app with security headers and app-like affordances designed around token creation.",
	],
	"edge-proxy-configuration-manager": [
		"This repo is deployment tooling around HAProxy. Make targets and the Go configuration manager generate candidate configs, compare them with running config, upload to a temporary location, validate with HAProxy, and then promote and reload only after the candidate passes.",
		"GitHub Actions exists as the repeatable deployment entry point, while the local Make tasks give operators a controlled way to build, diff, test, and target changes. That combination is a good case study detail because it shows how infrastructure teams reduce live-change risk.",
		"Public copy should describe the pattern: version-controlled proxy config, remote validation, controlled reloads, and auditability. Stats paths, socket paths, server names, IPs, backend layout, and certificate-specific details should not be published.",
	],
	"flaunch-fee-simulator": [
		"The fee simulator is a Cloudflare-native deploy: Wrangler deploys the Worker, D1 migrations manage the database shape, KV backs cacheable lookups, and scheduled Worker execution keeps token context fresh in the background.",
		"The GitHub Actions workflow uses the Wrangler action rather than a custom server deploy. That is worth calling out because campaign and simulator products often benefit from edge deployment, quick rollbacks, and a small operational surface.",
		"The deeper content should explain the product-operating model: fast static-like pages, a Worker API, durable D1 data, KV caching, scheduled sync, type generation, and dynamic Open Graph output. Database IDs, cache namespaces, cron expressions, and secret values should stay private.",
	],
	"infrastructure-management-operational-map": [
		{ style: "h2", text: "Operating model" },
		"The project has two connected halves. The first is governance: OpenTofu with remote state, GitHub Actions plan and apply workflows, pull request review, saved-plan applies, and careful import work so infrastructure changes are reviewed instead of made only through dashboards.",
		"The second half is the reporting plane. Prometheus, Grafana, Loki, Tempo, Alloy, Alertmanager, and synthetic checks sit beside the production services as a sideband observability system. The goal is not to add another dashboard. The goal is one place where an operator can answer whether the product is healthy, where it is slow, and what evidence explains the symptom.",
		{ style: "h2", text: "Prometheus scrape design" },
		"Prometheus is treated as a dedicated control point rather than an afterthought inside each service. The configuration groups jobs by job purpose: application metrics, Kamal or proxy metrics, node exporters, Redis checks, RPC checks, public website probes, GraphQL freshness checks, and SSL expiry checks.",
		"Scrape cadence is tuned by signal. Fast-moving service and external-response probes run more frequently, RPC node checks run on a short cadence because chain access is product-critical, standard app and host exporters run at a normal operational interval, public website blackbox probes run slightly slower, and database or slower dependency checks are kept less noisy.",
		"The health checks are intentionally content-aware. RPC checks perform real JSON-RPC calls rather than only testing TCP reachability. GraphQL checks validate response bodies and index freshness instead of only accepting a 200 response. That matters because the user-facing failure mode is often stale data or a bad upstream response, not a dead server.",
		{ style: "h2", text: "Visual reporting" },
		"Grafana is the operator surface. The dashboards are arranged around glance rows first: public origins, proxy targets, app targets, Redis, request rate, 4xx percentage, 5xx percentage, p95 latency, and host capacity. That lets someone decide quickly whether they are looking at a site problem, an API problem, a dependency problem, or a capacity problem.",
		"Deeper rows turn that glance into diagnosis. Panels break traffic down by route, status, instance, and region. Slow routes are ranked. Dependency latency and dependency errors are separated from application latency. Redis internals and host resources sit beside request metrics so the dashboard can show whether symptoms line up across layers.",
		"Service-specific dashboards go further where needed. For the Web2 API, the reporting surface includes RPC operation health, dependency latency, dependency errors, queue behaviour, Node runtime signals, and request geography from Cloudflare country context. That makes the dashboard useful for product and operations, not only infrastructure.",
		{ style: "h2", text: "Logs, traces, and evidence" },
		"Grafana Alloy collects structured Docker container logs and labels them by service, environment, region, instance, and container before shipping them to Loki. The retention model uses R2-backed long-term storage with a compacted index and bounded retention, giving enough time for incident review without turning logs into an unmanaged archive.",
		"Application traces flow over OTLP/HTTP into host-level Alloy, then into Tempo with R2-backed retention. Slow request and slow dependency thresholds are emitted as first-class signals, so traces, logs, and metrics describe the same operational event from different angles.",
		"The Grafana experience connects those angles. Derived fields turn trace IDs in logs into links to traces. Trace views link back to the matching logs. Traces can also link to relevant metrics over the same time window. The result is a practical investigation path: start from a dashboard symptom, jump to logs or traces, and come back to the metric context without manually rebuilding filters.",
		{ style: "h2", text: "Synthetic checks and alerting" },
		"The front-of-house checks cover public websites separately from backend health endpoints. Blackbox probes answer whether users can reach the public surfaces. Service health endpoints answer whether the app believes it is ready. RPC and GraphQL probes answer whether critical data paths are returning useful content.",
		"Alertmanager separates warning, critical, and page-level routes. The rules focus on symptoms that matter: sustained 5xx rate, high p95 latency, service quorum loss, host capacity risk, RPC failure rate, all-RPC failure, queue backlog, stalled work, and SSL expiry windows. That keeps alerts closer to user impact and further away from one-off noise.",
		{ style: "h2", text: "Access and deployment discipline" },
		"The observability plane is deliberately separate from public traffic. Metrics access is allowlisted at the firewall, human access travels through private access paths, and public services do not need to expose their internal metrics endpoints directly. Prometheus configuration is pushed as a reviewed artifact and reloaded in place, rather than requiring ad hoc manual edits on the server.",
		"That operational discipline is part of the project value. Infrastructure-as-code gives the team reviewable change. Prometheus and Grafana give them visual reporting. Loki and Tempo give them evidence. Alertmanager gives them escalation. The combined system makes production feel less like a collection of machines and more like a service with a readable heartbeat.",
		{ style: "h2", text: "Public-safe boundary" },
		"The useful public story is the architecture and operating model: reviewed infrastructure changes, sideband observability, Prometheus jobs, Grafana dashboards, Loki logs, Tempo traces, Alloy collection, synthetic probes, R2-backed retention, and alert routing.",
		"What should stay private is the map itself: exact hostnames, IP addresses, bucket names, account identifiers, tunnel names, service inventory, provider URLs, webhook routes, SMS configuration, bearer tokens, credentials, and any internal routing details that could help someone target the system.",
	],
	"flaunch-web2-token-launch-api": [
		"Deployment is a mature part of this backend. GitHub Actions builds and releases through GHCR and Kamal 2, while the Docker image can run the API server or the transaction worker role from the same codebase.",
		"The Kamal configs separate roles and environments, include health checks, and use a Caddy metrics-proxy accessory so metrics and traces can flow into the wider observability estate without coupling every service directly to the collection topology.",
		"That lets the case study talk about a production-grade launch API: asynchronous work queues, PM2-managed Node processes, environment-specific deploys, healthchecked services, and observability. Host aliases, metrics endpoints, secrets, and provider details should stay private.",
	],
	"flaunch-admin-revenue-operations-dashboard": [
		"The dashboard itself is a private Next.js app, but the interesting operational work is in scheduled and manual GitHub Actions. Revenue and protocol collectors can be run on a timetable, triggered by hand, scoped to missing windows, or dry-run for backfill and repair.",
		"That pattern matters for business reporting. Instead of treating data gaps as spreadsheet cleanup, the repo gives the team repeatable collection jobs, summaries, and controlled recovery paths against a warehouse-backed reporting model.",
		"Public copy should frame this as revenue operations infrastructure: protected admin UI, scheduled collectors, manual backfill workflows, warehouse reporting, and clear failure summaries. Dataset names, protected API routes, and collector internals that could invite abuse should stay private.",
	],
	"flaunch-edge-token-image-worker": [
		"The image service is deployed through Cloudflare Workers with Wrangler. GitHub Actions supports staging and production deploy paths, while KV namespaces and Worker secrets are configured outside source control.",
		"The Worker architecture gives the product stable URLs at the edge: resolve metadata, choose an image source, apply resizing and format behaviour, cache where appropriate, and fall back when upstream media is missing or flagged.",
		"This is a good place to show Cloudflare capability without leaking implementation keys: Workers, KV, edge image resizing, environment-specific deploys, cache invalidation, and operational logs. Account IDs, namespace IDs, route lists, WAF bypass mechanics, and purge tokens should not be published.",
	],
	"distributed-performance-testing-platform": [
		"Deployment is deliberately distributed. GitHub Actions runs a matrix deployment for regional agents, installs Kamal 2, prepares SSH access, bootstraps servers, starts accessories, deploys agent containers, and publishes deployment summaries.",
		"The platform also includes Docker Compose for local operation, NGINX for the dashboard container, k6 browser-capable agent images, Cloudflare Tunnel-based access, and health checks across the controller, agents, and data stores.",
		"The case study can go deeper on delivery assurance: performance gates in CI, reusable presets, regional agent rollouts, metrics retention, Grafana dashboards, and operator-friendly summaries. Exact agent endpoints, regions, tunnel names, targets, and credentials should remain private.",
	],
	"reflaunch-backend-api-realtime-platform": [
		"The runtime architecture is built around a hot Redis product model. Envio publishes indexed event categories into Redis Streams, and the backend consumes them into sorted sets, token hashes, owner reverse indexes, WebSocket backfill lists, and protocol-level counters so common product reads avoid expensive indexer round trips.",
		"Bootstrap is the repair path and streams are the incremental path. On startup, the backend can rebuild token state from the indexer, refresh high-impact rows, remove banned or buried tokens from the appropriate public surfaces, seed protocol stats, hydrate recent trade timestamps, and then hand over to the stream consumer for live updates.",
		"The stream consumer uses a dedicated Redis connection because blocking consumer-group reads should not hold the same connection used by HTTP handlers. Stream events update rankings, eligibility, holders, owners, fees, volume, OHLCV dirty flags, and user-specific caches. The WebSocket callback fires before the slower cache writes so live clients feel immediate.",
		"V2 is a scoped Fastify plugin rather than a second backend. It reuses the same Redis, Postgres, and HyperIndex data paths, while adding API key auth, Google portal auth, Redis rate-limit windows, usage metering, account/admin surfaces, OpenAPI documentation, and a background flusher that drains usage counters into Postgres.",
		"The backend has one of the richest deployment stories. Main, staging, develop, preview, preview cleanup, Neon branch, orphan cleanup, and reset workflows coordinate GHCR images, Kamal 2 rollouts, health checks, Caddy metrics proxying, Prisma migration recovery, branch-specific Neon contexts, and release summaries.",
		"Public copy should describe the pattern without exposing the coordinates of the system. Exact hosts, database URLs, Neon project identifiers, Redis URLs, indexer URLs, RPC keys, internal route maps, metrics tokens, and private admin surfaces should stay private.",
	],
	"meebmarket-cloudflare-nft-marketplace": [
		{ style: "h2", text: "Deployment model" },
		"Deployment is intentionally Cloudflare-native. There are no repository-level GitHub Actions in the current repo; the release path is the local or CI-friendly command path of tsc --noEmit, vite build, and wrangler deploy. That keeps the deploy small, direct, and aligned with the platform that actually runs the application.",
		"The Worker is configured to run before static assets and then fall back to the SPA shell. That allows the same Cloudflare deployment to own JSON API routes, canonical redirects, robots and sitemap responses, OG images, HTMLRewriter metadata injection, and React application delivery without a separate Node server.",
		"D1 migrations own the product schema, while the provisioner script creates or wires the core Cloudflare resources for a fresh environment. Bulk data and media jobs are handled through explicit scripts: seed fetch/apply for the 20,000-token catalogue, Cloudflare Images upload for renders, and skin-tone extraction for collection-specific browsing metadata.",
		"The public case study should describe this as a low-ops deployment model: Workers, assets, D1, KV, R2, Images, Durable Objects, cron, Wrangler, migrations, observability, and runbooks. It should not publish database IDs, namespace IDs, account hashes unless deliberately public, secret names beyond generic categories, admin secrets, or provider tokens.",
	],
};

const projectFields = [
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

function portableText(paragraphs) {
	return paragraphs.map((block, index) => {
		const value =
			typeof block === "string" ? { style: "normal", text: block } : block;
		return {
			_type: "block",
			_key: `draft${index + 1}`,
			style: value.style || "normal",
			markDefs: [],
			children: [
				{
					_type: "span",
					_key: `draft${index + 1}s`,
					text: value.text,
					marks: [],
				},
			],
		};
	});
}

function mergeUnique(...groups) {
	return Array.from(new Set(groups.flat().filter(Boolean)));
}

function dataFor(project) {
	const stack = mergeUnique(project.stack, deploymentStacks[project.slug] ?? []);
	const technicalHighlights = mergeUnique(
		project.technical_highlights,
		deploymentHighlights[project.slug] ?? [],
	);
	const paragraphs = [
		...project.paragraphs,
		...(deploymentParagraphs[project.slug] ?? []),
	];

	return {
		title: project.title,
		summary: project.summary,
		featured_image: null,
		client: project.client,
		year: project.year,
		project_status: "Draft case study",
		stack,
		business_benefits: project.business_benefits,
		technical_highlights: technicalHighlights,
		content: portableText(paragraphs),
		gallery: [],
		url: project.url || null,
		repo_url: project.repo_url || null,
	};
}

function sqlString(value) {
	if (value === null || value === undefined) return "NULL";
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
	return sqlString(JSON.stringify(value));
}

function fieldSqlValue(field, data) {
	const value = data[field];
	if (Array.isArray(value) || (value && typeof value === "object")) {
		return sqlJson(value);
	}
	return sqlString(value);
}

const statements = [];

for (const slug of oldProjectSlugs) {
	statements.push(`
UPDATE ec_projects
SET status = 'draft',
	published_at = NULL,
	live_revision_id = NULL,
	draft_revision_id = COALESCE(draft_revision_id, live_revision_id),
	project_status = 'Technical note',
	updated_at = ${sqlString(NOW)}
WHERE slug = ${sqlString(slug)}
	AND locale = 'en'
	AND deleted_at IS NULL;`);
}

for (const project of projects) {
	const id = ulid();
	const revisionId = ulid();
	const data = dataFor(project);
	const columns = [
		"id",
		"slug",
		"status",
		"author_id",
		"created_at",
		"updated_at",
		"published_at",
		"version",
		"locale",
		"translation_group",
		...projectFields,
	];
	const values = [
		sqlString(id),
		sqlString(project.slug),
		"'draft'",
		sqlString(AUTHOR_ID),
		sqlString(NOW),
		sqlString(NOW),
		"NULL",
		"1",
		"'en'",
		sqlString(id),
		...projectFields.map((field) => fieldSqlValue(field, data)),
	];
	const updateFields = [
		"status = 'draft'",
		`author_id = ${sqlString(AUTHOR_ID)}`,
		"published_at = NULL",
		"scheduled_at = NULL",
		"live_revision_id = NULL",
		`updated_at = ${sqlString(NOW)}`,
		...projectFields.map((field) => `${field} = excluded.${field}`),
	];

	statements.push(`
INSERT INTO ec_projects (${columns.join(", ")})
VALUES (${values.join(", ")})
ON CONFLICT(slug, locale) DO UPDATE SET
	${updateFields.join(",\n\t")};`);

	statements.push(`
INSERT INTO revisions (id, collection, entry_id, data, author_id)
VALUES (
	${sqlString(revisionId)},
	'projects',
	(SELECT id FROM ec_projects WHERE slug = ${sqlString(project.slug)} AND locale = 'en'),
	${sqlJson(data)},
	${sqlString(AUTHOR_ID)}
);`);

	statements.push(`
UPDATE ec_projects
SET draft_revision_id = ${sqlString(revisionId)},
	updated_at = ${sqlString(NOW)}
WHERE slug = ${sqlString(project.slug)}
	AND locale = 'en'
	AND deleted_at IS NULL;`);
}

const sql = `${statements.join("\n")}\n`;

if (process.argv.includes("--print")) {
	process.stdout.write(sql);
	process.exit(0);
}

const dir = mkdtempSync(join(tmpdir(), "simplethings-project-drafts-"));
const file = join(dir, "drafts.sql");
writeFileSync(file, sql, "utf8");

const result = spawnSync(
	"npx",
	["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file],
	{
		stdio: "inherit",
	},
);

process.exit(result.status ?? 1);
