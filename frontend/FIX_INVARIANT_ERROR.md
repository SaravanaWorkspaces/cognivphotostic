# Fix: "Expected clientReferenceManifest to be defined" Error

## Quick Fix (Try This First)

```bash
# Stop the dev server (Ctrl+C if running)

# Clear Next.js cache
rm -rf .next

# Clear node_modules cache
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Start fresh
npm run dev
```

If that doesn't work, try the full reset below.

---

## Full Reset (Nuclear Option)

```bash
# From frontend directory
cd /Users/saravana/workspace/ext_work/cognivphotostic/frontend

# Kill any running processes
pkill -f "next dev" || true
sleep 2

# Remove all caches
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json
rm -rf .turbo

# Clear npm cache
npm cache clean --force

# Reinstall everything
npm install

# Build once
npm run build

# Then run dev
npm run dev
```

---

## Why This Happens

1. **Corrupted .next folder** - Next.js build artifacts got corrupted
2. **Stale cache** - Old build doesn't match current code
3. **Version mismatch** - npm packages not in sync
4. **Incomplete build** - Build didn't complete properly last time

---

## Prevention

Always do this when issues occur:
```bash
# Clean workflow
rm -rf .next && npm run build && npm run dev
```

---

## If Still Broken

Check these:
1. **Node version** - Should be 18+
   ```bash
   node --version
   # Must be v18.0.0 or higher
   ```

2. **npm version** - Should be 9+
   ```bash
   npm --version
   ```

3. **Backend running?** - Strapi must be accessible
   ```bash
   curl http://localhost:1337/api/posts
   ```

4. **Environment file** - Check frontend/.env.local exists
   ```bash
   cat frontend/.env.local
   # Should have NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   ```

If all above are fine, try the full reset above.
