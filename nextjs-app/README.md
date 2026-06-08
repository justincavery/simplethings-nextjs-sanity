# Simple Things Site

Static Next.js site for Simple Things Limited, deployed to Cloudflare with content stored as local Markdown/MDX files.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run deploy
```

`npm run build` exports the site to `out/`. `wrangler.toml` points Cloudflare Workers static assets at that directory.

Redirects live in `src/worker.js`. The Worker runs before selected static routes and returns 301s before falling back to static assets.

## Writing

Posts live in `content/posts`.

```bash
npm run content:new -- "Post title" --tweet "https://x.com/user/status/123" --link "https://example.com"
```

Projects live in `content/projects` and support separate `businessBenefits` and `technicalHighlights` frontmatter.

See `content/README.md` for the content fields.
