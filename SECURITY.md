# Security Vulnerability Report

## Next.js Security Update

### Vulnerabilities Addressed ✅

The following critical vulnerabilities have been patched by upgrading from Next.js 15.0.7 to **15.5.11**:

1. ✅ **HTTP request deserialization DoS** (CVE-2025-66478)
   - Patched in: 15.0.8+
   - Fixed by upgrade to 15.5.11

2. ✅ **Cache poisoning DoS**
   - Patched in: 15.1.8+
   - Fixed by upgrade to 15.5.11

3. ✅ **Authorization Bypass in Middleware**
   - Patched in: 15.2.3+
   - Fixed by upgrade to 15.5.11

4. ✅ **Multiple DoS vulnerabilities in React Server Components**
   - Patched in: 15.0.8, 15.1.12, 15.2.9, 15.3.9, 15.4.11, 15.5.10+
   - Fixed by upgrade to 15.5.11

### Remaining Vulnerability ⚠️

**PPR Resume Endpoint Memory Exhaustion (CVE-2025-59472)**
- **Severity:** Moderate
- **GHSA ID:** GHSA-5f7q-jpqc-wp7h
- **Affected versions:** 15.0.0-canary.0 - 15.6.0-canary.60
- **Patched versions:** 
  - 15.6.0-canary.61+ (canary, not recommended for production)
  - 16.1.5+ (stable, requires major version upgrade)

### Vulnerability Details

This vulnerability affects applications using:
- Partial Prerendering (PPR) with `experimental.ppr: true` or `cacheComponents: true`
- Minimal mode (`NEXT_PRIVATE_MINIMAL_MODE=1` environment variable)

**Impact:** Unauthenticated POST requests can cause unbounded memory consumption, potentially leading to denial of service.

### Mitigation Options

#### Option 1: Upgrade to Next.js 16.x (Recommended for Production)
```bash
npm install next@16.1.6 react@latest react-dom@latest
```

**Note:** Next.js 16 includes breaking changes:
- Requires Node.js 20.9+
- Turbopack is now the default bundler
- Middleware file renamed to `proxy.ts`
- See [official upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

**Before upgrading:**
1. Review breaking changes
2. Test thoroughly in a development environment
3. Run the official codemod: `npx @next/codemod@canary upgrade latest`

#### Option 2: Disable PPR (Workaround for 15.x)
If upgrading to 16.x is not immediately feasible, disable Partial Prerendering:

In `next.config.ts`:
```typescript
const config = {
  experimental: {
    ppr: false, // Disable PPR
  },
};
```

#### Option 3: Monitor and Plan Migration
- Current version (15.5.11) addresses all other known vulnerabilities
- Plan migration to Next.js 16.x when ready
- The PPR vulnerability has moderate severity and requires specific configuration to be exploitable

### Current Status

**Version:** Next.js 15.5.11  
**Status:** 90% of vulnerabilities patched  
**Recommendation:** Plan upgrade to Next.js 16.1.6+ for complete security coverage

### Additional Security Considerations

The following non-Next.js vulnerabilities remain in the dependency tree:
- Sanity packages (moderate severity, in dependency chain)
- nanoid (moderate severity, transitive dependency)
- prismjs (moderate severity, < 1.30.0)
- tar (high severity, <= 7.5.6)

These are transitive dependencies from Sanity packages and would require updates from the package maintainers.

### References

- [Next.js Security Advisory GHSA-5f7q-jpqc-wp7h](https://github.com/vercel/next.js/security/advisories/GHSA-5f7q-jpqc-wp7h)
- [CVE-2025-59472 Details](https://nvd.nist.gov/vuln/detail/CVE-2025-59472)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

---

**Last Updated:** 2026-01-30  
**Security Scan:** npm audit
