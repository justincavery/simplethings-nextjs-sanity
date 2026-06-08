import { ImageResponse } from "workers-og";

const WIDTH = 1200;
const HEIGHT = 630;
const CACHE_CONTROL = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

type OgImageInput = {
	title: string;
	description?: string;
	kicker?: string;
	label?: string;
};

type OgStyle = Record<string, string | number>;
type OgElement = {
	type: "div";
	props: {
		style: OgStyle;
		children?: Array<OgElement | string>;
	};
};

function clamp(value: string, maxLength: number): string {
	const normalised = value.replace(/\s+/g, " ").trim();
	if (normalised.length <= maxLength) return normalised;
	const clipped = normalised.slice(0, maxLength - 1);
	const lastSpace = clipped.lastIndexOf(" ");
	return `${clipped.slice(0, lastSpace > 60 ? lastSpace : clipped.length).trim()}...`;
}

function fitDescription(value: string, maxLength: number): string {
	const normalised = value.replace(/\s+/g, " ").replace(/(?:\.{3}|…)$/, "").trim();
	if (normalised.length <= maxLength) return normalised;
	const clipped = normalised.slice(0, maxLength);
	const lastSpace = clipped.lastIndexOf(" ");
	return clipped
		.slice(0, lastSpace > 80 ? lastSpace : clipped.length)
		.replace(/[,:;.-]+$/, "")
		.trim();
}

function titleFontSize(value: string): number {
	if (value.length > 78) return 60;
	if (value.length > 62) return 66;
	if (value.length > 44) return 74;
	return 86;
}

function box(style: OgStyle, children?: Array<OgElement | string | false | undefined>): OgElement {
	return {
		type: "div",
		props: {
			style,
			children: children?.filter(Boolean) as Array<OgElement | string> | undefined,
		},
	};
}

export async function createOgImageResponse(input: OgImageInput): Promise<Response> {
	const title = clamp(input.title || "Simple Things Limited", 96);
	const description = fitDescription(input.description || "", 124);
	const kicker = input.kicker?.trim().toUpperCase();
	const label = (input.label || "Field note").toUpperCase();
	const titleSize = titleFontSize(title);

	const element = box(
		{
			width: WIDTH,
			height: HEIGHT,
			display: "flex",
			background: "#fbfbfa",
			color: "#171412",
			fontFamily: "Bitter, Arial, sans-serif",
			borderTop: "10px solid #171412",
		},
		[
			box(
				{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					padding: "42px 70px 44px 70px",
				},
				[
					box(
						{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							borderBottom: "2px solid #171412",
							paddingBottom: 14,
						},
						[
							box({ display: "flex", alignItems: "center" }, [
								box(
									{
										width: 34,
										height: 34,
										border: "3px solid #171412",
										borderRadius: 999,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										marginRight: 13,
									},
									[
										box({
											width: 16,
											height: 16,
											borderLeft: "3px solid #171412",
											borderRight: "3px solid #171412",
										}),
									],
								),
								box(
									{
										display: "flex",
										fontSize: 24,
										fontWeight: 600,
										letterSpacing: 0,
										textTransform: "uppercase",
									},
									["Simplethin.gs"],
								),
							]),
							box(
								{
									display: "flex",
									alignItems: "center",
									border: "2px solid #171412",
									fontSize: 16,
									fontWeight: 600,
									lineHeight: 1,
								},
								[
									box({ display: "flex", padding: "10px 15px" }, [label]),
									box(
										{
											display: "flex",
											background: "#e6332a",
											color: "#ffffff",
											padding: "12px 15px",
										},
										["SHARE"],
									),
								],
							),
						],
					),
					box(
						{
							display: "flex",
							flex: 1,
							alignItems: "flex-start",
							paddingTop: 28,
							paddingBottom: 18,
						},
						[
							box({
								width: 26,
								alignSelf: "stretch",
								background: "#e6332a",
								marginRight: 34,
							}),
							box(
								{
									display: "flex",
									flexDirection: "column",
									width: 880,
								},
								[
									kicker &&
										box(
											{
												display: "flex",
												fontSize: 18,
												color: "#e6332a",
												fontWeight: 600,
												marginBottom: 16,
												textTransform: "uppercase",
											},
											[kicker],
										),
									box(
										{
											display: "flex",
											fontSize: titleSize,
											fontWeight: 600,
											lineHeight: 0.98,
											letterSpacing: 0,
											maxWidth: 880,
										},
										[title],
									),
									description &&
										box(
											{
												display: "flex",
												fontSize: 25,
												color: "#5f5a55",
												lineHeight: 1.32,
												marginTop: 22,
												maxWidth: 860,
											},
											[description],
										),
								],
							),
						],
					),
					box(
						{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							borderTop: "1px solid #d8d4ce",
							paddingTop: 17,
						},
						[
							box({ display: "flex", fontSize: 17, color: "#5f5a55" }, [
								"Practical automation, resilient APIs, DevOps, and edge-ready infrastructure.",
							]),
							box({ display: "flex" }, [
								box({ width: 12, height: 12, background: "#171412", marginLeft: 8 }),
								box({ width: 12, height: 12, background: "#e6332a", marginLeft: 8 }),
								box({ width: 12, height: 12, border: "2px solid #171412", marginLeft: 8 }),
							]),
						],
					),
				],
			),
		],
	);

	const image = new ImageResponse(element as never, {
		width: WIDTH,
		height: HEIGHT,
		format: "png",
		headers: {
			"Cache-Control": CACHE_CONTROL,
			"X-Content-Type-Options": "nosniff",
		},
	});

	const body = await image.arrayBuffer();
	return new Response(body, {
		status: image.status,
		statusText: image.statusText,
		headers: image.headers,
	});
}
