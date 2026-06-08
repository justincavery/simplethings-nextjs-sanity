import handler from "@astrojs/cloudflare/entrypoints/server";
import { handleContactPost } from "./contact-handler";

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

		const destination = permanentRedirects.get(url.pathname);
		if (destination) {
			const redirectUrl = new URL(destination, url.origin);
			redirectUrl.search = url.search;
			return Response.redirect(redirectUrl.toString(), 301);
		}

		return handler.fetch(request, env, ctx);
	},
};
