import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { EmDashClient } from "emdash/client";

const baseUrl = process.env.EMDASH_URL || "https://simplethin.gs";
const token = process.env.EMDASH_TOKEN || storedToken(baseUrl);
const client = new EmDashClient({ baseUrl, token });

const blockTypes = [
	{
		slug: "hero",
		label: "Hero",
		description: "Large introductory heading, summary and primary actions.",
		category: "Homepage",
		fields: [
			{ slug: "eyebrow", label: "Eyebrow", type: "string" },
			{ slug: "title", label: "Title", type: "string", required: true },
			{ slug: "summary", label: "Summary", type: "text" },
			{ slug: "primary_label", label: "Primary link label", type: "string" },
			{ slug: "primary_url", label: "Primary link URL", type: "url" },
			{ slug: "secondary_label", label: "Secondary link label", type: "string" },
			{ slug: "secondary_url", label: "Secondary link URL", type: "url" },
			{ slug: "items", label: "Working notes", type: "text" },
			{
				slug: "variant",
				label: "Visual variant",
				type: "select",
				validation: { options: ["default", "field", "compact"] },
			},
		],
	},
	{
		slug: "steps",
		label: "Steps",
		description: "A short ordered process.",
		category: "Homepage",
		fields: [
			{ slug: "eyebrow", label: "Eyebrow", type: "string" },
			{ slug: "title", label: "Title", type: "string", required: true },
			{ slug: "items", label: "Steps", type: "text", required: true },
		],
	},
	{
		slug: "services",
		label: "Services",
		description: "Manual service cards and an optional overview link.",
		category: "Homepage",
		fields: [
			{ slug: "title", label: "Title", type: "string", required: true },
			{ slug: "primary_label", label: "Overview link label", type: "string" },
			{ slug: "primary_url", label: "Overview link URL", type: "url" },
			{ slug: "items", label: "Services", type: "text", required: true },
		],
	},
	{
		slug: "projects",
		label: "Project listing",
		description: "Latest project cards from the Projects collection.",
		category: "Homepage",
		fields: [
			{ slug: "title", label: "Title", type: "string", required: true },
			{ slug: "primary_label", label: "Overview link label", type: "string" },
			{ slug: "primary_url", label: "Overview link URL", type: "url" },
			{ slug: "limit", label: "Item limit", type: "integer" },
		],
	},
	{
		slug: "posts",
		label: "Post listing",
		description: "Latest articles from the Posts collection.",
		category: "Homepage",
		fields: [
			{ slug: "title", label: "Title", type: "string", required: true },
			{ slug: "primary_label", label: "Overview link label", type: "string" },
			{ slug: "primary_url", label: "Overview link URL", type: "url" },
			{ slug: "limit", label: "Item limit", type: "integer" },
		],
	},
	{
		slug: "rich_text",
		label: "Text section",
		description: "A heading, introduction and freeform body copy.",
		category: "Homepage",
		fields: [
			{ slug: "eyebrow", label: "Eyebrow", type: "string" },
			{ slug: "title", label: "Title", type: "string", required: true },
			{ slug: "summary", label: "Summary", type: "text" },
			{ slug: "body", label: "Body", type: "text" },
		],
	},
	{
		slug: "cta",
		label: "Call to action",
		description: "A focused closing message with up to two actions.",
		category: "Homepage",
		fields: [
			{ slug: "eyebrow", label: "Eyebrow", type: "string" },
			{ slug: "title", label: "Title", type: "string", required: true },
			{ slug: "summary", label: "Summary", type: "text" },
			{ slug: "primary_label", label: "Primary link label", type: "string" },
			{ slug: "primary_url", label: "Primary link URL", type: "url" },
			{ slug: "secondary_label", label: "Secondary link label", type: "string" },
			{ slug: "secondary_url", label: "Secondary link URL", type: "url" },
		],
	},
];

const existingBlockTypes = new Set((await client.blockTypes()).map((blockType) => blockType.slug));
for (const blockType of blockTypes) {
	if (existingBlockTypes.has(blockType.slug)) continue;
	await client.createBlockType(blockType);
	console.log(`Created block type: ${blockType.slug}`);
}

const relationList = await api("/_emdash/api/relations");
if (!relationList.relations.some((relation) => relation.slug === "post_projects")) {
	await api("/_emdash/api/relations", {
		method: "POST",
		body: {
			slug: "post_projects",
			parentCollection: "posts",
			childCollection: "projects",
			parentLabel: "Related posts",
			parentLabelSingular: "Related post",
			childLabel: "Related projects",
			childLabelSingular: "Related project",
			maxChildrenPerParent: 6,
			maxParentsPerChild: 6,
		},
	});
	console.log("Created relation: post_projects");
}

