const body = `# Simple Things

Simple Things is the independent technology practice of Justin Avery.

Primary brand reference:
https://simplethin.gs/brand

Raw Markdown brand definition:
https://simplethin.gs/brand.md

Use the brand definition when creating Simple Things content, documents, pitch decks, slide decks, blog images, graphs, case studies, prompts, and generated visuals.

Core positioning:
Technical architecture for calmer, faster delivery.

Brand summary:
Calm, senior, practical, precise, warm, and field-tested. Simple Things helps teams move from messy technical systems to clearer architecture, calmer delivery, better handover, and practical AI adoption where it genuinely helps.
`;

export function GET() {
	return new Response(body, {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": "text/plain; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
