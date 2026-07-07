import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DB_NAME = "simplethings-cms-prod";

const settings = {
	"site:tagline": "Technical architecture for calmer, faster delivery.",
};

function sqlString(value) {
	return `'${String(value).replaceAll("'", "''")}'`;
}

const sql = Object.entries(settings)
	.map(([name, value]) => {
		const jsonValue = JSON.stringify(value);
		return `
INSERT INTO options (name, value)
VALUES (${sqlString(name)}, ${sqlString(jsonValue)})
ON CONFLICT(name) DO UPDATE SET value = excluded.value;
`;
	})
	.join("\n");

const dir = mkdtempSync(join(tmpdir(), "simplethings-brand-settings-"));
const file = join(dir, "update.sql");
writeFileSync(file, sql);

const result = spawnSync("npx", ["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", file], {
	encoding: "utf8",
	stdio: "inherit",
});

process.exit(result.status ?? 1);
