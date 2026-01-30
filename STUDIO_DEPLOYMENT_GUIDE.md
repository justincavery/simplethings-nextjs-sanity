# Deploying Schema Changes to Sanity Studio

## Quick Answer

**You DO NOT need to merge to main first!** 

Schema changes can be deployed to Sanity Studio directly from your current branch. Here's what you need to do:

## Workflow for Deploying Schema Changes

### Option 1: Deploy to Production Studio (Recommended for Testing)

1. **Navigate to the studio directory:**
   ```bash
   cd studio
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Deploy the studio:**
   ```bash
   npm run deploy
   # or
   npx sanity deploy
   ```

4. **Access your deployed studio:**
   - Go to `https://simplethings.sanity.studio` (or your custom studio URL)
   - You'll immediately see the new hero section fields in the Settings

5. **Update the content:**
   - Navigate to Settings in the sidebar
   - Fill in the three new hero fields:
     - Hero Heading
     - Hero Description (with rich text)
     - Hero Availability
   - Click "Publish"

6. **Deploy the frontend:**
   - Once content is updated in the studio, deploy the Next.js app
   - The homepage will now use the CMS values

### Option 2: Local Studio Development (For Testing Schema Changes)

If you want to test the schema changes locally before deploying:

1. **Run the studio locally:**
   ```bash
   cd studio
   npm run dev
   ```

2. **Access local studio:**
   - Open `http://localhost:3333` in your browser
   - You'll see the new fields immediately
   - This connects to your production Sanity dataset

3. **Update content in local studio:**
   - Make your content changes
   - Publish them

4. **The changes are saved to production dataset:**
   - Even though you're running the studio locally, content changes are saved to the production Sanity dataset
   - The deployed Next.js app will fetch these changes

## Understanding the Architecture

### Three Separate Components:

1. **Sanity Studio (Schema)** - The CMS interface
   - Location: `/studio` directory
   - Deployed to: `https://simplethings.sanity.studio`
   - Deployment: `npm run deploy` (from studio directory)
   - Independent of git branches - can deploy from any branch

2. **Sanity Content (Data)** - The actual content
   - Stored in: Sanity's cloud (Content Lake)
   - Accessed via: Sanity Studio (local or deployed)
   - Not tied to git or deployments - always live

3. **Next.js Frontend** - The website
   - Location: `/nextjs-app` directory
   - Deployed to: Vercel (or your hosting platform)
   - Fetches content from Sanity via API

### How They Connect:

```
┌─────────────────────────────────────────────────────────┐
│                    Your Git Branch                       │
│  (Contains schema changes in /studio/src/schemaTypes/)  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ├─► Deploy Studio (npm run deploy)
                  │   └─► https://simplethings.sanity.studio
                  │       (Shows new fields)
                  │
                  └─► Deploy Frontend (Vercel, etc.)
                      └─► https://simplethin.gs
                          (Uses new fields from Sanity API)

┌─────────────────────────────────────────────────────────┐
│              Sanity Content Lake (Cloud)                 │
│         (Stores all content, always accessible)          │
└─────────────────────────────────────────────────────────┘
```

## Step-by-Step Workflow for Your Current Situation

### Before Merging to Main:

1. **Deploy the Studio from your branch:**
   ```bash
   cd studio
   npm run deploy
   ```
   - This updates the Studio interface at `https://simplethings.sanity.studio`
   - The new hero section fields will appear in Settings

2. **Update content in the Studio:**
   - Go to `https://simplethings.sanity.studio`
   - Navigate to Settings
   - Fill in the hero section fields
   - Click "Publish"

3. **Test with local Next.js app (optional):**
   ```bash
   cd ../nextjs-app
   npm run dev
   ```
   - Open `http://localhost:3000`
   - Verify the homepage shows your CMS content

4. **Deploy the Next.js app:**
   - Push your branch and deploy to Vercel
   - Or merge to main and deploy
   - The production site will now use the CMS content

### After Everything Works:

