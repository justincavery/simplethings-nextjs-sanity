import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const outDir = "public/images/brand/messy-to-straight";
const brandRed = "#e6332a";
const darkOrange = "#c2410c";
const cream = "#fbfbfa";
const black = "#171412";
const grey = "#d8d4ce";

const messy = "M10 34 C13 11 17 55 21 33 C24 13 28 53 32 31 C36 12 39 47 43 31 C47 19 51 34 56 32";
const messySoft = "M10 34 C15 24 16 45 20 32 C23 19 27 43 31 31 C36 20 38 39 43 31 C48 24 51 33 56 32";
const straight = "M10 34 L56 32";
const reverseMessy = "M56 32 C51 49 47 9 43 31 C39 49 36 14 32 31 C28 53 24 13 21 33 C17 55 13 11 10 34";
const diagonalMessy = "M9 49 C14 24 19 60 23 40 C27 18 31 50 35 31 C39 13 43 40 47 24 C51 14 54 18 57 15";
const diagonalStraight = "M9 49 L57 15";

const svg = (body, { title, bg = cream, border = false, rounded = true, defs = "" } = {}) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="title">
	<title>${title}</title>
	${defs}
	<rect width="64" height="64" rx="${rounded ? 12 : 0}" fill="${bg}"/>
	${body}
	${border ? `<rect x="3" y="3" width="58" height="58" rx="${rounded ? 10 : 0}" fill="none" stroke="${black}" stroke-width="3"/>` : ""}
</svg>
`;

const stroke = ({ path, color, width, opacity = 1, dash = "", cap = "round", join = "round", extra = "" }) =>
	`<path d="${path}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="${cap}" stroke-linejoin="${join}" opacity="${opacity}"${dash ? ` stroke-dasharray="${dash}"` : ""}${extra ? ` ${extra}` : ""}/>`;

const dot = (cx, cy, r, fill, opacity = 1) =>
	`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}"/>`;

const randomField = (paths, { color = black, width = 0.95, opacity = 0.42, dash = "" } = {}) =>
	paths
		.map((path, index) =>
			stroke({
				path,
				color,
				width: typeof width === "number" ? width + (index % 3) * 0.12 : width,
				opacity: typeof opacity === "number" ? Math.max(0.18, opacity - (index % 4) * 0.04) : opacity,
				dash,
			}),
		)
		.join("\n\t");

const randomMess = [
	"M-5 9 C5 18 12 3 20 16 C29 32 35 5 43 18 C51 31 58 7 69 20",
	"M-7 22 C2 10 9 37 18 25 C27 13 31 39 41 23 C50 8 58 32 70 18",
	"M-4 34 C5 49 13 19 22 36 C29 50 36 17 45 35 C52 48 60 27 70 42",
	"M-6 48 C4 37 13 61 22 45 C32 27 37 56 48 41 C57 29 61 55 70 46",
	"M4 -3 C16 12 8 27 23 35 C39 43 29 58 45 69",
	"M62 -4 C47 10 59 26 43 34 C27 42 36 57 20 68",
];

const sparseRandomMess = [
	"M-4 18 C8 8 13 35 25 20 C35 7 42 33 55 20 C61 14 65 15 70 18",
	"M-6 37 C5 51 14 21 25 37 C35 52 42 24 54 39 C62 49 67 45 71 41",
	"M9 -2 C17 14 8 27 21 38 C33 48 25 56 35 68",
	"M57 -5 C47 11 57 25 44 36 C31 47 38 56 27 69",
];

