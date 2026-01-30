# Implementation Notes

## Changes Made

### 1. Hero Section Content Management

The homepage hero section has been updated to support content management through Sanity CMS. Three new fields have been added to the Settings singleton in Sanity Studio:

#### New Fields Added:
- **Hero Heading** (`heroHeading`): Plain text field for the heading (e.g., "Empowering Your Business Through Technology")
- **Hero Description** (`heroDescription`): Rich text block content that supports **bold**, *italic*, and links (e.g., "At Simple Things Limited, we specialise in...")
- **Hero Availability** (`heroAvailability`): Plain text field for availability/CTA text (e.g., "Get in touch to discuss your project")

#### Files Modified:
1. `/studio/src/schemaTypes/singletons/settings.tsx` - Added three new fields to the Settings schema
2. `/nextjs-app/sanity/lib/queries.ts` - Updated `settingsQuery` to fetch the new hero fields
3. `/nextjs-app/app/page.tsx` - Updated homepage to use CMS fields instead of hardcoded text

### 2. Blog Posts Issue - Sanity Perspective Configuration

The issue with blog posts not appearing on the homepage is related to Sanity's **perspective** configuration, which was verified against the latest Sanity documentation (February 2025).

#### Current Configuration:
The client is configured with `perspective: "published"` in `/nextjs-app/sanity/lib/client.ts`, which is the **correct and recommended setting for production** as of 2025. This means:
- Only **published** documents are returned
- **Draft** documents are completely ignored
- This is the new default behavior as of February 2025

#### Solution:
**Blog posts must be PUBLISHED in Sanity Studio, not just saved as drafts.**

In Sanity Studio, when creating or editing a post:
1. Fill in all required fields (title, slug, cover image, etc.)
2. Click the **"Publish"** button (not just "Save")
3. The post will then appear on the homepage

#### Understanding Perspectives (2025 Update):
- `perspective: "published"` - Returns only published documents (default as of Feb 2025, recommended for production)
- `perspective: "previewDrafts"` - Returns published documents with draft overlays (used in Presentation/Visual Editing mode)
- The app already has draft mode support for previewing unpublished content via the Presentation Tool

The current setup follows the latest Sanity best practices for production use. Posts simply need to be published rather than left in draft state.

## How to Update CMS Values

### In Sanity Studio:

1. Navigate to your Sanity Studio (typically at `https://your-project.sanity.studio` or run locally with `npm run dev` in the `/studio` directory)

2. Go to **Settings** (in the sidebar)

3. You'll now see the new hero section fields:
   - **Hero Heading**: Update the main heading text
   - **Hero Description**: Use the rich text editor to add/edit description with formatting
   - **Hero Availability**: Update the availability/CTA text

4. Click **Publish** to save your changes

5. The changes will appear on your website immediately (with live updates enabled)

### For Blog Posts:

1. Go to **Posts** in the Sanity Studio sidebar
2. Create or edit a post
3. Fill in all required fields
4. **Important**: Click **"Publish"** to make the post visible on the homepage
5. If you only click "Save", the post remains in draft state and won't appear on the published site

## Testing the Changes

Since the project requires a valid Sanity project configuration, you'll need to:

1. Ensure your `.env.local` files are configured in both `/studio` and `/nextjs-app` directories
2. Run the Sanity Studio: `cd studio && npm run dev`
3. Run the Next.js app: `cd nextjs-app && npm run dev`
4. Navigate to the Sanity Studio and update the Settings
5. Check the homepage to see your changes reflected

## Important Notes

- The "SimpleThings" title remains hardcoded as requested
- Default fallback values are provided if CMS fields are empty
- The rich text editor for Hero Description supports bold, italic, and links
- All changes follow the existing codebase patterns and conventions
- Implementation verified against latest Sanity documentation (February 2025)
- The `perspective: "published"` setting is correct for production use
