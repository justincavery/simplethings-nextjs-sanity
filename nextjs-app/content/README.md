# Content Workflow

This site uses local Markdown/MDX content instead of Sanity.

## New Blog Post

From `nextjs-app`:

```bash
npm run content:new -- "Title of the post" --tweet "https://x.com/user/status/123" --link "https://example.com"
```

That creates a draft in `content/posts`. Edit the body, commit, push, and Cloudflare rebuilds the site.

Useful frontmatter fields:

```yaml
tweetUrl: "https://x.com/user/status/123"
links:
  - "https://example.com/source"
socialDraft: "A short version you can paste into Twitter after the blog post is live."
tags:
  - Cloudflare
  - DevOps
```

## Projects

Project files live in `content/projects`. Use `businessBenefits` for the outcome story and `technicalHighlights` for the implementation story.
