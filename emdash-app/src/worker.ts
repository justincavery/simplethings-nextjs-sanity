import handler from "@astrojs/cloudflare/entrypoints/server";
import { createScheduledHandler } from "@emdash-cms/cloudflare/worker";
import { handleContactPost } from "./contact-handler";
import { handleSitemapGet, isSitemapPath } from "./sitemap-handler";

export { PluginBridge } from "@emdash-cms/cloudflare/worker";

const permanentRedirects = new Map([
	["/posts", "/blog"],
	["/posts/", "/blog"],
	["/work", "/projects"],
	["/work/", "/projects"],
]);

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/api/contact") {
			if (request.method !== "POST") {
				return new Response("Method not allowed", { status: 405 });
			}
			return handleContactPost(request, env);
		}

		if (isSitemapPath(url.pathname)) {
			if (request.method !== "GET" && request.method !== "HEAD") {
				return new Response("Method not allowed", { status: 405 });
			}
			return handleSitemapGet(request, env);
		}

		const destination = permanentRedirects.get(url.pathname);
		if (destination) {
			const redirectUrl = new URL(destination, url.origin);
			redirectUrl.search = url.search;
			return Response.redirect(redirectUrl.toString(), 301);
		}

		return handler.fetch(request, env, ctx);
	},
	scheduled: createScheduledHandler(),
};
