---
title: "See your website the way ChatGPT does"
excerpt: "A free auditor that fetches any page with the same constraints as an AI answer engine and shows exactly what survives — built on Cloudflare Workers and tested on itself."
date: 2026-08-22
slug: see-your-website-the-way-chatgpt-does
featured_image: https://aeo.simplethin.gs/og.png
---

Some of your next customers may never see your website. They will ask ChatGPT, Claude, Perplexity or Google AI Mode a question, and an engine may fetch a handful of pages, read them, and answer directly — citing the sources it trusted. If your pages can be retrieved, parsed and quoted, they can be considered for the answer. If they cannot, you have excluded yourself before the quality of the content is considered.

The uncomfortable part is how differently those engines read. They typically fetch the HTML without running your JavaScript, waiting for a framework to hydrate, solving a bot challenge, or returning later. A site that looks immaculate in a browser can hand an agent a few hundred bytes of empty scaffolding — and to that agent, the scaffolding _is_ your website.

So I built a checker. [AEO Audit](https://aeo.simplethin.gs) is free: give it a page and it fetches it with the same important constraints as an answer engine — no JavaScript, cookies or login — then shows you what survived.

## Fetch it like an agent, not like a browser

The report's centrepiece is not the score. It is a panel that shows the page as the machine received it: the title and summary it found, the body text with no JavaScript executed, the heading outline a retrieval system would chunk on, and the entities the page actually declares about itself. People recognise their own site instantly — usually by what is missing from it.

Around that sit five weighted questions. Can the words be retrieved at all? Is an answer engine allowed to fetch and quote them? Does the page state, in machine-readable form, what it is and who published it? Is the content structured so it can be split into chunks that keep their meaning? And is it easy to trust and attribute — canonical address, real dates, content shaped like the questions people ask? Every finding says what we saw, why an engine cares, and what to change, ranked by the score you would recover.

Point it at a sitemap instead and it samples ten pages spread evenly across the estate — not the first ten, which are usually ten copies of one template — and rolls the results up by shared issue. That framing matters: a problem that appears on seven pages out of ten is a template problem, and fixing the template is one piece of work, not seven.

## Blocking training bots is a choice. Blocking answer engines is an accident.

The audit treats those as different findings, because they are. Keeping GPTBot or CCBot out of your content is a legitimate editorial position, and the tool does not mark it down. Blocking the agents that fetch pages to answer a live question — the ones that cite you — removes you from answers people are asking right now.

The sharpest version of this appears when a site's robots.txt politely welcomes AI crawlers while its firewall turns them away at the door. The permission is never read, because the request is refused before robots.txt applies. The tool names that contradiction when it finds it, and on several well-known sites, it finds it.

## It refuses to score what it cannot see

Early in testing, the tool fetched a global hotel group's careers site and confidently scored it 29 out of 100 — no content, no headings, nothing. Which was wrong. The site had answered with a bot-protection challenge page, and the tool had graded the challenge as if it were the site.

That is the worst failure a tool like this can have, because one confidently wrong number takes every honest finding down with it. So it no longer scores anything it cannot genuinely read. A challenge page, an error page, an origin failure — each gets a plain explanation of what happened instead of a fabricated grade. For the blocked site, that explanation is arguably worth more than any score: protection that challenges an auditor may challenge answer engines too, and a site can be perfectly built and still be invisible because nothing automated ever gets in.

## It failed its own audit first

The first thing a sceptical visitor does is point the auditor at the auditor. When I did, it scored 54 — a D. Sparse homepage, no structured data, nothing an engine could anchor to. The tool was the site it warns people about.

The fix was the same advice it gives everyone else: real readable content, honest structured data, a canonical address, and a curated map for language models. Run from its mirror — Cloudflare Workers cannot reliably fetch a hostname in their own zone — it now scores 98, with one warning left that I have chosen to keep. The homepage explainer that raised the score is also the marketing copy. Same words, both jobs.

## A public tool that cannot run up a bill

Anything free on the internet that fetches other people's websites and calls a language model is an invitation to run up someone else's bill. This one runs entirely on Cloudflare Workers with per-address pacing, account-wide daily ceilings that fail closed, and caching arranged so repeated views of a recent report cost nothing — only genuinely new work spends anything. When spend crosses agreed thresholds, I get an email; when a ceiling is reached, the expensive work declines politely and the deterministic report still renders. The worst case is a known number, not an open-ended invoice.

The written summary at the top of each report comes from a small language model kept on a tight leash: it sees only the audit's findings, never the audited page, and it is forbidden from inventing numbers. In testing, a larger, more expensive model wrote worse prose than the small one that won the job.

## Where I drew the line

Three things the tool deliberately does not do. It does not impersonate a browser to sneak past bot protection — that would measure a comforting lie, since the answer engines may be blocked too. It does not score pages it never truly saw. And it does not penalise sites for keeping training crawlers out, because that is their call to make.

## Try it

[aeo.simplethin.gs](https://aeo.simplethin.gs) — one page takes about five seconds; add your sitemap.xml and it will sample the estate. If the result raises questions about a site with hundreds or thousands of pages, that is the point where a sampled snapshot stops being enough — [ask me for a detailed audit](https://aeo.simplethin.gs/#detailed-audit) and I will look at the whole thing properly.
