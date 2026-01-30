# Quick Reference: Studio Deployment

## ❓ Do I need to merge to main first?

**NO!** You can deploy the Sanity Studio from any branch.

## 🚀 Quick Deployment Steps

### 1. Deploy Studio (to update schema)
```bash
cd studio
npm run deploy
```
✅ New fields appear at https://simplethings.sanity.studio

### 2. Update Content
- Go to https://simplethings.sanity.studio
- Navigate to Settings
- Fill in hero section fields
- Click "Publish"

### 3. Deploy Frontend
- Deploy Next.js app to Vercel (or your platform)
- Homepage will use CMS content

## 🏠 Local Development

### Run Studio Locally
```bash
cd studio
npm run dev
# Opens http://localhost:3333
```
✅ See schema changes immediately
⚠️ Content changes are real (saved to production dataset)

### Run Next.js Locally
```bash
cd nextjs-app
npm run dev
# Opens http://localhost:3000
```

## 📋 Command Reference

| Task | Command | Location |
|------|---------|----------|
| Deploy Studio | `npm run deploy` | `/studio` |
| Run Studio Locally | `npm run dev` | `/studio` |
| Deploy Frontend | (Platform specific) | `/nextjs-app` |
| Run Frontend Locally | `npm run dev` | `/nextjs-app` |

## 🔑 Key Concepts

- **Schema = Interface** → Deploy studio to update
- **Content = Data** → Edit in studio, auto-saved to cloud
- **Frontend = Website** → Deploy separately to use new content

## 📚 Full Guide

See [STUDIO_DEPLOYMENT_GUIDE.md](STUDIO_DEPLOYMENT_GUIDE.md) for detailed explanation.