5. **Merge to main:**
   ```bash
   git checkout main
   git merge copilot/update-homepage-content-management
   git push origin main
   ```

## Important Notes

### ✅ You CAN Deploy Studio from a Branch
- Studio deployment is independent of git branches
- The studio reads schema files from your local directory
- Deploy from any branch to test schema changes

### ✅ Content is Always Accessible
- Content updates in Sanity Studio are immediately saved to the cloud
- They're accessible to any deployed Next.js app
- No deployment needed for content updates (only schema changes)

### ✅ Local Studio is Safe
- Running `npm run dev` in studio directory is safe
- It connects to your production dataset
- Content changes are real (not local)
- Schema changes are only local until you deploy

### ⚠️ Schema Changes Require Deployment
- New fields won't appear in the deployed studio until you run `npm run deploy`
- Local studio (`npm run dev`) shows schema changes immediately
- Content changes don't require studio deployment

### ⚠️ Frontend Deployment
- The Next.js app needs to be deployed separately
- It will fetch content via Sanity's API
- The API returns whatever content exists in Sanity (updated via Studio)

## Commands Reference

### Studio Commands:
```bash
# Run studio locally (shows schema changes immediately)
npm run dev

# Deploy studio to production (updates deployed studio interface)
npm run deploy

# Build studio (for testing)
npm run build

# Extract schema types
npm run extract-types
```

### Next.js Commands:
```bash
# Run Next.js app locally
npm run dev

# Build for production
npm run build

# Generate Sanity types
npm run typegen
```

## Common Scenarios

### Scenario 1: "I want to test schema changes before merging"
**Solution:** Deploy studio from your branch
```bash
cd studio
npm run deploy
```
The deployed studio will show your new fields. Test them, then merge when satisfied.

### Scenario 2: "I want to update content before deploying frontend"
**Solution:** Deploy studio, update content, then deploy frontend
```bash
# 1. Deploy studio
cd studio
npm run deploy

# 2. Go to https://simplethings.sanity.studio and update content

# 3. Deploy frontend
cd ../nextjs-app
# (Deploy via your CI/CD or hosting platform)
```

### Scenario 3: "I want to preview everything locally"
**Solution:** Run both studio and Next.js locally
```bash
# Terminal 1 - Studio
cd studio
npm run dev  # Runs on http://localhost:3333

# Terminal 2 - Next.js
cd nextjs-app
npm run dev  # Runs on http://localhost:3000
```
Update content in local studio, see it reflected on local Next.js app.

## Troubleshooting

### "I deployed the studio but don't see new fields"
- Clear browser cache and refresh
- Verify deployment was successful
- Check if you're logged into the correct Sanity project

### "My content changes aren't showing on the website"
- Verify content is published (not just saved)
- Check if Next.js app is using `useCdn: false` (for immediate updates)
- Wait 60 seconds for ISR revalidation (if configured)
- Force revalidation by redeploying Next.js app

### "Local studio doesn't work"
- Ensure `.env` file exists in studio directory with correct credentials
- Run `npx sanity init --env` if needed
- Check that dependencies are installed (`npm install`)

## Environment Setup (If Not Already Done)

### Studio Environment:
Create `studio/.env` file:
```env
SANITY_STUDIO_PROJECT_ID="your-project-id"
SANITY_STUDIO_DATASET="production"
SANITY_STUDIO_PREVIEW_URL="https://simplethin.gs"
```

### Next.js Environment:
Create `nextjs-app/.env.local` file:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-08-22"
NEXT_PUBLIC_SANITY_STUDIO_URL="https://simplethings.sanity.studio"
SANITY_API_READ_TOKEN="your-read-token"
```

## Summary

**For your current situation:**

1. **Deploy the studio** from your current branch: `cd studio && npm run deploy`
2. **Update content** at `https://simplethings.sanity.studio`
3. **Deploy the frontend** when ready
4. **Merge to main** when everything works

You do NOT need to merge to main before deploying the studio. Schema and content updates can happen independently of your git workflow!