await ensureField("pages", {
	slug: "layout",
	label: "Page layout",
	type: "blocks",
	validation: {
		helpText:
			"Compose the homepage from reusable, typed sections. The legacy sections field remains available during the migration window.",
		allowedTypes: blockTypes.map((blockType) => blockType.slug),
	},
});

await ensureField("posts", {
	slug: "related_projects",
	label: "Related projects",
	type: "reference",
	validation: {
		targetCollection: "projects",
		multiple: true,
		relation: "post_projects",
		relationSide: "parent",
	},
});

await ensureField("projects", {
	slug: "related_posts",
	label: "Related posts",
	type: "reference",
	validation: {
		targetCollection: "posts",
		multiple: true,
		relation: "post_projects",
		relationSide: "child",
	},
});

await Promise.all([
	updateCollection("pages", {
		admin: { listColumns: [], quickCreate: true },
		sortOrder: 10,
		group: "Content",
		titleField: "title",
	}),
	updateCollection("posts", {
		admin: { listColumns: ["excerpt"], quickCreate: true },
		sortOrder: 20,
		group: "Content",
		titleField: "title",
		dateField: "date",
	}),
	updateCollection("projects", {
		admin: { listColumns: ["project_status", "year", "client"], quickCreate: true },
		sortOrder: 30,
		group: "Content",
		titleField: "title",
	}),
]);

const home = await client.get("pages", "home", { raw: true });
if (!Array.isArray(home.data.layout) || home.data.layout.length === 0) {
	const sections = Array.isArray(home.data.sections) ? home.data.sections : [];
	const layout = sections.map(({ type, source: _source, ...fields }) => ({
		_type: type,
		_version: 1,
		...fields,
	}));
	if (layout.length > 0) {
		await client.update("pages", home.id, {
			data: { ...home.data, layout },
			_rev: home._rev,
			replaceBlocks: true,
			overrideLock: true,
		});
		await client.publish("pages", home.id, { overrideLock: true });
		console.log(`Migrated ${layout.length} homepage sections to blocks`);
	}
}

await ensureRedirect("/posts", "/blog");
await ensureRedirect("/work", "/projects");

const post = await client.get("posts", "see-your-website-the-way-chatgpt-does", { raw: true });
const project = await client.get("projects", "aeo-audit", { raw: true });
await api(`/_emdash/api/content/posts/${encodeURIComponent(post.id)}`, {
	method: "PUT",
	body: {
		references: { related_projects: [project.id] },
		_rev: post._rev,
		overrideLock: true,
	},
});
await client.publish("posts", post.id, { overrideLock: true });
console.log("Linked the AEO Audit article and project as a live relation example");

console.log("EmDash 1.0 schema and content features configured.");

async function ensureField(collection, field) {
	const schema = await client.collection(collection);
	if (schema.fields.some((existing) => existing.slug === field.slug)) return;
	await client.createField(collection, field);
	console.log(`Created field: ${collection}.${field.slug}`);
}

async function updateCollection(collection, body) {
	await api(`/_emdash/api/schema/collections/${encodeURIComponent(collection)}`, {
		method: "PUT",
		body,
	});
	console.log(`Updated collection admin settings: ${collection}`);
}

async function ensureRedirect(source, destination) {
	const list = await api(`/_emdash/api/redirects?search=${encodeURIComponent(source)}&limit=100`);
	if (list.items.some((item) => item.source === source)) return;
	await api("/_emdash/api/redirects", {
		method: "POST",
		body: { source, destination, type: 301, enabled: true, groupName: "Legacy paths" },
	});
	console.log(`Created redirect: ${source} -> ${destination}`);
}

async function api(path, options = {}) {
	const response = await fetch(new URL(path, baseUrl), {
		method: options.method || "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			...(options.body ? { "Content-Type": "application/json" } : {}),
		},
		body: options.body ? JSON.stringify(options.body) : undefined,
	});
	const payload = await response.json();
	if (!response.ok || payload.success === false) {
		throw new Error(`${options.method || "GET"} ${path} failed: ${JSON.stringify(payload)}`);
	}
	return payload.data;
}

function storedToken(url) {
	const authPath = join(homedir(), ".config", "emdash", "auth.json");
	const credentials = JSON.parse(readFileSync(authPath, "utf8"));
	const credential = credentials[new URL(url).origin];
	if (!credential?.accessToken) throw new Error(`No stored EmDash login for ${url}`);
	return credential.accessToken;
}