const singleMess = {
	wide: "M10 34 C4 14 28 4 35 21 C44 43 9 54 17 39 C29 16 61 53 48 38 C36 18 68 13 56 32",
	tall: "M10 34 C15 4 42 10 31 29 C17 55 49 67 45 43 C41 20 19 15 24 37 C29 57 66 51 56 32",
	compact: "M10 34 C18 21 23 45 31 32 C40 17 47 43 37 39 C26 35 40 23 48 30 C54 35 51 38 56 32",
	edge: "M10 34 C-1 15 20 -2 37 10 C58 25 17 64 5 49 C-4 38 26 22 40 43 C52 61 72 50 56 32",
	low: "M10 34 C19 43 25 23 34 39 C42 55 54 48 47 34 C39 18 20 49 31 54 C43 61 67 44 56 32",
	sparse: "M10 34 C18 12 34 55 25 28 C18 8 55 13 43 38 C35 55 66 51 56 32",
	spaghetti: "M10 34 C22 3 54 18 36 40 C18 62 6 16 31 15 C57 13 62 55 39 50 C16 44 31 24 49 32 C62 38 49 43 56 32",
	crossing: "M10 34 C5 7 47 -2 50 22 C53 49 13 54 18 30 C23 8 60 15 42 39 C26 61 15 26 34 23 C51 20 68 43 56 32",
};

