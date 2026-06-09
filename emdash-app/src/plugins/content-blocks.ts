import { elements } from "@emdash-cms/blocks";

export function createPlugin() {
	return {
		id: "simplethings-content-blocks",
		version: "0.1.0",
		capabilities: [],
		allowedHosts: [],
		storage: {},
		hooks: {},
		routes: {},
		admin: {
			portableTextBlocks: [
				{
					type: "demo",
					label: "Demo",
					icon: "monitor",
					description: "Embed a project demo or link to a technical walkthrough.",
					category: "Demos",
					fields: [
						elements.textInput("title", "Title", {
							placeholder: "Interactive API explorer",
						}),
						elements.textInput("description", "Description", {
							multiline: true,
							placeholder: "What should the reader understand before opening this demo?",
						}),
						elements.textInput("url", "Demo URL", {
							placeholder: "https://example.com/demo",
						}),
						elements.textInput("label", "Link label", {
							placeholder: "Open demo",
						}),
						elements.textInput("embed_url", "Embed URL", {
							placeholder: "Optional iframe URL",
						}),
						elements.mediaPicker("media_url", "Poster image", {
							mimeTypeFilter: "image/",
							placeholder: "Optional image when there is no embed",
						}),
						elements.numberInput("height", "Embed height", {
							initialValue: 520,
							min: 260,
							max: 900,
						}),
					],
				},
			],
		},
	};
}

export default createPlugin;
