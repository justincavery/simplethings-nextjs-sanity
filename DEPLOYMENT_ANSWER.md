# Answer: How to Deploy Schema Changes

## Your Question
> "How do the changes for the content structure get up to the studio? Do I need to merge it to main first? Or run a command to update the studio so I can see the content to update it on the homepage before we push the frontend?"

## Direct Answer

**You do NOT need to merge to main first!** 

You can deploy the Sanity Studio directly from your current branch to update the content structure (schema). Here's exactly what to do:

## Step-by-Step Instructions

### 1. Deploy Studio (to see new fields)
```bash
cd studio
npm run deploy
```

This will:
- Package your schema changes (including the new hero section fields)
- Deploy them to https://simplethings.sanity.studio
- Make the new fields immediately visible in the Studio interface

### 2. Update Content in Studio
1. Go to https://simplethings.sanity.studio
2. Navigate to **Settings** (in the sidebar)
3. You'll now see three new fields:
   - **Hero Heading** (plain text)
   - **Hero Description** (rich text with bold/italic/links)
   - **Hero Availability** (plain text)
4. Fill in these fields with your content
5. Click **"Publish"** (important!)

### 3. Verify Content Locally (Optional)
```bash
cd nextjs-app
npm run dev
```
- Open http://localhost:3000
- You should see your CMS content on the homepage
- This confirms everything is working

### 4. Deploy Frontend
Once you're happy with the content:
- Deploy the Next.js app to production (Vercel or your platform)
- The production site will now display your CMS content

### 5. Merge to Main (When Ready)
After verifying everything works:
```bash
git checkout main
git merge copilot/update-homepage-content-management
git push origin main
```

## Why This Works

### Studio Deployment is Independent
- The Sanity Studio deployment reads schema files from your local directory
- It doesn't matter which git branch you're on
- Deploy from any branch to test schema changes

### Content is Separate from Code
- When you update content in the Studio, it's saved to Sanity's cloud
- This content is immediately accessible to any deployed Next.js app
- The frontend just needs to be configured to fetch from Sanity

### The Workflow is Safe
- Test schema changes by deploying studio from branch
- Update content in deployed studio
- Test with local Next.js app
- Deploy frontend when satisfied
- Merge to main as final step

## Quick Reference

| Step | Command | Location | Result |
|------|---------|----------|--------|
| Deploy Studio | `npm run deploy` | `/studio` | New fields appear in Studio |
| Update Content | (Use Studio UI) | https://simplethings.sanity.studio | Content saved to cloud |
| Test Locally | `npm run dev` | `/nextjs-app` | See content on localhost |
| Deploy Frontend | (Platform specific) | - | Production site updated |

## Important Notes

✅ **Safe to deploy studio from branch** - It won't affect anything until you also deploy the frontend

✅ **Content updates are real** - Even in local studio, content changes are saved to production dataset

✅ **No merge required first** - Deploy studio, test content, merge later

⚠️ **Frontend needs deployment** - The website won't show new content until you deploy the Next.js app

⚠️ **Remember to publish** - Click "Publish" not just "Save" in the Studio

## Full Documentation

For more details, see:
- [STUDIO_DEPLOYMENT_GUIDE.md](STUDIO_DEPLOYMENT_GUIDE.md) - Comprehensive guide
- [STUDIO_QUICK_REF.md](STUDIO_QUICK_REF.md) - Quick reference

## TL;DR

```bash
# 1. Deploy studio from your current branch
cd studio
npm run deploy

# 2. Go to https://simplethings.sanity.studio
#    Update Settings with hero content
#    Click "Publish"

# 3. Deploy Next.js frontend (your deployment process)

# 4. Merge to main when everything works
```

**You're ready to go! No merge needed before deploying the studio.**