const variants = [
	{
		slug: "01-thin-brand-line-over-black-mess",
		label: "Thin over messy",
		description: "Thin black disorder with a direct brand-colour path from the same start to end.",
		svg: svg(
			[
				stroke({ path: messy, color: black, width: 3, opacity: 0.9 }),
				stroke({ path: straight, color: brandRed, width: 2.5 }),
				dot(10, 34, 3.5, black),
				dot(56, 32, 3.5, brandRed),
			].join("\n\t"),
			{ title: "Thin brand line over black mess" },
		),
	},
	{
		slug: "02-heavy-brand-line-over-black-mess",
		label: "Heavy over messy",
		description: "Same metaphor with more weight, better for favicon-sized viewing.",
		svg: svg(
			[
				stroke({ path: messy, color: black, width: 7, opacity: 0.8 }),
				stroke({ path: straight, color: darkOrange, width: 5 }),
				dot(10, 34, 5, black),
				dot(56, 32, 5, darkOrange),
			].join("\n\t"),
			{ title: "Heavy brand line over black mess" },
		),
	},
	{
		slug: "03-black-only",
		label: "Black only",
		description: "No colour, just contrast between noisy path and clean path.",
		svg: svg(
			[
				stroke({ path: messy, color: black, width: 5, opacity: 0.35 }),
				stroke({ path: straight, color: black, width: 4 }),
				dot(10, 34, 4, black),
				dot(56, 32, 4, black),
			].join("\n\t"),
			{ title: "Black-only messy to straight" },
		),
	},
	{
		slug: "04-bordered",
		label: "Bordered",
		description: "A contained, company-logo treatment with a clear outer frame.",
		svg: svg(
			[
				stroke({ path: messy, color: black, width: 4, opacity: 0.4 }),
				stroke({ path: straight, color: brandRed, width: 5 }),
				dot(10, 34, 4, black),
				dot(56, 32, 4, brandRed),
			].join("\n\t"),
			{ title: "Bordered messy to straight", border: true },
		),
	},
	{
		slug: "05-unbordered-open",
		label: "Unbordered",
		description: "The lightest mark, useful if the crop or surrounding UI already frames it.",
		svg: svg(
			[
				stroke({ path: messySoft, color: black, width: 3.5, opacity: 0.45 }),
				stroke({ path: straight, color: brandRed, width: 4 }),
			].join("\n\t"),
			{ title: "Unbordered messy to straight" },
		),
	},
	{
		slug: "06-dotted-mess-solid-line",
		label: "Dotted mess",
		description: "The messy line becomes audit-trail dots; the answer is continuous.",
		svg: svg(
			[
				stroke({ path: messy, color: black, width: 4.5, opacity: 0.75, dash: "1 7" }),
				stroke({ path: straight, color: darkOrange, width: 5 }),
				dot(10, 34, 4, darkOrange),
				dot(56, 32, 4, darkOrange),
			].join("\n\t"),
			{ title: "Dotted messy line with solid straight line" },
		),
	},
	{
		slug: "07-dotted-solution",
		label: "Dotted solution",
		description: "A lighter, strategic-planning feel where the straight line is a dotted route.",
		svg: svg(
			[
				stroke({ path: messy, color: black, width: 4, opacity: 0.3 }),
				stroke({ path: straight, color: brandRed, width: 5, dash: "2 6" }),
				dot(10, 34, 4, brandRed),
				dot(56, 32, 4, black),
			].join("\n\t"),
			{ title: "Dotted straight solution" },
		),
	},
	{
		slug: "08-harsh-change",
		label: "Harsh change",
		description: "A hard before-and-after: chaotic left side, clean right side.",
		svg: svg(
			[
				stroke({ path: "M8 36 C11 12 16 56 20 34 C23 16 27 48 31 32", color: black, width: 7 }),
				stroke({ path: "M31 32 L56 32", color: brandRed, width: 7 }),
				stroke({ path: "M31 24 L31 40", color: black, width: 2, opacity: 0.55 }),
				dot(8, 36, 4, black),
				dot(56, 32, 4, brandRed),
			].join("\n\t"),
			{ title: "Harsh messy to straight transition" },
		),
	},
	{
		slug: "09-gradual-radiance",
		label: "Gradual radiance",
		description: "A softer change with glow, useful for the AI/process-improvement angle.",
		svg: svg(
			[
				stroke({ path: messy, color: black, width: 5, opacity: 0.35 }),
				stroke({ path: straight, color: "url(#lineGradient)", width: 6, extra: 'filter="url(#glow)"' }),
				dot(10, 34, 4, black, 0.8),
				dot(56, 32, 4, brandRed),
			].join("\n\t"),
			{
				title: "Gradual radiance messy to straight",
				defs: `<defs>
		<linearGradient id="lineGradient" x1="10" y1="34" x2="56" y2="32" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="${black}"/>
			<stop offset="0.46" stop-color="${darkOrange}"/>
			<stop offset="1" stop-color="${brandRed}"/>
		</linearGradient>
		<filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
			<feGaussianBlur stdDeviation="2.5" result="blur"/>
			<feMerge>
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/>
			</feMerge>
		</filter>
	</defs>`,
			},
		),
	},
	{
		slug: "10-reverse-direction",
		label: "Reverse direction",
		description: "Right-to-left version, useful to test how direction changes the reading.",
		svg: svg(
			[
				stroke({ path: reverseMessy, color: black, width: 4, opacity: 0.35 }),
				stroke({ path: "M56 32 L10 34", color: brandRed, width: 5 }),
				dot(56, 32, 4, black),
				dot(10, 34, 4, brandRed),
			].join("\n\t"),
			{ title: "Reverse direction messy to straight" },
		),
	},
	{
		slug: "11-diagonal-direction",
		label: "Diagonal",
		description: "Upward direction: more growth/momentum, less literal process cleanup.",
		svg: svg(
			[
				stroke({ path: diagonalMessy, color: black, width: 5, opacity: 0.45 }),
				stroke({ path: diagonalStraight, color: brandRed, width: 5 }),
				dot(9, 49, 4, black),
				dot(57, 15, 4, brandRed),
			].join("\n\t"),
			{ title: "Diagonal messy to straight" },
		),
	},
	{
		slug: "12-black-background-field",
		label: "Black field",
		description: "Dense black/grey messy field in the background with one confident brand line over it.",
		svg: svg(
			[
				stroke({ path: "M-4 12 C8 2 14 26 25 14 C36 2 42 25 68 9", color: "#6f6a65", width: 2.5, opacity: 0.55 }),
				stroke({ path: "M-2 24 C9 50 17 6 27 26 C38 49 48 8 66 28", color: "#8c8580", width: 2.5, opacity: 0.5 }),
				stroke({ path: "M-6 42 C10 18 19 60 30 38 C43 12 50 51 70 34", color: "#6f6a65", width: 2.5, opacity: 0.55 }),
				stroke({ path: "M-4 56 C15 35 26 68 39 48 C50 31 58 50 70 42", color: "#8c8580", width: 2.5, opacity: 0.45 }),
				stroke({ path: straight, color: darkOrange, width: 5 }),
				dot(10, 34, 4.5, cream),
				dot(56, 32, 4.5, darkOrange),
			].join("\n\t"),
			{ title: "Black background messy field with brand line", bg: black },
		),
	},
	{
		slug: "13-thin-black-field-red-line",
		label: "Thin black field",
		description: "Thin black messy lines everywhere, with one red line from the same start to end.",
		svg: svg(
			[
				stroke({ path: "M-3 13 C10 2 18 28 30 14 C42 1 50 27 68 10", color: black, width: 1.8, opacity: 0.45 }),
				stroke({ path: "M-5 24 C9 47 18 5 29 25 C41 48 50 9 69 29", color: black, width: 1.8, opacity: 0.45 }),
				stroke({ path: "M-4 37 C8 17 20 58 31 36 C43 12 52 53 68 34", color: black, width: 1.8, opacity: 0.45 }),
				stroke({ path: "M-3 50 C15 31 25 65 39 45 C51 28 58 50 69 43", color: black, width: 1.8, opacity: 0.45 }),
				stroke({ path: straight, color: brandRed, width: 4.5 }),
				dot(10, 34, 4, black),
				dot(56, 32, 4, brandRed),
			].join("\n\t"),
			{ title: "Thin black messy field with red line" },
		),
	},
	{
		slug: "14-thin-black-field-dark-orange-line",
		label: "Dark orange field",
		description: "The same field idea with a darker orange solution line.",
		svg: svg(
			[
				stroke({ path: "M-4 15 C7 7 16 28 28 14 C39 3 48 25 68 11", color: black, width: 1.5, opacity: 0.38 }),
				stroke({ path: "M-7 27 C7 48 17 7 29 27 C41 49 50 12 70 30", color: black, width: 1.5, opacity: 0.38 }),
				stroke({ path: "M-4 39 C9 18 19 55 31 38 C44 18 51 52 69 35", color: black, width: 1.5, opacity: 0.38 }),
				stroke({ path: "M-4 52 C15 34 26 66 39 47 C52 29 59 51 69 44", color: black, width: 1.5, opacity: 0.38 }),
				stroke({ path: straight, color: darkOrange, width: 3.25 }),
				dot(10, 34, 3.5, black),
				dot(56, 32, 3.5, darkOrange),
			].join("\n\t"),
			{ title: "Thin black messy field with dark orange line" },
		),
	},
	{
		slug: "15-red-background-cut-through",
		label: "Red field",
		description: "A brand-colour block where the clean line cuts through the mess in cream.",
		svg: svg(
			[
				stroke({ path: "M-4 19 C8 6 17 34 29 17 C40 1 48 28 68 13", color: black, width: 2.2, opacity: 0.38 }),
				stroke({ path: "M-5 35 C8 55 18 8 30 32 C42 55 49 12 70 35", color: black, width: 2.2, opacity: 0.38 }),
				stroke({ path: "M-4 50 C15 31 27 66 40 45 C52 26 59 52 69 43", color: black, width: 2.2, opacity: 0.38 }),
				stroke({ path: straight, color: cream, width: 5 }),
				stroke({ path: straight, color: "#ffb000", width: 2.2 }),
				dot(10, 34, 4, cream),
				dot(56, 32, 4, "#ffb000"),
			].join("\n\t"),
			{ title: "Red background messy field with cream line", bg: brandRed },
		),
	},
	{
		slug: "16-linework-only",
		label: "Linework only",
		description: "No dots, no frame, no fill tricks: just the before path and the better path.",
		svg: svg(
			[
				stroke({ path: messy, color: black, width: 2.5, opacity: 0.5, cap: "butt" }),
				stroke({ path: straight, color: brandRed, width: 2.5, cap: "butt" }),
			].join("\n\t"),
			{ title: "Linework-only messy to straight" },
		),
	},
	{
		slug: "17-hairline-random-red",
		label: "Hairline random",
		description: "Much thinner black random mess with a red straight line from the same start to end.",
		svg: svg(
			[
				randomField(randomMess, { width: 0.85, opacity: 0.46 }),
				stroke({ path: straight, color: brandRed, width: 3.25 }),
				dot(10, 34, 3.4, black),
				dot(56, 32, 3.4, brandRed),
			].join("\n\t"),
			{ title: "Hairline random messy field with red line" },
		),
	},
	{
		slug: "18-hairline-random-dark-orange",
		label: "Hairline orange",
		description: "A darker-orange answer line over a more random hairline black field.",
		svg: svg(
			[
				randomField(randomMess, { width: 0.72, opacity: 0.42 }),
				stroke({ path: straight, color: darkOrange, width: 3 }),
				dot(10, 34, 3, black),
				dot(56, 32, 3, darkOrange),
			].join("\n\t"),
			{ title: "Hairline random messy field with dark orange line" },
		),
	},
	{
		slug: "19-sparse-random-no-dots",
		label: "Sparse no dots",
		description: "A quieter random field with no endpoints, keeping the clean line as the only strong object.",
		svg: svg(
			[
				randomField(sparseRandomMess, { width: 0.9, opacity: 0.42 }),
				stroke({ path: straight, color: brandRed, width: 3.2 }),
			].join("\n\t"),
			{ title: "Sparse random messy field with no dots" },
		),
	},
	{
		slug: "20-dense-hairline-field",
		label: "Dense hairline",
		description: "Denser and more chaotic, but still using thin black background strokes.",
		svg: svg(
			[
				randomField(
					[
						...randomMess,
						"M-4 14 C8 45 18 4 28 31 C39 60 48 11 68 38",
						"M-6 28 C9 2 18 52 31 25 C43 0 51 49 70 24",
						"M1 60 C13 38 24 55 34 34 C43 15 55 30 64 7",
					],
					{ width: 0.68, opacity: 0.38 },
				),
				stroke({ path: straight, color: brandRed, width: 3.5 }),
				dot(10, 34, 3.25, black),
				dot(56, 32, 3.25, brandRed),
			].join("\n\t"),
			{ title: "Dense hairline random field with red line" },
		),
	},
	{
		slug: "21-faint-chaos-bold-answer",
		label: "Faint chaos",
		description: "Very faint thin black disorder with a stronger straight brand line.",
		svg: svg(
			[
				randomField(randomMess, { width: 0.75, opacity: 0.28 }),
				stroke({ path: straight, color: brandRed, width: 4.25 }),
				dot(10, 34, 3.5, black, 0.75),
				dot(56, 32, 3.5, brandRed),
			].join("\n\t"),
			{ title: "Faint chaotic hairline field with bold answer" },
		),
	},
	{
		slug: "22-black-ground-hairlines",
		label: "Black hairlines",
		description: "Black ground with thin warm-grey chaos and one dark-orange answer line.",
		svg: svg(
			[
				randomField(randomMess, { color: "#9a928a", width: 0.8, opacity: 0.55 }),
				stroke({ path: straight, color: darkOrange, width: 3.5 }),
				dot(10, 34, 3.4, cream),
				dot(56, 32, 3.4, darkOrange),
			].join("\n\t"),
			{ title: "Black ground with hairline chaos and dark orange line", bg: black },
		),
	},
	{
		slug: "23-single-wide-red",
		label: "Single wide",
		description: "One continuous black line takes a wide messy route, with a red straight line from the same start to end.",
		svg: svg(
			[
				stroke({ path: singleMess.wide, color: black, width: 1.2 }),
				stroke({ path: straight, color: brandRed, width: 3.25 }),
				dot(10, 34, 3.25, black),
				dot(56, 32, 3.25, brandRed),
			].join("\n\t"),
			{ title: "Single wide messy black line with red straight line" },
		),
	},
	{
		slug: "24-single-tall-orange",
		label: "Single tall",
		description: "One smooth black path wanders vertically before the dark-orange direct route resolves it.",
		svg: svg(
			[
				stroke({ path: singleMess.tall, color: black, width: 1.15 }),
				stroke({ path: straight, color: darkOrange, width: 3 }),
				dot(10, 34, 3, black),
				dot(56, 32, 3, darkOrange),
			].join("\n\t"),
			{ title: "Single tall messy black line with dark orange straight line" },
		),
	},
	{
		slug: "25-single-compact-red",
		label: "Single compact",
		description: "A tighter single-line tangle for better small-size recognition.",
		svg: svg(
			[
				stroke({ path: singleMess.compact, color: black, width: 1.25 }),
				stroke({ path: straight, color: brandRed, width: 3.4 }),
				dot(10, 34, 3.25, black),
				dot(56, 32, 3.25, brandRed),
			].join("\n\t"),
			{ title: "Single compact messy black line with red straight line" },
		),
	},
	{
		slug: "26-single-edge-orange",
		label: "Single edge",
		description: "One messy black path uses more of the icon boundary, then resolves to a direct dark-orange line.",
		svg: svg(
			[
				stroke({ path: singleMess.edge, color: black, width: 1.1 }),
				stroke({ path: straight, color: darkOrange, width: 3.15 }),
				dot(10, 34, 3, black),
				dot(56, 32, 3, darkOrange),
			].join("\n\t"),
			{ title: "Single boundary messy black line with dark orange straight line" },
		),
	},
	{
		slug: "27-single-low-red",
		label: "Single low",
		description: "One lower, looser black path with a red straight line cutting across it.",
		svg: svg(
			[
				stroke({ path: singleMess.low, color: black, width: 1.15 }),
				stroke({ path: straight, color: brandRed, width: 3.25 }),
				dot(10, 34, 3.2, black),
				dot(56, 32, 3.2, brandRed),
			].join("\n\t"),
			{ title: "Single low messy black line with red straight line" },
		),
	},
	{
		slug: "28-single-black-only",
		label: "Single black",
		description: "Only one messy black line, with no coloured solution line.",
		svg: svg(
			[
				stroke({ path: singleMess.wide, color: black, width: 1.8, opacity: 0.95 }),
				dot(10, 34, 3.25, black),
				dot(56, 32, 3.25, black),
			].join("\n\t"),
			{ title: "Single black messy line only" },
		),
	},
	{
		slug: "29-single-sparse-red",
		label: "Single sparse",
		description: "A simpler single black path with fewer turns and a red direct line.",
		svg: svg(
			[
				stroke({ path: singleMess.sparse, color: black, width: 1.2 }),
				stroke({ path: straight, color: brandRed, width: 3.25 }),
				dot(10, 34, 3.15, black),
				dot(56, 32, 3.15, brandRed),
			].join("\n\t"),
			{ title: "Single sparse messy black line with red straight line" },
		),
	},
	{
		slug: "30-single-black-ground",
		label: "Single dark",
		description: "A single warm-grey messy line on black, with one dark-orange direct line.",
		svg: svg(
			[
				stroke({ path: singleMess.wide, color: "#aaa39b", width: 1.35, opacity: 0.86 }),
				stroke({ path: straight, color: darkOrange, width: 3.15 }),
				dot(10, 34, 3.1, cream),
				dot(56, 32, 3.1, darkOrange),
			].join("\n\t"),
			{ title: "Single messy line on black with dark orange straight line", bg: black },
		),
	},
	{
		slug: "31-single-spaghetti-red",
		label: "Single spaghetti",
		description: "One true-black smooth path crosses and loops more randomly, with a red direct line.",
		svg: svg(
			[
				stroke({ path: singleMess.spaghetti, color: black, width: 1.1 }),
				stroke({ path: straight, color: brandRed, width: 3.25 }),
				dot(10, 34, 3.15, black),
				dot(56, 32, 3.15, brandRed),
			].join("\n\t"),
			{ title: "Single spaghetti black path with red straight line" },
		),
	},
	{
		slug: "32-single-crossing-orange",
		label: "Single crossing",
		description: "One true-black smooth path moves more randomly around the space, resolved by dark orange.",
		svg: svg(
			[
				stroke({ path: singleMess.crossing, color: black, width: 1.1 }),
				stroke({ path: straight, color: darkOrange, width: 3.15 }),
				dot(10, 34, 3.1, black),
				dot(56, 32, 3.1, darkOrange),
			].join("\n\t"),
			{ title: "Single crossing black path with dark orange straight line" },
		),
	},
];

