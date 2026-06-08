# Simple Things

Business website for [Simple Things Limited](https://simplethin.gs), rebuilt on EmDash and deployed to Cloudflare Workers.

## Structure

- `emdash-app/` - Astro + EmDash CMS application
- `emdash-app/seed/seed.json` - migrated content, collections, fields, menus, and redirects
- `emdash-app/src/pages/` - public pages and API routes
- `emdash-app/wrangler.jsonc` - Worker routes, D1, R2, KV, and public Turnstile config
- `scripts/generate-emdash-seed.mjs` - migration seed generator from local content
- `nextjs-app/` - retained migration/reference app while the Cloudflare cutover finishes

## Local Development

```bash
cd emdash-app
npm install
npm run dev
```

The CMS is available at `/_emdash/admin`.

## Build And Deploy

```bash
cd emdash-app
npm run typecheck
npm run build
npx wrangler deploy
```

## Contact Form Protection

The contact form uses Cloudflare Turnstile with server-side validation, a honeypot field, submit timing checks, and D1 rate limiting.

Replace the test Turnstile keys before treating the form as production-protected:

```bash
cd emdash-app
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Then update `PUBLIC_TURNSTILE_SITE_KEY` in `emdash-app/wrangler.jsonc` and redeploy.
