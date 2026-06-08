import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const title = args.find((arg) => !arg.startsWith("--"));

if (!title) {
  console.error('Usage: npm run content:new -- "Post title" --tweet "https://x.com/..." --link "https://example.com"');
  process.exit(1);
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : "";
}

function valuesAfter(flag) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function yamlString(value) {
  return JSON.stringify(value || "");
}

const slug = slugify(title);
const destination = path.join(process.cwd(), "content/posts", `${slug}.mdx`);

if (fs.existsSync(destination)) {
  console.error(`Post already exists: ${destination}`);
  process.exit(1);
}

const links = valuesAfter("--link");
const now = new Date().toISOString();
const frontmatter = [
  "---",
  `title: ${yamlString(title)}`,
  'description: ""',
  `date: ${yamlString(now)}`,
  'author: "Justin Avery"',
  'coverImage: ""',
  `coverAlt: ${yamlString(title)}`,
  "tags: []",
  `tweetUrl: ${yamlString(valueAfter("--tweet"))}`,
  links.length > 0 ? `links:\n${links.map((link) => `  - ${yamlString(link)}`).join("\n")}` : "links: []",
  'socialDraft: ""',
  "---",
  "",
].join("\n");

const body = `${frontmatter}Start here.\n`;
fs.writeFileSync(destination, body);

console.log(`Created ${destination}`);
