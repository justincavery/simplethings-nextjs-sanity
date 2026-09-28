import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, kvCache, r2 } from "@emdash-cms/cloudflare";
import { aiSearch } from "@emdash-cms/cloudflare/plugins";
import { fileURLToPath } from "node:url";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";

const contentBlocksPlugin = fileURLToPath(new URL("./src/plugins/content-blocks.ts", import.meta.url));
const contentBlocksComponents = fileURLToPath(new URL(
	"./src/plugins/content-blocks.components.ts",
	import.meta.url,
));

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	cache: {
		provider: cacheCloudflare(),
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			objectCache: kvCache({ binding: "CACHE", defaultTtl: 300 }),
			plugins: [
				aiSearch({
					urlTemplates: {
						posts: "/posts/{slug}",
						projects: "/projects/{slug}",
					},
				}),
				{
					id: "simplethings-content-blocks",
					version: "0.1.0",
					entrypoint: contentBlocksPlugin,
					componentsEntry: contentBlocksComponents,
					format: "native",
				},
			],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700, 800],
			fallbacks: ["sans-serif"],
		},
	],
	devToolbar: { enabled: false },
});