await mkdir(outDir, { recursive: true });

for (const variant of variants) {
	await writeFile(`${outDir}/${variant.slug}.svg`, variant.svg);
	await sharp(Buffer.from(variant.svg))
		.resize(400, 400)
		.png({ compressionLevel: 9 })
		.toFile(`${outDir}/${variant.slug}.png`);
}

const tile = 190;
const gap = 24;
const margin = 32;
const labelHeight = 54;
const columns = 4;
const rows = Math.ceil(variants.length / columns);
const width = margin * 2 + columns * tile + (columns - 1) * gap;
const height = margin * 2 + rows * (tile + labelHeight) + (rows - 1) * gap;
const composites = [];

for (let i = 0; i < variants.length; i += 1) {
	const variant = variants[i];
	const column = i % columns;
	const row = Math.floor(i / columns);
	const left = margin + column * (tile + gap);
	const top = margin + row * (tile + labelHeight + gap);

	composites.push({
		input: await sharp(`${outDir}/${variant.slug}.png`).resize(tile, tile).toBuffer(),
		left,
		top,
	});

	const labelSvg = Buffer.from(`
		<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${labelHeight}" viewBox="0 0 ${tile} ${labelHeight}">
			<text x="${tile / 2}" y="22" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="800" fill="${black}">${variant.label}</text>
			<text x="${tile / 2}" y="42" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="500" fill="#5f5a55">${variant.slug.slice(0, 2)}</text>
		</svg>
	`);
	composites.push({ input: labelSvg, left, top: top + tile + 8 });
}

