# Simple Things

Business website for [Simple Things Limited](https://simplethin.gs), rebuilt on EmDash and deployed to Cloudflare Workers.

## Structure

- `emdash-app/` - Astro + EmDash CMS application
- `emdash-app/seed/seed.json` - migrated content, collections, fields, menus, and redirects
- `emdash-app/src/pages/` - public pages and API routes
- `emdash-app/wrangler.jsonc` - Worker routes, D1, R2, KV, and public Turnstile config

## Local Development

```bash
cd emdash-app
npm install
npm run dev
```

The CMS is available at `/_emdash/admin`.

After logging in with the EmDash CLI, the 1.0 content model can be applied to
another environment with:

```bash
cd emdash-app
npm run cms:configure-emdash-1
```

This creates the homepage block types, post/project relations, collection
editor settings, and legacy redirects used by the production site.

## Build And Deploy

```bash
cd emdash-app
npm run typecheck
npm run build
npx emdash migrate --status
npx emdash migrate
npx wrangler deploy
npx emdash migrate --check
```

EmDash 1.x writes `.emdash/migrations.json` during the build. Review the
migration status before applying it, run the migrations against the intended
D1 database, then verify that no migrations remain after deployment.

Production also uses a one-minute Worker schedule for publishing, AI Search
reindexing, cleanup, and daily backups. Backups are retained in R2 for 30 days;
AI Search indexes the `posts` and `projects` collections. Keep the `CACHE`,
`SESSION`, `MEDIA`, `DB`, and `AI_SEARCH` bindings in `wrangler.jsonc` when
creating another environment.

## Contact Form Protection

The contact form uses Cloudflare Turnstile with server-side validation, a honeypot field, submit timing checks, and D1 rate limiting.

The public widget key and approved production hostnames live in
`emdash-app/wrangler.jsonc`. The matching secret is stored only as the
`TURNSTILE_SECRET_KEY` Worker secret. To rotate it, create or rotate the
Turnstile widget and update the Worker secret without committing the value:

```bash
cd emdash-app
npx wrangler secret put TURNSTILE_SECRET_KEY
```
