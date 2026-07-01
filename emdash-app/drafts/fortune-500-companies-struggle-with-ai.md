# Fortune 500 companies struggle with AI

Description: Most large companies have bought access to AI. Far fewer have turned it into a governed, private, cost-controlled system that improves real work.

Slug: fortune-500-companies-struggle-with-ai

Date: 2026-06-30

Author: Justin Avery

Tags: AI strategy, enterprise AI, Fortune 500, automation, governance

Social draft: Fortune 500 companies do not have an AI adoption problem. They have an AI strategy problem: uncontrolled spend, unclear data boundaries, fragile agents, and not enough focus on internal knowledge. The opportunity is still enormous, but only if AI is treated as infrastructure for better work rather than a panic purchase.

---

The headline is unfair if it means large companies have ignored AI.

They have not.

OpenAI said in August 2023 that teams in [more than 80% of Fortune 500 companies had registered ChatGPT accounts](https://openai.com/index/introducing-chatgpt-enterprise/). McKinsey's 2025 global survey found that [88% of respondents said their organizations regularly used AI in at least one business function](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai). Anthropic, Microsoft, Google, Amazon, Salesforce, ServiceNow and every major consultancy now sell some version of "enterprise AI" into the same boardrooms.

So no, Fortune 500 companies have not missed AI.

The more useful and more uncomfortable claim is this: many of them have mistaken access for capability.

Giving 50,000 employees a chatbot is not the same as redesigning how work happens. Buying a premium seat is not the same as knowing which data can leave the building. Building a proof of concept is not the same as running an audited system that can answer from internal knowledge, respect permissions, control cost, improve quality and avoid quietly leaking a decade of competitive advantage into someone else's infrastructure.

That is the real struggle. It is not whether a large company has "embraced AI". It is whether AI has been absorbed into the organization with the same seriousness as finance, legal, information security, procurement, data engineering, platform operations and workforce design.

By that standard, the market is much less mature than the headlines suggest.

## The adoption numbers hide the problem

"How many Fortune 500 companies have fully embraced AI?" sounds like it should have a clean answer. It does not, because "fully embraced" is not a public reporting category.

There are proxies, though, and they tell a consistent story.

OpenAI's 80% Fortune 500 number measured registered ChatGPT accounts associated with corporate domains. That is an adoption signal, but it is also a warning signal. It suggests bottom-up employee demand moved faster than many companies' governance, procurement and data architecture.

McKinsey's 2025 survey gives the broader enterprise picture. AI use is widespread, but nearly two-thirds of respondents said their organizations had not yet begun scaling AI across the enterprise. Only about one-third had begun scaling. Only [39% reported any enterprise-level EBIT impact from AI](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai), and most of those reported less than 5% of EBIT. McKinsey defined "AI high performers" as respondents with 5% or more EBIT attributable to AI and significant value from AI use. That group was about 6%.

That is the gap. AI is everywhere. Scaled, measurable AI value is not.

Other consultant research supports the same direction, with useful differences in emphasis.

Gartner predicted in 2024 that [at least 30% of generative AI projects would be abandoned after proof of concept by the end of 2025](https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025), citing poor data quality, weak risk controls, rising cost and unclear business value. In 2025 it added a sharper data warning: organizations would abandon [60% of AI projects unsupported by AI-ready data through 2026](https://www.gartner.com/en/newsroom/press-releases/2025-02-26-lack-of-ai-ready-data-puts-ai-projects-at-risk). Gartner also warned in June 2025 that [more than 40% of agentic AI projects would be canceled by the end of 2027](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027).

BCG's 2025 report [The Widening AI Value Gap](https://www.bcg.com/publications/2025/are-you-generating-value-from-ai-the-widening-gap) is even blunter: 5% of firms were "future-built" and achieving AI value at scale, 35% were scaling, and 60% were reporting little to no material value. Deloitte's 2026 [State of AI in the Enterprise](https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html) provides the counterweight: about 34% of organizations said they were using AI to deeply transform the business, not merely automate existing processes. But Deloitte separately reported that only [21% of enterprises had mature governance for agentic AI](https://www.deloitte.com/us/en/insights/topics/emerging-technologies/ai-agents-scaling-faster.html).

So the consultant reports do not contradict the McKinsey story as much as triangulate it. Adoption is high. Ambition is high. Pockets of ROI are real. But enterprise-scale value is still concentrated in a small group, and the blockers are familiar: data, governance, workflow redesign, leadership, cost control and trust.

![Simple Things chart showing consultant report AI adoption, value and governance gaps](/images/posts/fortune-500-ai/enterprise-ai-scaling-gap.jpg)

Public company risk disclosures show the same discomfort from another angle. The Financial Times reported in 2024, based on Arize AI research, that [56% of Fortune 500 companies cited AI as a risk factor in annual reports](https://www.ft.com/content/5ee96d38-f55b-4e8a-b5c1-e58ce3d4111f), up from 9% in 2022. A broader academic analysis of more than 30,000 SEC 10-K filings found AI risk mentions rose from [4% in 2020 to over 43% in the most recent 2024 filings](https://arxiv.org/abs/2508.19313).

There is nothing wrong with risk disclosure. It is healthy. But it does show that many companies are still at the stage where AI is simultaneously a growth story, a cost story, a legal story, a security story and a labor story. That is not maturity. That is a board-level knot.

## The first bill is seats. The second bill is tokens. The third bill is chaos.

The visible cost of AI is easy to understand.

OpenAI's published ChatGPT Business price is [$20 per user per month when billed annually](https://openai.com/business/pricing/), with Enterprise on custom pricing. A 10,000-person rollout at the Business list price is $2.4 million per year before integration, training, support, compliance work or usage-based add-ons. A 100,000-person rollout is $24 million per year.

For a Fortune 500 company, that is not frightening by itself. It is cheaper than many enterprise software estates.

The harder cost is variable usage.

Anthropic's current public API pricing, for example, lists Sonnet 4.6 at [$3 per million input tokens and $15 per million output tokens](https://claude.com/pricing). Opus 4.8 is listed at $5 input and $25 output per million tokens. Fable 5 is listed at $10 input and $50 output per million tokens, though the same page marks it unavailable. Those numbers are manageable for carefully designed workflows. They become unpredictable when every team builds its own agents, uploads large files repeatedly, runs long-context code tasks, retries bad prompts, or leaves autonomous systems looping through tools.

Here is a conservative way to think about it.

If 50,000 knowledge workers each used an AI system for 30,000 input tokens and 5,000 output tokens per working day, over 220 working days, that would be about 330 billion input tokens and 55 billion output tokens a year. At Sonnet-style pricing, the raw API cost would be roughly $1.8 million. At Opus-style pricing, roughly $3 million. At Fable-style pricing, roughly $6 million.

That is still not catastrophic for a giant company. The danger is not normal usage. The danger is ungoverned usage.

Now imagine 5,000 internal coding, research or operations agents, each burning two million input tokens and 200,000 output tokens per day as they search repositories, inspect logs, re-run tasks, call tools, reason over long contexts and retry failures. Over 220 working days, the annual usage becomes 2.2 trillion input tokens and 220 billion output tokens. At Sonnet-style pricing, that is about $9.9 million. At Fable-style pricing, about $33 million. Add premium modes, priority tiers, data retrieval costs, vendor minimums, observability, security review, human review, cloud hosting and integration work, and the number stops looking like a chatbot subscription.

![Simple Things chart comparing annual AI seat and token cost scenarios](/images/posts/fortune-500-ai/ai-cost-scenarios.jpg)

This is what "token maxing" really means in an enterprise. It is not an employee asking ChatGPT to rewrite a paragraph. It is a poorly bounded system that turns every question into a full-document retrieval job, every task into a multi-agent debate, every code change into a repository-wide analysis and every failure into a retry storm.

The answer is not to ban usage. The answer is to meter it like infrastructure.

Every serious enterprise AI platform needs usage budgets by team, model routing by task, prompt caching, retrieval limits, file-size controls, rate limits, human approval gates for expensive paths, and reporting that finance and technology leaders can both understand. Without that, AI spend becomes a new cloud bill: defensible in theory, surprising in practice, and politically painful when the CFO asks which part of the business case it belongs to.

## The secrecy problem is not as simple as "they train on your data"

There is a lazy version of the AI privacy argument: "If you paste it into OpenAI or Anthropic, they train on it and your secrets are gone."

That is not an accurate description of the main enterprise products.

OpenAI's Services Agreement says business customers retain ownership of inputs and outputs, and that OpenAI will not use customer content to develop or improve services unless the customer explicitly agrees. Its pricing page also says Business and Enterprise content is not used to train models. Anthropic's Commercial Terms similarly say the customer retains rights to inputs, owns outputs, and that Anthropic may not train models on customer content from services.

Those commitments matter. They are the reason many enterprises can use these tools at all.

But "not used for model training" is not the same as "no strategic exposure".

Once employees send internal material to a third-party AI platform, the organization has created a new processing path. That path may include vendor systems, logging, abuse monitoring, subprocessors, retention settings, integrations, support processes, legal obligations and administrators. Anthropic's privacy policy for non-enterprise services says inputs and outputs may be used to train and improve models unless users opt out, with exceptions for safety review and feedback. The same policy notes that connected third-party services may receive inputs, outputs and instructions when a user enables integrations. OpenAI's business agreement allows customer content to be used as necessary to provide services, comply with law, enforce policies and prevent abuse, and it permits disclosure where legally required.

That does not mean the vendors are acting improperly. It means the boundary has moved.

For a company whose advantage lives in pricing models, customer lists, supply-chain contracts, clinical protocols, semiconductor processes, unreleased product plans, legal strategy or source code, that boundary matters. The loss is not always "the model trained on our data". The loss can be that sensitive context now exists in a place the company does not fully operate, inspect, isolate or govern.

This is also why consumer tools inside corporations are dangerous. If an employee uses a personal account because procurement is slow, the enterprise protections may not apply. If a team connects a chatbot to Google Drive, Slack, GitHub, Jira, Salesforce or Microsoft 365 without permission-aware retrieval, the model might become the easiest way to discover documents that the user should technically have been able to access but never would have found. That is not a model problem. That is an enterprise data governance problem exposed by a better interface.

## AI incidents are already real, but not always in the form people expect

There is no reliable public tally of "Fortune 500 security breaches caused by autonomous AI agents". Companies rarely disclose incidents in that language, and many AI failures happen inside pilots, support flows, code reviews or internal workflows long before they become reportable events.

But the evidence is enough to reject complacency, and the more relevant examples are now 2025 and 2026.

In January 2025, Wiz reported that [DeepSeek had exposed a publicly accessible database](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak) containing more than a million lines of logs, chat history, API keys and backend details. DeepSeek is not a Fortune 500 procurement story, but it is a useful warning: the AI platform itself can become a place where sensitive prompts, keys and operational metadata accumulate.

In June 2025, researchers disclosed [EchoLeak](https://nvd.nist.gov/vuln/detail/CVE-2025-32711), a Microsoft 365 Copilot vulnerability tracked as CVE-2025-32711. The lesson was not "Copilot is unsafe". It was more specific and more important: an enterprise assistant connected to email, documents and internal search becomes a high-value exfiltration surface if prompt injection and retrieval boundaries are weak.

The more alarming class of incident is autonomous action. In July 2025, [Replit's AI coding agent was widely reported to have deleted a production database during a code freeze](https://www.businessinsider.com/replit-ceo-apologizes-ai-coding-tool-delete-company-database-2025-7), after the user had instructed it not to make changes. Replit's CEO apologized publicly. The incident is useful not because Replit is a Fortune 500 company, but because it demonstrates the failure mode executives should care about: an AI system with tool access, inadequate guardrails, excessive autonomy, and enough confidence to do damage quickly.

In 2026, the pattern kept moving. Microsoft published research on ["Prompts Become Shells"](https://www.microsoft.com/en-us/security/blog/2026/05/07/prompts-become-shells-rce-vulnerabilities-ai-agent-frameworks/), showing how prompt injection in AI agent frameworks could become remote code execution in systems such as Semantic Kernel and AutoGen when unsafe code-evaluation paths were exposed. Varonis then disclosed [SearchLeak](https://www.varonis.com/blog/searchleak), a Microsoft 365 Copilot Enterprise attack path that could enable data exfiltration through a one-click interaction.

![Simple Things timeline showing 2025 and 2026 AI incident examples](/images/posts/fortune-500-ai/ai-incident-timeline-2025-2026.jpg)

The same pattern can apply to email, CRM records, cloud infrastructure, customer support, code deployment, legal documents and finance workflows. An AI agent does not need malicious intent to cause a serious incident. It only needs permission, ambiguity and a weak harness.

Prompt injection makes this worse. Any agent that reads external content and follows instructions can be attacked through the content it reads: a web page, email, document, ticket, pull request or chat message can contain instructions intended for the model rather than the human. If that model can send emails, change files, deploy code, update records or call APIs, prompt injection becomes an operational security issue.

The right conclusion is not "never use agents". It is "never let agents act like trusted employees until they are governed like untrusted software".

## The human cost cannot be hand-waved away

The most controversial part of enterprise AI is not the technology. It is what leadership does with the time it saves.

McKinsey's 2025 survey found that respondents were split on employment impact. Across organizations, 32% expected an overall workforce reduction of 3% or more in the coming year due to AI, 43% expected little or no change, and 13% expected an increase of 3% or more. Across business functions, a median of 17% of respondents reported AI-related workforce declines in the past year, while a median of 30% expected declines in the next year.

That is not a layoff count. It is not a Fortune 500-specific number. But it does show where executive expectations are moving.

The 2025 and 2026 headlines make that expectation feel less abstract.

Workday said in February 2025 it would lay off [1,750 employees, about 8.5% of its workforce](https://apnews.com/article/437581ad79d6e1cef2de7b300015dfbb), while prioritizing AI and platform development. Salesforce CEO Marc Benioff said in 2025 that the company had reduced customer support headcount from 9,000 to about 5,000 as AI agents handled more interactions; Customer Experience Dive reported the company had [cut about 4,000 customer service agents](https://www.customerexperiencedive.com/news/salesforce-future-customer-service-people-ai/759303/). Amazon warned employees in June 2025 that generative AI would likely mean [fewer people doing some jobs](https://www.aboutamazon.com/news/company-news/amazon-ceo-andy-jassy-on-generative-ai), and later confirmed about [14,000 corporate layoffs](https://www.aljazeera.com/news/2025/10/28/is-artificial-intelligence-to-blame-for-amazon-job-cuts) while spending heavily on AI.

The pattern continued into 2026. Cloudflare announced what it called a reorganization for the agentic AI era, saying it would reduce its workforce by [about 14%](https://blog.cloudflare.com/building-for-the-future/). Oracle's fiscal 2026 workforce fell by about [21,000 people, from 162,000 to 141,000](https://arstechnica.com/ai/2026/06/oracles-21000-layoffs-help-drive-its-debt-fueled-ai-investments/), with reporting on its annual filing noting that AI adoption and deployment had resulted, and could continue to result, in workforce reductions. Accenture added another version of the same story: it was cutting staff it could not reskill quickly enough for AI-era demand while still planning to hire in other areas, according to [Business Insider's coverage of its 2025 earnings commentary](https://www.businessinsider.com/accenture-consulting-cut-staff-reskill-hiring-ai-era-sweet-earnings-2025-9).

There are caveats, and they matter. Cloudflare said it was still hiring. Accenture said it planned to expand headcount. Amazon's layoffs were also about bureaucracy and management layers. Oracle's workforce decline was part of a wider restructuring and AI infrastructure bet. Not every company says "AI caused these layoffs", and it would be lazy to pretend otherwise.

But this article makes a stronger editorial assumption: when a large software or technology company cuts thousands of workers in 2025 or 2026, it is rarely because there is suddenly no work to do. The work is still there. Customers still need support. Products still need shipping. Infrastructure still needs operating. The change is that new automation, AI-assisted software delivery, agentic customer service, platform consolidation and offshore execution are altering the economics of how many people the company believes it needs to do that work.

That is the uncomfortable claim. AI does not need to be the only cause of a layoff to be part of the layoff logic. It changes the calculation in the spreadsheet. It changes the boardroom story about acceptable margins. It changes which roles are considered core, which roles are considered transitional, and which roles can be absorbed into a tool, a team in another geography, or a smaller group of employees working with better systems.

![Simple Things chart comparing recent AI-era workforce shifts at large technology companies](/images/posts/fortune-500-ai/ai-era-workforce-shifts.jpg)

If AI is treated only as a cost-reduction tool, the cultural result is obvious. Employees will hide knowledge, resist automation, avoid documenting their work, and view every AI initiative as a quiet redundancy exercise. The company may still capture savings, but it will do so by turning its own workforce into an adversary.

That is a poor way to build an intelligent organization.

The better opportunity is more radical and more humane: use AI to reduce drudgery, then give some of the saved time back.

There is evidence for a less fatalistic story, but it has to be read carefully. PwC's 2026 [Global AI Jobs Barometer](https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html), published on June 15, 2026, analysed more than a billion job ads across six continents. Its public summary says productivity growth is 40% higher at companies most exposed to AI than at the least exposed companies. It also says jobs "professionalised" by AI are growing twice as fast as jobs "democratised" by AI, with 42% higher wage growth since 2021.

In PwC's language, a "professionalised" job is one where AI removes some routine work but increases the premium on human expertise, judgment, leadership and accountability. A "democratised" job is one where AI lowers the skill barrier, allowing non-specialists to do work that previously required more specialist capability.

That does not cancel the layoff story. It complicates it. PwC is not saying every AI-exposed employer is hiring, or that wage growth is being funded directly by layoffs. The cleaner reading is that value is moving: toward companies that redesign work around AI, toward roles where AI increases the need for judgment, and away from roles that can be simplified, automated, consolidated or moved elsewhere.

![Simple Things stat cards showing PwC AI jobs and productivity findings](/images/posts/fortune-500-ai/ai-workforce-upside.jpg)

If a team can produce better work in four days than it previously produced in five, the company has choices. It can increase throughput. It can reduce headcount. Or it can redesign work so employees keep more of their lives while the organization keeps or improves output.

That last option is not sentimental. It is strategic.

People with better work-life balance are more likely to think clearly, stay longer, communicate better, make fewer tired mistakes, and bring more judgment to the work AI cannot do. In an AI-enabled company, the scarce resource is not text generation. It is context, taste, accountability, trust, relationships, prioritization and domain judgment.

Burning those people out while giving them faster autocomplete is not transformation. It is industrialized impatience.

## The flip: Fortune 500 companies are sitting on the real advantage

The best argument for enterprise AI is not that OpenAI, Anthropic or Google have powerful models. They do.

The best argument is that large companies already own something the model providers do not: the operating memory of the business.

A Fortune 500 company has decades of contracts, specifications, postmortems, sales calls, support tickets, policy documents, process maps, customer research, pricing decisions, engineering notes, incident reports, legal opinions, brand guidance, meeting transcripts, supplier performance data, regulatory correspondence and product history.

Most of that knowledge is badly indexed. Some of it is trapped in SharePoint. Some is in email. Some is in Slack or Teams. Some is in Confluence, Jira, GitHub, ServiceNow, Salesforce, SAP, Workday, Snowflake, old file shares and the heads of employees who are close to retirement. Search finds filenames. People ask around. New starters spend months learning who knows what.

That is the opportunity.

The goal should not be to pour every secret into a frontier model and hope for magic. The goal should be to build a permission-aware knowledge layer that makes the company's own context usable.

That usually means:

- Classifying data by sensitivity, jurisdiction, owner and allowed use.
- Indexing documents, records and code into search and vector systems.
- Preserving source permissions all the way through retrieval.
- Using retrieval-augmented generation so answers are grounded in live internal sources rather than model memory.
- Keeping regulated, proprietary or high-value context inside company-controlled infrastructure where needed.
- Routing low-risk work to external models and sensitive work to internal or private deployments.
- Logging every answer, source, tool call and user action.
- Evaluating outputs against known answers before scaling.
- Treating AI systems as products with owners, budgets, support paths and decommissioning plans.

This is less glamorous than a keynote demo. It is also where the value is.

An internal AI assistant that can answer "What did we decide last time this supplier missed SLA?", "Which customers are affected by this API change?", "Do we have a precedent for this contract clause?", "Which systems depend on this data feed?", or "What went wrong the last three times we tried this migration?" is far more valuable than a generic chatbot that writes a polished email.

The foundation model supplies language and reasoning. The company supplies context. The retrieval layer is where the two meet.

![Simple Things diagram showing a governed enterprise AI architecture from internal data to audited action](/images/posts/fortune-500-ai/enterprise-ai-harness.jpg)

## Hosted inside the company does not mean building everything from scratch

"Host the model internally" can mean several things.

At one end, a company runs open-weight models on its own infrastructure. That may be appropriate for highly sensitive workloads, regulated environments, latency needs, predictable high-volume inference, or sovereignty requirements.

At the other end, a company uses private cloud deployments, dedicated workspaces, data residency, enterprise key management, contractual privacy protections and strict retention controls from a vendor. That may be enough for many business functions.

The mistake is treating this as a religious argument.

Internal models are not automatically safer if the retrieval system ignores permissions, logs secrets carelessly or lets agents call production APIs. External models are not automatically reckless if contracts, controls, data minimization and routing are done properly.

The right architecture is usually hybrid:

- Use frontier vendor models for general reasoning, drafting, summarization, ideation and low-risk work.
- Use internal or private models for sensitive retrieval, regulated data, source code, high-volume inference and workflows where data locality matters.
- Use a model gateway so teams do not hard-code one vendor everywhere.
- Use policy routing so the data decides which model is allowed.
- Use evals so model changes do not silently degrade critical workflows.
- Use budget controls so a bad agent cannot turn a process error into a six-figure bill.

This approach also reduces geopolitical and vendor risk.

OpenAI's business terms allow service suspension where required by law, and export controls already affect the AI supply chain through advanced chips and technology access. The U.S. government's policy posture can change. Vendors can change model availability, pricing, terms, regions, safety policies and supported features. Anthropic's pricing page already marks Fable 5 as unavailable while still listing token pricing. Whether the cause is safety, policy, capacity or commercial strategy, the enterprise lesson is the same: a company that builds directly on one model with no abstraction has made that vendor part of its operating model.

That might be acceptable. It should not be accidental.

## The harness matters more than the demo

The strongest AI systems inside large companies will not be the ones with the flashiest chat interface. They will be the ones with the best harness.

A proper enterprise AI harness includes:

- Identity-aware access control.
- Data loss prevention before prompts leave the boundary.
- Retrieval that respects source permissions.
- Tool permissions scoped to the task, not the user's entire account.
- Read-only defaults.
- Human approval for writes, sends, deletes, purchases and deployments.
- Sandboxed execution for code and data tasks.
- Test environments before production.
- Rate limits and spend limits.
- Prompt injection detection and content isolation.
- Secrets detection in prompts, files and outputs.
- Full audit logs.
- Rollback paths.
- Incident response playbooks.
- Continuous evaluation against real business examples.

This is how companies can get value from powerful models such as Fable, Mythos, GPT, Claude, Gemini or open-weight alternatives without handing them the keys to the kingdom.

It is also how AI becomes boring enough to trust.

The future is not one super-assistant doing everything. It is a portfolio of constrained assistants, retrieval systems, workflow agents and decision-support tools, each with a clear job, clear data boundaries and clear accountability.

## The companies that win will not be the loudest adopters

The Fortune 500 AI race is not a race to announce pilots. It is a race to absorb AI into the operating fabric of the business.

The losers will do three things.

They will buy seats and call it transformation. They will let employees paste sensitive material into whichever tool feels easiest. They will deploy agents before they have permissioning, rollback, evaluation and cost control.

The winners will do something quieter.

They will map their knowledge. They will clean their data. They will index what matters. They will build permission-aware retrieval. They will decide which workloads can use external models and which must stay inside. They will measure time saved, errors reduced, revenue protected, customers retained and decisions improved. They will give employees a reason to participate rather than a reason to fear the system.

And they will make a cultural choice.

AI can become a machine for extracting more work from fewer people. Or it can become a way to make work more humane while still making the company more effective.

![Simple Things comparison of extractive AI and compounding AI workforce choices](/images/posts/fortune-500-ai/ai-workforce-two-futures.jpg)

That second path is harder. It requires strategy, architecture, governance and trust. It requires leaders to stop treating AI as a procurement trend and start treating it as a redesign of how the organization learns.

Fortune 500 companies do not struggle with AI because they lack access to models.

They struggle because the model is the easy part.

The hard part is knowing what the business knows, deciding what must stay private, controlling what agents can do, measuring whether the work got better, and sharing the upside with the people whose judgment makes the system useful.

That is where the real AI strategy begins.

## Sources and further reading

- [OpenAI: Introducing ChatGPT Enterprise](https://openai.com/index/introducing-chatgpt-enterprise/)
- [OpenAI: Business pricing](https://openai.com/business/pricing/)
- [OpenAI: Services Agreement](https://openai.com/policies/services-agreement/)
- [Anthropic: Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms)
- [Anthropic: Claude pricing](https://claude.com/pricing)
- [Anthropic: Privacy Policy](https://www.anthropic.com/legal/privacy)
- [McKinsey: The state of AI in 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
- [Gartner: 30% of GenAI projects abandoned after proof of concept by end of 2025](https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025)
- [Gartner: Lack of AI-ready data puts AI projects at risk](https://www.gartner.com/en/newsroom/press-releases/2025-02-26-lack-of-ai-ready-data-puts-ai-projects-at-risk)
- [Gartner: Over 40% of agentic AI projects canceled by end of 2027](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)
- [BCG: The widening AI value gap](https://www.bcg.com/publications/2025/are-you-generating-value-from-ai-the-widening-gap)
- [Deloitte: State of AI in the Enterprise](https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html)
- [Deloitte: AI agents are scaling faster than governance](https://www.deloitte.com/us/en/insights/topics/emerging-technologies/ai-agents-scaling-faster.html)
- [PwC: 2026 Global AI Jobs Barometer](https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html)
- [Financial Times: Biggest US companies warn of growing AI risk](https://www.ft.com/content/5ee96d38-f55b-4e8a-b5c1-e58ce3d4111f)
- [Are Companies Taking AI Risks Seriously? A Systematic Analysis of Companies' AI Risk Disclosures in SEC 10-K forms](https://arxiv.org/abs/2508.19313)
- [Wiz: Exposed DeepSeek database leak](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak)
- [NVD: CVE-2025-32711](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)
- [Business Insider: Replit CEO apologizes after AI coding tool deleted a company database](https://www.businessinsider.com/replit-ceo-apologizes-ai-coding-tool-delete-company-database-2025-7)
- [Microsoft Security: Prompts Become Shells](https://www.microsoft.com/en-us/security/blog/2026/05/07/prompts-become-shells-rce-vulnerabilities-ai-agent-frameworks/)
- [Varonis: SearchLeak](https://www.varonis.com/blog/searchleak)
- [AP: Workday laying off 1,750 employees](https://apnews.com/article/437581ad79d6e1cef2de7b300015dfbb)
- [Customer Experience Dive: Salesforce customer service and AI agents](https://www.customerexperiencedive.com/news/salesforce-future-customer-service-people-ai/759303/)
- [Amazon: CEO Andy Jassy on generative AI](https://www.aboutamazon.com/news/company-news/amazon-ceo-andy-jassy-on-generative-ai)
- [Al Jazeera: Amazon job cuts and AI spending](https://www.aljazeera.com/news/2025/10/28/is-artificial-intelligence-to-blame-for-amazon-job-cuts)
- [Cloudflare: Building for the future](https://blog.cloudflare.com/building-for-the-future/)
- [Ars Technica: Oracle's 21,000 layoffs and AI investments](https://arstechnica.com/ai/2026/06/oracles-21000-layoffs-help-drive-its-debt-fueled-ai-investments/)
- [Business Insider: Accenture staff cuts and AI-era reskilling](https://www.businessinsider.com/accenture-consulting-cut-staff-reskill-hiring-ai-era-sweet-earnings-2025-9)
