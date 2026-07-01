export type ServicePage = {
	slug: string;
	title: string;
	shortTitle: string;
	description: string;
	eyebrow: string;
	lede: string;
	intro: string;
	bestFor: string[];
	outcomes: string[];
	approach: string[];
	related: string[];
};

export const servicePages: ServicePage[] = [
	{
		slug: "technical-architecture",
		title: "Technical Architect Consultant",
		shortTitle: "Technical architecture",
		description:
			"Technical architecture consultancy for small teams and larger organisations that need clearer platforms, better delivery decisions, and hands-on engineering leadership.",
		eyebrow: "Technical architect",
		lede:
			"Clear technical direction for teams that need to move faster without creating a harder system to run later.",
		intro:
			"I work across product, engineering, delivery, and operations to understand how the current system really behaves, where the constraints sit, and which changes will make the next few months easier. That can mean architecture reviews, delivery planning, platform decisions, technical due diligence, or hands-on implementation where the plan needs someone senior close to the code.",
		bestFor: [
			"Small teams that need senior architecture judgement without hiring a full leadership layer.",
			"Larger organisations that need an independent technical architect to unblock delivery, review a platform, or connect teams around a practical plan.",
			"Products where architecture, infrastructure, data, and delivery process are all tangled together.",
		],
		outcomes: [
			"A clear view of the current platform, risks, trade-offs, and decisions that matter.",
			"A practical roadmap that separates urgent fixes from structural improvements.",
			"Better alignment between engineering, product, operations, and leadership.",
			"Hands-on implementation support where recommendations need to become working systems.",
		],
		approach: [
			"Map the system, delivery flow, team constraints, and live operational risks.",
			"Identify the smallest changes that reduce the most friction.",
			"Document the decisions clearly so the team can keep moving after handover.",
		],
		related: [
			"technical architect consultant",
			"software architecture review",
			"fractional CTO",
			"platform architecture",
			"technical strategy",
		],
	},
	{
		slug: "devops-ci-cd",
		title: "CI/CD and DevOps Consultancy",
		shortTitle: "CI/CD and DevOps",
		description:
			"DevOps and CI/CD consultancy for teams that need safer releases, clearer deployment paths, better observability, and calmer production operations.",
		eyebrow: "DevOps",
		lede:
			"Deployment pipelines, release processes, observability, and production operations made understandable enough to improve.",
		intro:
			"I can work with a small product team or walk into a 1,000-person organisation and help improve the end-to-end path from code change to production. The work is not about adding ceremony. It is about finding where releases slow down, where confidence is missing, and where automation can make delivery safer.",
		bestFor: [
			"Teams with slow, brittle, or manual release processes.",
			"Organisations that need CI/CD pipelines reviewed, simplified, or rebuilt.",
			"Engineering groups that have tools in place but still lack release confidence.",
		],
		outcomes: [
			"Cleaner CI/CD pipelines with clearer ownership and fewer fragile steps.",
			"Better production visibility through logs, metrics, traces, alerts, and dashboards.",
			"Reduced release risk through automation, checks, rollback paths, and practical documentation.",
			"Less operator toil and fewer hidden production dependencies.",
		],
		approach: [
			"Trace the release path from commit to production.",
			"Separate genuinely useful controls from inherited process clutter.",
			"Improve the pipeline in small, reviewable steps so teams trust the change.",
		],
		related: [
			"DevOps consultant",
			"CI/CD consultant",
			"deployment pipeline review",
			"observability consultant",
			"release engineering",
		],
	},
	{
		slug: "performance-cost-optimisation",
		title: "Performance and Cost Optimisation Consultancy",
		shortTitle: "Performance and cost",
		description:
			"Performance, speed, reliability, and cloud cost optimisation consultancy for web platforms, APIs, infrastructure, and delivery systems.",
		eyebrow: "Performance and cost",
		lede:
			"Find the slow paths, expensive paths, and operational drag that stop a platform feeling simple.",
		intro:
			"I look for improvements that users, teams, and budgets can actually feel: faster pages, quicker APIs, leaner infrastructure, fewer wasted jobs, better caching, simpler hosting, and better visibility into where money and time are going.",
		bestFor: [
			"Apps that feel slower than they should but do not have one obvious bottleneck.",
			"Platforms where cloud, hosting, or build costs have grown without a clear explanation.",
			"Teams preparing for growth, migration, investor diligence, or a major product push.",
		],
		outcomes: [
			"Prioritised performance findings tied to business and user impact.",
			"Reduced waste in hosting, compute, build, cache, storage, or third-party service usage.",
			"Clearer dashboards and measurements so performance does not drift back into guesswork.",
			"Targeted code, infrastructure, and delivery changes that reduce friction.",
		],
		approach: [
			"Measure before changing so the team knows what actually moved.",
			"Rank fixes by impact, effort, risk, and reversibility.",
			"Leave behind practical monitoring so improvements stay visible.",
		],
		related: [
			"web performance consultant",
			"cloud cost optimisation",
			"API performance",
			"platform optimisation",
			"site speed consultant",
		],
	},
	{
		slug: "replatforming-modernisation",
		title: "Replatforming and Modernisation Consultant",
		shortTitle: "Replatforming",
		description:
			"Replatforming and modernisation consultancy for teams moving away from fragile systems, high costs, awkward hosting, or legacy workflows.",
		eyebrow: "Modernisation",
		lede:
			"Move platforms without turning the migration itself into the biggest risk in the business.",
		intro:
			"Replatforming is rarely just a hosting decision. It touches content, deployment, integrations, teams, security, analytics, operations, and customer experience. I help plan and deliver migrations in a way that keeps the business moving while reducing the number of moving parts over time.",
		bestFor: [
			"Teams trapped on expensive, fragile, or poorly understood infrastructure.",
			"Businesses moving CMS, hosting, API, or delivery platforms.",
			"Products that need modernisation without losing existing search value, operational knowledge, or customer trust.",
		],
		outcomes: [
			"A migration plan that names risks, dependencies, redirects, rollback paths, and ownership.",
			"Cleaner deployment, hosting, caching, and operations after the move.",
			"Reduced platform cost and maintenance burden where the current stack has outgrown its purpose.",
			"Preserved SEO, analytics, content workflows, and operational continuity.",
		],
		approach: [
			"Start with the risk map, not the shiny target architecture.",
			"Move in slices where possible so the organisation can learn safely.",
			"Make the new platform easier to operate than the old one.",
		],
		related: [
			"replatforming consultant",
			"Cloudflare migration",
			"CMS migration consultant",
			"platform modernisation",
			"legacy system migration",
		],
	},
	{
		slug: "ai-process-improvement",
		title: "AI Process Improvement Consultancy",
		shortTitle: "AI process improvement",
		description:
			"Practical AI process improvement for organisations that want better workflows, automation, and decision support without threatening people's jobs.",
		eyebrow: "Practical AI",
		lede:
			"Use AI where it genuinely improves the process, supports the team, and makes work easier to understand.",
		intro:
			"AI work is most useful when it starts with the people and the process, not the model. I help organisations map end-to-end workflows, find the points where information gets lost or repeated, and introduce AI in ways that support staff, reduce drudge work, and improve quality without framing people as the problem.",
		bestFor: [
			"Organisations that want AI benefits without creating fear, shadow tools, or unclear accountability.",
			"Teams with repetitive handoffs, reporting, content, support, research, or operational workflows.",
			"Leaders who need a practical AI plan that staff can trust and actually use.",
		],
		outcomes: [
			"Workflow maps that show where AI can help and where it should stay out of the way.",
			"Practical assistants, automations, or review steps that improve speed and quality.",
			"Clear guardrails around data, approval, privacy, human review, and operational ownership.",
			"Adoption plans that treat the team as partners, not obstacles.",
		],
		approach: [
			"Start with user interviews and process tracing before choosing tools.",
			"Prototype in narrow, measurable places where the team feels the benefit quickly.",
			"Keep humans responsible for judgement, approval, and relationship-sensitive decisions.",
		],
		related: [
			"AI process improvement",
			"AI workflow automation",
			"AI consultancy",
			"business process automation",
			"human centred AI",
		],
	},
	{
		slug: "web-platforms-cms",
		title: "Web Platform and CMS Consultancy",
		shortTitle: "Web platforms and CMS",
		description:
			"Web platform, CMS, publishing workflow, API integration, and product engineering consultancy for teams that need faster, easier systems.",
		eyebrow: "Web platforms",
		lede:
			"Fast, maintainable web platforms and publishing systems that fit how teams actually work.",
		intro:
			"I help teams design and rebuild websites, CMS workflows, content models, APIs, integrations, and internal tools. The best systems make publishing and product delivery feel lighter, while still giving engineering enough structure to operate the platform safely.",
		bestFor: [
			"Marketing, content, and product teams blocked by awkward CMS or publishing workflows.",
			"Engineering teams carrying too much custom web platform complexity.",
			"Organisations that need a fast public site, useful editing model, and reliable integration layer.",
		],
		outcomes: [
			"Cleaner content models and publishing flows.",
			"Faster pages, better metadata, and clearer search/social sharing behaviour.",
			"Practical API and integration layers that do not leak internal complexity into the user experience.",
			"Documentation and handover that make the platform easier to run.",
		],
		approach: [
			"Understand the publishing and operational workflow before rebuilding the interface.",
			"Keep the stack simpler than the organisation's process.",
			"Design for editors, users, and maintainers at the same time.",
		],
		related: [
			"CMS consultant",
			"web platform consultant",
			"content workflow",
			"API integration",
			"technical SEO",
		],
	},
];

export function getServicePage(slug: string | undefined): ServicePage | null {
	if (!slug) return null;
	return servicePages.find((service) => service.slug === slug) ?? null;
}
