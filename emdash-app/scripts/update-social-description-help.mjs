import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DB_NAME = "simplethings-cms-prod";
const HELP_TEXT =
	"Used as the default social/SEO description when no custom SEO description is set. Social preview images clip this on display, so keep the important words near the start.";

function sqlString(value) {
	return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
	return sqlString(JSON.stringify(value));
}

const validation = { helpText: HELP_TEXT };

const sql = `
UPDATE _emdash_fields
SET validation = ${sqlJson(validation)}
WHERE slug = 'summary'
	AND collection_id = (SELECT id FROM _emdash_collections WHERE slug = 'projects');

UPDATE _emdash_fields
SET validation = ${sqlJson(validation)}
WHERE slug = 'excerpt'
	AND collection_id = (SELECT id FROM _emdash_collections WHERE slug = 'posts');
`;

const dir = mkdtempSync(join(tmpdir(), "simplethings-social-description-help-"));
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
