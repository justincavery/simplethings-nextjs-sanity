# Fix Summary: Published Posts Not Appearing on Homepage

## Issue Description
The post "machine-for-dying" was published in Sanity Studio and accessible at its direct URL (https://simplethin.gs/posts/machine-for-dying), but was not appearing on the homepage (https://simplethin.gs).

## Root Cause
1. **CDN Caching:** Sanity client was configured with `useCdn: true`, causing query results to be cached at the CDN level. When new posts were published, the homepage continued showing cached results.
2. **No Revalidation:** The homepage had no revalidation configured, so it remained static after the initial build.

## Solution
Two key changes were implemented:

### 1. Disabled CDN Caching
**File:** `nextjs-app/sanity/lib/client.ts`
- Changed `useCdn: true` → `useCdn: false`
- Ensures all queries fetch fresh data directly from Sanity
- Trade-off: Slightly slower queries, but guarantees content freshness

### 2. Added Page Revalidation
**File:** `nextjs-app/app/page.tsx`
- Added `export const revalidate = 60;`
- Homepage will revalidate every 60 seconds
- Uses Next.js Incremental Static Regeneration (ISR)
- New posts will appear within 1 minute of publication

## Expected Behavior After Fix
1. Editor publishes a post in Sanity Studio
2. Post is immediately available at its individual URL
3. Within 60 seconds, homepage revalidates and fetches new data
4. New post appears in the homepage blog list

## Verification Steps
To verify the fix works in production:
1. Deploy these changes
2. Publish a new post in Sanity Studio (click "Publish", not just "Save")
3. Verify post is accessible at `/posts/[slug]`
4. Wait up to 60 seconds
5. Refresh the homepage
6. New post should appear in the blog list

## Files Changed
- `nextjs-app/sanity/lib/client.ts` - Disabled CDN
- `nextjs-app/app/page.tsx` - Added revalidation
- `HOMEPAGE_POSTS_FIX.md` - Detailed documentation

## Documentation
See `HOMEPAGE_POSTS_FIX.md` for comprehensive details including:
- Technical explanation
- Trade-offs analysis
- Future improvement options
- Monitoring recommendations

## Status
✅ Code changes implemented
✅ Linting passes
✅ TypeScript compiles
✅ Documentation complete
⏳ Awaiting production deployment for verification
