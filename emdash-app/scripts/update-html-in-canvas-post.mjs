import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { monotonicFactory } from "ulidx";

const DB_NAME = "simplethings-cms-prod";
const POST_ID = "01KTJ1E6ANRMC990MQMHVTXRY5";
const AUTHOR_ID = "01KT9TQNGGEBT4B2E9HEFTEFSD";
const DRAFT_PATH = new URL("../drafts/putting-html-in-orbit-with-canvas.md", import.meta.url);
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

function parseDraft(markdown) {
	const [header = "", body = ""] = markdown.replace(/\r\n/g, "\n").split(/\n---\n/);
	const headerLines = header.split("\n").map((line) => line.trim()).filter(Boolean);
	const title = headerLines[0]?.replace(/^#\s+/, "").trim();
	const metadata = {};

	for (const line of headerLines.slice(1)) {
		const match = line.match(/^([^:]+):\s*(.*)$/);
		if (match) metadata[match[1].toLowerCase()] = match[2].trim();
	}

	return {
		title,
		excerpt: metadata.description,
		slug: metadata.slug,
		date: `${metadata.date}T20:00:00.000Z`,
		socialDraft: metadata["social draft"],
		body,
	};
}

function pushSpan(children, text, marks = []) {
	if (!text) return;
	const previous = children[children.length - 1];
	if (previous && arraysEqual(previous.marks || [], marks)) {
		previous.text += text;
		return;
	}

	children.push({
		_type: "span",
		_key: key("s"),
		text,
		marks,
	});
}

function arraysEqual(left, right) {
	return left.length === right.length && left.every((value, index) => value === right[index]);
}

function parseInline(text) {
	const children = [];
	const markDefs = [];
	let index = 0;

	while (index < text.length) {
		if (text[index] === "`") {
			const end = text.indexOf("`", index + 1);
			if (end !== -1) {
				pushSpan(children, text.slice(index + 1, end), ["code"]);
				index = end + 1;
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

		const nextSpecial = ["`", "[", "**"]
			.map((token) => text.indexOf(token, index + 1))
			.filter((position) => position !== -1)
			.sort((a, b) => a - b)[0] ?? text.length;
		pushSpan(children, text.slice(index, nextSpecial), []);
		index = nextSpecial;
	}

	return { children, markDefs };
}

function makeBlock(text, options = {}) {
	const { children, markDefs } = parseInline(text);
	return {
		_type: "block",
		_key: key("b"),
		style: options.style || "normal",
		markDefs,
		...(options.listItem ? { listItem: options.listItem, level: 1 } : {}),
		children,
	};
}

function demoBlock() {
	return {
		_type: "demo",
		_key: key("d"),
		title: "HTML-in-Canvas orbital mechanics demo",
		description:
			"Run the orbital mechanics example from this article. Stable browsers use a DOM overlay fallback; Chrome Canary with HTML-in-Canvas enabled can draw the same controls through the canvas path.",
		url: "/examples/html-in-canvas-orbits",
		label: "Open showcase page",
		embed_url: "/demos/html-in-canvas-orbits",
		height: 680,
	};
}

function markdownToPortableText(markdown) {
	const blocks = [];
	const lines = markdown.split("\n");
	let paragraph = [];

	function flushParagraph() {
		if (!paragraph.length) return;
		const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
		paragraph = [];
		if (!text) return;

		if (text === "[Open the runnable orbital demo](/examples/html-in-canvas-orbits)") {
			blocks.push(demoBlock());
			return;
		}

		blocks.push(makeBlock(text));
	}

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		const trimmed = line.trim();

		if (!trimmed) {
			flushParagraph();
			continue;
		}

		const fence = trimmed.match(/^```([a-z0-9_-]*)$/i);
		if (fence) {
			flushParagraph();
			const codeLines = [];
			index += 1;
			while (index < lines.length && !lines[index].trim().startsWith("```")) {
				codeLines.push(lines[index]);
				index += 1;
			}
			const language = fence[1] === "txt" ? "text" : fence[1];
			blocks.push({
				_type: "code",
				_key: key("c"),
				...(language ? { language } : {}),
				code: codeLines.join("\n"),
			});
			continue;
		}

		const heading = trimmed.match(/^(#{2,6})\s+(.+)$/);
		if (heading) {
			flushParagraph();
			blocks.push(makeBlock(heading[2].trim(), { style: `h${Math.min(6, heading[1].length)}` }));
			continue;
		}

		const bullet = trimmed.match(/^-\s+(.+)$/);
		if (bullet) {
			flushParagraph();
			blocks.push(makeBlock(bullet[1].trim(), { listItem: "bullet" }));
			continue;
		}

		const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
		if (numbered) {
			flushParagraph();
			blocks.push(makeBlock(numbered[1].trim(), { listItem: "number" }));
			continue;
		}

		paragraph.push(trimmed);
	}

	flushParagraph();
	return blocks;
}

const draft = parseDraft(readFileSync(DRAFT_PATH, "utf8"));
const revisionId = ulid();
const content = markdownToPortableText(draft.body);
const revisionData = {
	title: draft.title,
	excerpt: draft.excerpt,
	date: draft.date,
	content,
};

if (!draft.title || !draft.excerpt || !draft.slug || !draft.date || !draft.socialDraft) {
	throw new Error(`Missing draft metadata in ${DRAFT_PATH.pathname}`);
}

const sql = `
INSERT INTO revisions (id, collection, entry_id, data, author_id, created_at)
VALUES (
	${sqlString(revisionId)},
	'posts',
	${sqlString(POST_ID)},
	${sqlJson(revisionData)},
	${sqlString(AUTHOR_ID)},
	${sqlString(NOW)}
);

UPDATE ec_posts
SET title = ${sqlString(draft.title)},
	excerpt = ${sqlString(draft.excerpt)},
	date = ${sqlString(draft.date)},
	content = ${sqlJson(content)},
	social_draft = ${sqlString(draft.socialDraft)},
	live_revision_id = ${sqlString(revisionId)},
	updated_at = ${sqlString(NOW)},
	version = COALESCE(version, 1) + 1
WHERE id = ${sqlString(POST_ID)}
	AND slug = ${sqlString(draft.slug)}
	AND locale = 'en'
	AND deleted_at IS NULL;
`;

if (process.argv.includes("--print")) {
	process.stdout.write(sql);
	process.exit(0);
}

const dir = mkdtempSync(join(tmpdir(), "simplethings-html-in-canvas-post-"));
const file = join(dir, "update.sql");
writeFileSync(file, sql, "utf8");

console.log(`Updating ${draft.slug} with ${content.length} Portable Text blocks.`);
console.log(`Revision: ${revisionId}`);

const result = spawnSync(
	"npx",
	["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file],
	{
		encoding: "utf8",
		stdio: "inherit",
	},
);

process.exit(result.status ?? 1);
