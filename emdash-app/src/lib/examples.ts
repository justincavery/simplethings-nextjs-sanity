export type ExampleEntry = {
	slug: string;
	title: string;
	summary: string;
	demoUrl: string;
	articleUrl?: string;
	sourceLabel?: string;
	tags: string[];
};

export const examples: ExampleEntry[] = [
	{
		slug: "html-in-canvas-orbits",
		title: "HTML-in-Canvas orbital controls",
		summary:
			"A small three-body orbital mechanics lab showing native HTML controls working alongside a canvas-rendered simulation.",
		demoUrl: "/demos/html-in-canvas-orbits",
		articleUrl: "/posts/putting-html-in-orbit-with-canvas",
		sourceLabel: "Single-file HTML demo",
		tags: ["HTML-in-Canvas", "Canvas", "Orbital mechanics"],
	},
];

export function getExample(slug: string | undefined) {
	if (!slug) return undefined;
	return examples.find((example) => example.slug === slug);
}
