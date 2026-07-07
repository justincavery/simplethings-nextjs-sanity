import brandMarkdown from "../../docs/simple-things-brand.md?raw";

export function GET() {
	return new Response(brandMarkdown, {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": "text/markdown; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
