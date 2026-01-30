# Fix: Posts Not Appearing on Homepage

## Problem
Published posts in Sanity Studio were not appearing on the homepage (https://simplethin.gs), even though they were accessible at their individual post URLs (e.g., https://simplethin.gs/posts/machine-for-dying).

## Root Cause
The issue was caused by two factors:

### 1. CDN Caching
The Sanity client was configured with `useCdn: true`, which means:
- Query results are cached at Sanity's globally distributed CDN
- CDN serves fast, cached responses for better performance
- When a new post is published, the CDN continues serving the old cached result
- The homepage query was returning stale data (showing no posts)

### 2. No Page Revalidation
The homepage (`app/page.tsx`) had no revalidation configured:
- Next.js pages without `revalidate` are statically generated at build time
- They continue showing the same content until the next build
- New posts published after deployment wouldn't appear without a rebuild

## Solution
Two changes were made to ensure fresh content:

### Change 1: Disable CDN (`useCdn: false`)
**File:** `nextjs-app/sanity/lib/client.ts`

```typescript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN to ensure fresh content for published posts
  perspective: "published",
  // ... other config
});
```

**Impact:**
- ✅ Queries always fetch the latest published content
- ✅ New posts appear immediately after publication
- ⚠️ Slightly slower queries (no CDN caching)
- ⚠️ More API requests to Sanity (higher API usage)

### Change 2: Add Page Revalidation
**File:** `nextjs-app/app/page.tsx`

```typescript
// Revalidate this page every 60 seconds to ensure new posts appear
export const revalidate = 60;
```

**Impact:**
- ✅ Homepage refreshes data every 60 seconds
- ✅ New posts will appear within 1 minute of publication
- ✅ Balances freshness with performance
- ℹ️ Uses Next.js Incremental Static Regeneration (ISR)

## Trade-offs

### Performance vs. Freshness
- **Before:** Fast (CDN cached), but stale content
- **After:** Slightly slower, but always fresh content

For a business blog where content updates matter, **freshness is prioritized over CDN performance**.

### Alternative Approaches Considered

1. **Keep CDN + On-Demand Revalidation**
   - Would require webhook setup from Sanity to Next.js
   - More complex infrastructure
   - Chosen solution is simpler and sufficient

2. **Keep CDN + Lower TTL**
   - CDN cache could have shorter TTL
   - Would require Sanity configuration changes
   - Less direct control

3. **Client-Side Data Fetching**
   - Would lose SEO benefits of SSG/ISR
   - Not suitable for blog content

## How It Works Now

### Publishing Workflow
1. Editor publishes a post in Sanity Studio
2. Post is immediately available in Sanity's database
3. Homepage with `useCdn: false` queries Sanity directly (no cache)
4. Within 60 seconds, the homepage revalidates and fetches new data
5. New post appears on the homepage

### For Individual Post Pages
Individual post pages continue to work as before:
- They use the same client configuration
- They fetch fresh data from Sanity
- Post pages are generated on-demand or during build

## Verification Steps

To verify the fix works:

1. **Publish a new post in Sanity Studio**
   - Go to https://simplethings.sanity.studio
   - Create or edit a post
   - Click "Publish" (not just "Save")

2. **Check individual post page**
   - Navigate to https://simplethin.gs/posts/[your-slug]
   - Post should be accessible immediately

3. **Check homepage**
   - Navigate to https://simplethin.gs
   - Wait up to 60 seconds for revalidation
   - New post should appear in the blog list

## Configuration Reference

### Client Configuration
Location: `nextjs-app/sanity/lib/client.ts`

```typescript
{
  useCdn: false,           // Disable CDN for fresh data
  perspective: "published" // Only show published content
}
```

### Page Revalidation
Location: `nextjs-app/app/page.tsx`

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### Live Content API
The app uses Sanity's Live Content API via `defineLive`:
- Configured in `nextjs-app/sanity/lib/live.ts`
- Provides `sanityFetch` for queries
- Works with `useCdn: false` for maximum freshness

## Future Improvements

### Optional: On-Demand Revalidation
For instant updates without waiting 60 seconds:

1. Create webhook in Sanity Studio
2. Add revalidation API route in Next.js:
   ```typescript
   // app/api/revalidate/route.ts
   export async function POST(request: Request) {
     const { path } = await request.json();
     await revalidatePath(path);
     return Response.json({ revalidated: true });
   }
   ```
3. Configure Sanity webhook to call this endpoint

### Optional: Re-enable CDN for Static Content
For pages that don't need real-time updates:
- Create a separate client with `useCdn: true`
- Use it for settings, pages, and other static content
- Keep `useCdn: false` only for blog posts

## Monitoring

To monitor API usage and performance:
- Check Sanity dashboard for API request metrics
- Monitor Next.js analytics for page load times
- Adjust `revalidate` value if needed (30, 60, 120 seconds)

## Related Documentation
- [Sanity Client CDN Configuration](https://www.sanity.io/docs/help/js-client-cdn-configuration)
- [Next.js ISR Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Sanity Live Content API](https://www.sanity.io/docs/developer-guides/live-content-guide)
