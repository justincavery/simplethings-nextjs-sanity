# Demos

Runnable showcase demos are deployed with the Astro Cloudflare Worker.

## Add A Demo

1. Add a self-contained HTML file under `public/demos`.
2. Add an entry in `src/lib/examples.ts`.
3. Review locally with `npm run review:worker`.
4. Deploy with `npm run deploy`.
5. Link CMS posts to `/examples/<slug>`, not directly to the raw asset.

The raw demo can still be opened at `/demos/<filename-without-html>`, but the
example page gives articles and project write-ups a stable, designed URL to
reference.

## CMS Article Embeds

For article bodies, use the CMS `Demo` block rather than pasting an iframe into
Portable Text. The `Demo` block renders through `src/components/DemoEmbed.astro`
and can link to `/examples/<slug>` while embedding `/demos/<slug>`.

The HTML-in-Canvas article is currently refreshed from its Markdown draft with:

```sh
npm run cms:html-in-canvas-post
```
