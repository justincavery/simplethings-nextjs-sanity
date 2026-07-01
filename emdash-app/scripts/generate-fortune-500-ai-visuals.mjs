import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const outDir = new URL("../public/images/posts/fortune-500-ai/", import.meta.url);
const outPath = fileURLToPath(outDir);
mkdirSync(outPath, { recursive: true });

const brand = {
	lightLockup: "/Users/justinavery/Downloads/simple-things-brand/logo/lockup-light.svg",
	darkLockup: "/Users/justinavery/Downloads/simple-things-brand/logo/lockup-dark.svg",
};

const theme = {
	bg: "#f4f2ef",
	white: "#fbfbfa",
	ink: "#171412",
	red: "#e6332a",
	grey: "#918b84",
	line: "#d8d2ca",
};

const lockups = {
	light: dataUri(brand.lightLockup),
	dark: dataUri(brand.darkLockup),
};

function dataUri(path) {
	const svg = readFileSync(path, "utf8").replace(/<rect width="348" height="80" fill="#(?:fbfbfa|171412)"\/>/, "");
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function esc(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function text({
	x,
	y,
	value,
	size = 24,
	color = theme.ink,
	weight = 400,
	family = "Arial, Helvetica, sans-serif",
	anchor = "start",
	letterSpacing = 0,
}) {
	return `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${letterSpacing}">${esc(value)}</text>`;
}

function textLines({
	x,
	y,
	lines,
	size = 24,
	color = theme.grey,
	weight = 400,
	family = "Arial, Helvetica, sans-serif",
	gap = 32,
	anchor = "start",
	letterSpacing = 0,
}) {
	return lines
		.map((line, index) =>
			text({
				x,
				y: y + index * gap,
				value: line,
				size,
				color,
				weight,
				family,
				anchor,
				letterSpacing,
			}),
		)
		.join("\n");
}

function brandLockup(mode = "light") {
	return brandLockupAt({ mode });
}

function brandLockupAt({ mode = "light", x = 1214, y = 866 } = {}) {
	return `<image href="${lockups[mode]}" x="${x}" y="${y}" width="292" height="67"/>
${text({
	x: x + 5,
	y: y + 104,
	value: "https://simplethin.gs",
	size: 19,
	color: theme.grey,
	family: "Menlo, Consolas, monospace",
	letterSpacing: 0.4,
})}`;
}

function featureBase(title, kicker, body, options = {}) {
	const bg = options.bg || theme.bg;
	const foreground = options.foreground || theme.ink;
	const lockup = options.lockup || "light";
	const kickerColor = options.kickerColor || theme.grey;

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
	<rect width="1600" height="900" fill="${bg}"/>
	${text({ x: 96, y: 92, value: kicker.toUpperCase(), size: 22, color: kickerColor, family: "Menlo, Consolas, monospace", letterSpacing: 8 })}
	${text({ x: 96, y: 168, value: title, size: 68, color: foreground, weight: 800 })}
	${body}
	${brandLockupAt({ mode: lockup, x: 1214, y: 746 })}
</svg>`;
}

function svgBase(title, kicker, body, note = [], options = {}) {
	const noteLines = Array.isArray(note) ? note : [note].filter(Boolean);
	const bg = options.bg || theme.bg;
	const foreground = options.foreground || theme.ink;
	const lockup = options.lockup || "light";

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
	<rect width="1600" height="1000" fill="${bg}"/>
	${text({ x: 96, y: 92, value: kicker.toUpperCase(), size: 22, color: theme.grey, family: "Menlo, Consolas, monospace", letterSpacing: 8 })}
	${text({ x: 96, y: 164, value: title, size: 62, color: foreground, weight: 800 })}
	${body}
	${textLines({ x: 96, y: 894, lines: noteLines, size: 23, color: theme.grey, gap: 30 })}
	${brandLockup(lockup)}
</svg>`;
}

async function writeJpeg(name, svg) {
	await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(join(outPath, name));
}

function barChart({ title, kicker, rows, max, note, redRows = new Set() }) {
	const labelX = 96;
	const barX = 690;
	const barW = 670;
	const y0 = 258;
	const gap = 82;
	const body = rows
		.map((row, index) => {
			const y = y0 + index * gap;
			const width = Math.max(8, (row.value / max) * barW);
			const fill = redRows.has(index) ? theme.red : theme.ink;
			return `${text({ x: labelX, y: y + 8, value: row.label, size: 30, color: theme.ink, weight: 800 })}
${text({ x: labelX, y: y + 40, value: row.meta, size: 21, color: theme.grey })}
<line x1="${barX}" y1="${y}" x2="${barX + barW}" y2="${y}" stroke="${theme.line}" stroke-width="14" stroke-linecap="round"/>
<line x1="${barX}" y1="${y}" x2="${barX + width}" y2="${y}" stroke="${fill}" stroke-width="14" stroke-linecap="round"/>
<circle cx="${barX + width}" cy="${y}" r="9" fill="${fill}"/>
${text({ x: barX + barW + 36, y: y + 11, value: row.valueLabel, size: 34, color: fill, weight: 800 })}`;
		})
		.join("\n");

	return svgBase(title, kicker, body, note);
}

function scalingGapChart() {
	return barChart({
		title: "Access is easy. Value is scarce.",
		kicker: "AI ADOPTION VS AI VALUE",
		rows: [
			{ label: "Regular AI use", meta: "McKinsey: used in at least one business function", value: 88, valueLabel: "88%" },
			{ label: "Enterprise EBIT impact", meta: "McKinsey: any reported enterprise-level EBIT impact", value: 39, valueLabel: "39%" },
			{ label: "Business reimagined", meta: "Deloitte: AI deeply transforming the organization", value: 34, valueLabel: "34%" },
			{ label: "Mature agent governance", meta: "Deloitte: mature governance for autonomous agents", value: 21, valueLabel: "21%" },
			{ label: "AI value at scale", meta: "Boston Consulting Group: future-built firms", value: 5, valueLabel: "5%" },
			{ label: "Data-risk abandonment", meta: "Gartner: unsupported AI projects abandoned through 2026", value: 60, valueLabel: "60%" },
		],
		max: 100,
		redRows: new Set([5]),
		note: [
			"Different surveys, one argument: buying access is easier than building governed value.",
			"Red marks the risk signal: projects abandoned because the data layer is not ready.",
		],
	});
}

function moneyChart() {
	return barChart({
		title: "The cost problem is the loop.",
		kicker: "ANNUAL AI COST SCENARIOS",
		rows: [
			{ label: "Normal worker API usage", meta: "50k workers, 30k input / 5k output tokens daily", value: 1.8, valueLabel: "$1.8m" },
			{ label: "Agentic Sonnet-style loop", meta: "5k agents, 2m input / 200k output tokens daily", value: 9.9, valueLabel: "$9.9m" },
			{ label: "100k ChatGPT Business seats", meta: "$20/user/month, annual billing, before integration", value: 24, valueLabel: "$24m" },
			{ label: "Agentic Fable-style loop", meta: "Same agent usage at higher public token rates", value: 33, valueLabel: "$33m" },
		],
		max: 35,
		redRows: new Set([3]),
		note: [
			"Illustrative annual run-rate. Seat prices and token prices are public; enterprise terms vary.",
			"Red marks the highest-cost path: long-running agents with weak limits.",
		],
	});
}

function timelineChart() {
	const axisY = 500;
	const events = [
		{ x: 240, side: "top", month: "JAN 2025", title: "DeepSeek", lines: ["open database exposed", "chats, keys, backend logs"] },
		{ x: 510, side: "bottom", month: "JUN 2025", title: "EchoLeak", lines: ["M365 Copilot injection", "data disclosure path"] },
		{ x: 790, side: "top", month: "JUL 2025", title: "Replit", lines: ["AI agent deleted a live", "production database"] },
		{ x: 1060, side: "bottom", month: "MAY 2026", title: "Semantic Kernel", lines: ["prompt injection path", "to remote code execution"] },
		{ x: 1320, side: "top", month: "JUN 2026", title: "SearchLeak", lines: ["Copilot one-click", "data exfiltration path"] },
	];

	const body = `<line x1="170" y1="${axisY}" x2="1430" y2="${axisY}" stroke="${theme.ink}" stroke-width="6" stroke-linecap="round"/>
${events
		.map((event) => {
			const isTop = event.side === "top";
			const lineEnd = isTop ? axisY - 68 : axisY + 105;
			const dateY = isTop ? 300 : lineEnd + 54;
			const titleY = dateY + 50;
			const textY = titleY + 38;
			return `<circle cx="${event.x}" cy="${axisY}" r="18" fill="${theme.ink}"/>
<line x1="${event.x}" y1="${isTop ? axisY - 22 : axisY + 22}" x2="${event.x}" y2="${lineEnd}" stroke="${theme.line}" stroke-width="5" stroke-linecap="round"/>
${text({ x: event.x - 95, y: dateY, value: event.month, size: 21, color: theme.grey, family: "Menlo, Consolas, monospace", letterSpacing: 5 })}
${text({ x: event.x - 95, y: titleY, value: event.title, size: 36, color: theme.ink, weight: 800 })}
${textLines({ x: event.x - 95, y: textY, lines: event.lines, size: 23, color: theme.grey, gap: 30 })}`;
	})
	.join("\n")}`;

	return svgBase(
		"Incidents are now execution stories.",
		"AI INCIDENT TIMELINE",
		body,
		["Dot, line, incident. Public examples; not a complete breach count."],
	);
}

function workforceChart() {
	return barChart({
		title: "AI is already in the layoff notice.",
		kicker: "RECENT WORKFORCE SHIFTS",
		rows: [
			{ label: "Workday", meta: "2025 restructuring tied to AI/platform investment", value: 1750, valueLabel: "1.8k" },
			{ label: "Salesforce support", meta: "2025 support roles reduced as Agentforce took work", value: 4000, valueLabel: "4k" },
			{ label: "Accenture", meta: "2025 quarter reduction while exiting roles it could not reskill", value: 11000, valueLabel: "11k" },
			{ label: "Amazon corporate", meta: "2025 cuts after CEO warned AI would reduce corporate workforce", value: 14000, valueLabel: "14k" },
			{ label: "Cloudflare", meta: "2026 agentic-AI reorganization", value: 1100, valueLabel: "1.1k" },
			{ label: "Oracle", meta: "2026 workforce decline; AI cited as one factor", value: 21000, valueLabel: "21k" },
		],
		max: 22000,
		redRows: new Set([5]),
		note: [
			"Different disclosure types: layoffs, role reductions, and workforce decline.",
			"Red marks the largest shift shown; Cloudflare row approximates its 14% cut.",
		],
	});
}

function twoFuturesChart() {
	const list = (x, y, items, color) =>
		items
			.map((item, index) => {
				const cy = y + index * 66;
				return `<circle cx="${x}" cy="${cy - 8}" r="7" fill="${color}"/>
${text({ x: x + 30, y: cy, value: item, size: 30, color, weight: 700 })}`;
			})
			.join("\n");

	const body = `<rect x="96" y="286" width="610" height="420" rx="8" fill="${theme.ink}" stroke="${theme.line}" stroke-width="2"/>
${text({ x: 148, y: 360, value: "Extractive AI", size: 43, color: theme.white, weight: 800 })}
${text({ x: 148, y: 402, value: "automation as headcount pressure", size: 24, color: theme.grey })}
${list(158, 476, ["cut roles", "hide knowledge", "thin apprenticeship", "lower trust"], theme.white)}
<rect x="894" y="286" width="610" height="420" rx="8" fill="${theme.white}" stroke="${theme.line}" stroke-width="2"/>
${text({ x: 946, y: 360, value: "Compounding AI", size: 43, color: theme.ink, weight: 800 })}
${text({ x: 946, y: 402, value: "automation as organizational leverage", size: 24, color: theme.grey })}
${list(956, 476, ["recover time", "index context", "redesign roles", "share upside"], theme.ink)}`;

	return svgBase(
		"The choice is cultural.",
		"TWO FUTURES FOR WORK",
		body,
		["The chart is not technical. It is the management choice sitting behind the technology."],
	);
}

function workforceUpsideChart() {
	const card = ({ x, fill, stat, statColor, kicker, title, lines, textColor }) => `<rect x="${x}" y="298" width="430" height="430" rx="8" fill="${fill}" stroke="${theme.line}" stroke-width="2"/>
${text({ x: x + 215, y: 386, value: kicker.toUpperCase(), size: 19, color: fill === theme.ink ? theme.grey : theme.grey, family: "Menlo, Consolas, monospace", anchor: "middle", letterSpacing: 4 })}
${text({ x: x + 215, y: 492, value: stat, size: 96, color: statColor, weight: 800, anchor: "middle" })}
${text({ x: x + 215, y: 562, value: title, size: 30, color: textColor, weight: 800, anchor: "middle" })}
${textLines({ x: x + 215, y: 612, lines, size: 23, color: theme.grey, gap: 30, anchor: "middle" })}`;

	const definitions = textLines({
		x: 96,
		y: 226,
		lines: [
			"PwC terms: professionalised = AI raises the value of expert judgment.",
			"Democratised = AI lowers the barrier for non-specialists.",
		],
		size: 24,
		color: theme.grey,
		gap: 31,
	});

	const body = `${definitions}
${card({
		x: 96,
		fill: theme.ink,
		stat: "40%",
		statColor: theme.white,
		kicker: "productivity",
		title: "productivity growth",
		lines: ["most AI-exposed firms", "vs least exposed"],
		textColor: theme.white,
	})}
${card({
	x: 585,
	fill: theme.white,
	stat: "2x",
	statColor: theme.ink,
	kicker: "job mix",
	title: "faster growth",
	lines: ["professionalised jobs", "vs democratised jobs"],
	textColor: theme.ink,
})}
${card({
	x: 1074,
	fill: theme.white,
	stat: "+42%",
	statColor: theme.red,
	kicker: "wages",
	title: "higher growth",
	lines: ["professionalised jobs", "since 2021"],
	textColor: theme.ink,
})}`;

	return svgBase(
		"The counter-signal matters.",
		"PWC AI JOBS BAROMETER 2026",
		body,
		[
			"Source: PwC 2026 public summary. Counter-signal, not contradiction.",
			"Shows where AI-created value is moving; layoffs can still rise elsewhere.",
			"Red marks professionalised-job wage growth, not layoffs funding wages.",
		],
	);
}

function harnessChart() {
	const list = (x, y, items, color = theme.ink) =>
		items
			.map((item, index) => {
				const cy = y + index * 42;
				return `<circle cx="${x}" cy="${cy - 8}" r="5" fill="${color}"/>
${text({ x: x + 22, y: cy, value: item, size: 23, color, weight: 600 })}`;
			})
			.join("\n");

	const arrow = (x1, x2) => `<line x1="${x1}" y1="500" x2="${x2}" y2="500" stroke="${theme.ink}" stroke-width="5" stroke-linecap="round"/>
<path d="M ${x2 - 16} 488 L ${x2} 500 L ${x2 - 16} 512" fill="none" stroke="${theme.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;

	const body = `<rect x="96" y="280" width="460" height="450" rx="8" fill="${theme.white}" stroke="${theme.line}" stroke-width="2"/>
${text({ x: 136, y: 352, value: "1. Company context", size: 36, color: theme.ink, weight: 800 })}
${text({ x: 136, y: 392, value: "The knowledge stays governed.", size: 24, color: theme.grey })}
${list(146, 470, ["documents", "code", "tickets", "records", "source permissions"])}
${arrow(570, 618)}
<rect x="626" y="280" width="348" height="450" rx="8" fill="${theme.ink}" stroke="${theme.ink}" stroke-width="2"/>
${text({ x: 800, y: 352, value: "2. Policy gateway", size: 35, color: theme.white, weight: 800, anchor: "middle" })}
${textLines({ x: 800, y: 400, lines: ["Nothing crosses", "without a rule."], size: 24, color: theme.grey, gap: 30, anchor: "middle" })}
<line x1="672" y1="488" x2="928" y2="488" stroke="${theme.red}" stroke-width="8" stroke-linecap="round"/>
${textLines({ x: 800, y: 555, lines: ["DLP", "budget", "model routing", "audit log"], size: 25, color: theme.white, weight: 700, gap: 38, anchor: "middle" })}
${arrow(990, 1038)}
<rect x="1046" y="280" width="458" height="450" rx="8" fill="${theme.white}" stroke="${theme.line}" stroke-width="2"/>
${text({ x: 1086, y: 352, value: "3. Narrow AI action", size: 36, color: theme.ink, weight: 800 })}
${text({ x: 1086, y: 392, value: "The model gets a bounded job.", size: 24, color: theme.grey })}
${list(1096, 470, ["retrieve sources", "answer or draft", "limited tool access", "human approval", "rollback path"])}
<rect x="96" y="766" width="1408" height="66" rx="8" fill="${theme.white}" stroke="${theme.line}" stroke-width="2"/>
${text({ x: 800, y: 809, value: "before writes, sends, deletes or deployments: approval first", size: 28, color: theme.ink, weight: 800, anchor: "middle" })}`;

	return svgBase(
		"Keep the company inside the gate.",
		"GOVERNED AI HARNESS",
		body,
		["This is the desired operating model: context in, rules in the middle, bounded action out."],
	);
}

function featureAccessVsCapability() {
	const body = `<path d="M 156 582 C 230 504 292 708 378 572 C 460 438 532 712 638 540 C 712 420 782 600 846 502 C 910 406 982 512 1046 454" fill="none" stroke="${theme.ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="156" y1="686" x2="1448" y2="686" stroke="${theme.red}" stroke-width="10" stroke-linecap="round"/>
<circle cx="156" cy="686" r="13" fill="${theme.red}"/>
<circle cx="1448" cy="686" r="13" fill="${theme.red}"/>
${text({ x: 156, y: 762, value: "ACCESS", size: 23, color: theme.grey, family: "Menlo, Consolas, monospace", letterSpacing: 7 })}
${text({ x: 930, y: 762, value: "CAPABILITY", size: 23, color: theme.grey, family: "Menlo, Consolas, monospace", letterSpacing: 7 })}
${text({ x: 156, y: 396, value: "tools everywhere", size: 25, color: theme.grey })}
${text({ x: 1090, y: 608, value: "governed path", size: 25, color: theme.grey })}`;

	return featureBase(
		"AI access is not AI capability.",
		"FORTUNE 500 AI",
		body,
	);
}

function featureShadowToSystem() {
	const node = (x, y, label, color = theme.ink) => `<circle cx="${x}" cy="${y}" r="16" fill="${color}"/>
${text({ x, y: y + 52, value: label, size: 21, color: theme.grey, anchor: "middle" })}`;
	const body = `<rect x="116" y="280" width="520" height="430" rx="8" fill="${theme.white}" stroke="${theme.line}" stroke-width="2"/>
${text({ x: 156, y: 350, value: "shadow AI", size: 34, color: theme.ink, weight: 800 })}
${node(206, 438, "prompts")}
${node(388, 402, "files")}
${node(528, 502, "code")}
${node(278, 586, "tools")}
${node(472, 622, "tickets")}
<path d="M 206 438 C 302 500 412 456 528 502 M 388 402 C 430 500 328 566 278 586 M 472 622 C 402 540 356 478 206 438" fill="none" stroke="${theme.line}" stroke-width="4" stroke-linecap="round"/>
<line x1="690" y1="496" x2="880" y2="496" stroke="${theme.red}" stroke-width="9" stroke-linecap="round"/>
<rect x="746" y="322" width="126" height="348" rx="8" fill="${theme.ink}"/>
${text({ x: 809, y: 474, value: "GATE", size: 23, color: theme.white, weight: 800, family: "Menlo, Consolas, monospace", letterSpacing: 3, anchor: "middle" })}
<path d="M 884 496 L 856 476 M 884 496 L 856 516" fill="none" stroke="${theme.red}" stroke-width="9" stroke-linecap="round"/>
<rect x="950" y="280" width="520" height="430" rx="8" fill="${theme.white}" stroke="${theme.line}" stroke-width="2"/>
${text({ x: 990, y: 350, value: "operating system", size: 34, color: theme.ink, weight: 800 })}
${textLines({ x: 990, y: 438, lines: ["indexed context", "permission checks", "budget controls", "audited actions"], size: 28, color: theme.ink, weight: 700, gap: 54 })}`;

	return featureBase(
		"Turn shadow AI into infrastructure.",
		"FORTUNE 500 AI",
		body,
	);
}

function featureInsideGate() {
	const body = `<rect x="156" y="300" width="920" height="372" rx="10" fill="${theme.white}" stroke="${theme.ink}" stroke-width="6"/>
${text({ x: 204, y: 370, value: "company context", size: 34, color: theme.ink, weight: 800 })}
${textLines({ x: 204, y: 440, lines: ["documents", "code", "tickets", "records"], size: 28, color: theme.grey, gap: 44 })}
<rect x="822" y="300" width="254" height="372" rx="8" fill="${theme.ink}"/>
${text({ x: 949, y: 432, value: "POLICY", size: 25, color: theme.white, weight: 800, family: "Menlo, Consolas, monospace", letterSpacing: 3, anchor: "middle" })}
<line x1="858" y1="486" x2="1040" y2="486" stroke="${theme.red}" stroke-width="8" stroke-linecap="round"/>
${textLines({ x: 949, y: 548, lines: ["DLP", "routing", "audit"], size: 25, color: theme.white, weight: 700, gap: 36, anchor: "middle" })}
<line x1="1076" y1="486" x2="1398" y2="486" stroke="${theme.ink}" stroke-width="6" stroke-linecap="round"/>
<path d="M 1398 486 L 1368 462 M 1398 486 L 1368 510" fill="none" stroke="${theme.ink}" stroke-width="6" stroke-linecap="round"/>
<rect x="1210" y="366" width="238" height="240" rx="120" fill="${theme.white}" stroke="${theme.line}" stroke-width="3"/>
${text({ x: 1329, y: 482, value: "AI", size: 70, color: theme.ink, weight: 800, anchor: "middle" })}
${text({ x: 1329, y: 532, value: "bounded action", size: 23, color: theme.grey, anchor: "middle" })}`;

	return featureBase(
		"Keep AI inside the gate.",
		"FORTUNE 500 AI",
		body,
	);
}

function featureCapabilityNotPanic() {
	const body = `<path d="M 132 448 C 244 324 360 608 500 430 C 616 282 724 572 852 424 C 952 310 1040 488 1138 388" fill="none" stroke="${theme.white}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
<line x1="132" y1="646" x2="1458" y2="646" stroke="${theme.red}" stroke-width="10" stroke-linecap="round"/>
<circle cx="354" cy="646" r="18" fill="${theme.white}"/>
<circle cx="800" cy="646" r="18" fill="${theme.white}"/>
<circle cx="1246" cy="646" r="18" fill="${theme.white}"/>
${text({ x: 354, y: 710, value: "DATA", size: 22, color: theme.grey, family: "Menlo, Consolas, monospace", letterSpacing: 6, anchor: "middle" })}
${text({ x: 800, y: 710, value: "RULES", size: 22, color: theme.grey, family: "Menlo, Consolas, monospace", letterSpacing: 6, anchor: "middle" })}
${text({ x: 1246, y: 710, value: "ACTION", size: 22, color: theme.grey, family: "Menlo, Consolas, monospace", letterSpacing: 6, anchor: "middle" })}`;

	return featureBase(
		"Capability, not panic.",
		"FORTUNE 500 AI",
		body,
		{ bg: theme.ink, foreground: theme.white, lockup: "dark", kickerColor: theme.grey },
	);
}

await writeJpeg("feature-ai-access-vs-capability-01.jpg", featureAccessVsCapability());
await writeJpeg("feature-ai-shadow-to-system-02.jpg", featureShadowToSystem());
await writeJpeg("feature-ai-inside-the-gate-03.jpg", featureInsideGate());
await writeJpeg("feature-ai-capability-not-panic-04.jpg", featureCapabilityNotPanic());
await writeJpeg("enterprise-ai-scaling-gap.jpg", scalingGapChart());
await writeJpeg("ai-cost-scenarios.jpg", moneyChart());
await writeJpeg("ai-incident-timeline-2025-2026.jpg", timelineChart());
await writeJpeg("ai-era-workforce-shifts.jpg", workforceChart());
await writeJpeg("ai-workforce-two-futures.jpg", twoFuturesChart());
await writeJpeg("ai-workforce-upside.jpg", workforceUpsideChart());
await writeJpeg("enterprise-ai-harness.jpg", harnessChart());

writeFileSync(join(outPath, "README.md"), `# Fortune 500 AI article visuals

Generated by \`scripts/generate-fortune-500-ai-visuals.mjs\`.

Includes four 1600x900 feature image options and seven article charts.

Simple Things style notes: cream background, black type, grey labels, red only for risk/gates/highlighted worker upside, and lockup branding in the lower-right.
`);
