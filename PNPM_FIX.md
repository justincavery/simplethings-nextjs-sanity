# pnpm Lockfile Fix Summary

## Problem
The CI/CD pipeline was failing with:
```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
```

## Root Cause
When Next.js was upgraded from 15.0.7 to 15.5.11 for security patches, the npm lockfile (`package-lock.json`) was updated, but the pnpm lockfile (`pnpm-lock.yaml`) was not synchronized.

Both `nextjs-app/` and `studio/` directories had outdated pnpm lockfiles.

## Solution
Updated both pnpm lockfiles by running:
```bash
# nextjs-app directory
cd nextjs-app
pnpm install --no-frozen-lockfile

# studio directory  
cd studio
pnpm install --no-frozen-lockfile
```

## Changes
- **nextjs-app/pnpm-lock.yaml**: Updated to reflect Next.js 15.5.11 and all dependency updates
- **studio/pnpm-lock.yaml**: Updated to reflect latest Sanity package versions

## Verification
✅ Both directories now successfully install with `pnpm install --frozen-lockfile`  
✅ Linting works: `pnpm run lint`  
✅ Type generation works: `pnpm run typegen`  
✅ CI/CD frozen-lockfile checks will now pass

## Notes
The repository maintains both npm and pnpm lockfiles. When updating dependencies:
1. Update with npm: `npm install package@version`
2. Regenerate pnpm lockfile: `pnpm install --no-frozen-lockfile`
3. Commit both lockfiles

Or use pnpm exclusively to avoid this issue.