await sharp({
	create: {
		width,
		height,
		channels: 4,
		background: cream,
	},
})
	.composite(composites)
	.png({ compressionLevel: 9 })
	.toFile(`${outDir}/messy-to-straight-variations.png`);

const singleLineVariants = variants.filter((variant) => {
	const match = variant.slug.match(/^(\d+)-/);
	return match ? Number(match[1]) >= 23 : false;
});
const singleColumns = 4;
const singleRows = Math.ceil(singleLineVariants.length / singleColumns);
const singleWidth = margin * 2 + singleColumns * tile + (singleColumns - 1) * gap;
const singleHeight = margin * 2 + singleRows * (tile + labelHeight) + (singleRows - 1) * gap;
const singleComposites = [];

for (let i = 0; i < singleLineVariants.length; i += 1) {
	const variant = singleLineVariants[i];
	const column = i % singleColumns;
	const row = Math.floor(i / singleColumns);
	const left = margin + column * (tile + gap);
	const top = margin + row * (tile + labelHeight + gap);

	singleComposites.push({
		input: await sharp(`${outDir}/${variant.slug}.png`).resize(tile, tile).toBuffer(),
		left,
		top,
	});

	const labelSvg = Buffer.from(`
		<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${labelHeight}" viewBox="0 0 ${tile} ${labelHeight}">
			<text x="${tile / 2}" y="22" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="800" fill="${black}">${variant.label}</text>
			<text x="${tile / 2}" y="42" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="500" fill="#5f5a55">${variant.slug.slice(0, 2)}</text>
		</svg>
	`);
	singleComposites.push({ input: labelSvg, left, top: top + tile + 8 });
}

await sharp({
	create: {
		width: singleWidth,
		height: singleHeight,
		channels: 4,
		background: cream,
	},
})
	.composite(singleComposites)
	.png({ compressionLevel: 9 })
	.toFile(`${outDir}/single-black-line-variations.png`);

const notes = [
	"# Messy to Straight Variations",
	"",
	"These files explore the Simple Things idea of taking messy technical systems, workflows, or delivery paths and making the important route clearer.",
	"",
	...variants.map((variant) => `- ${variant.slug}: ${variant.description}`),
	"",
];

await writeFile(`${outDir}/README.md`, notes.join("\n"));
