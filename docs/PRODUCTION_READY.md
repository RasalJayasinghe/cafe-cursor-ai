# Production Deployment Checklist ✅

## Pre-Deployment Status

### ✅ Code Ready for Production

1. **Local Mock Removed**

   - ✅ Deleted `lib/claims-store-local.ts`
   - ✅ Updated `lib/claim-actions.ts` to use only production Netlify Blobs
   - ✅ No references to local mock anywhere in codebase

2. **Dependencies Installed**

   - ✅ @netlify/blobs@10.4.3 in package.json
   - ✅ Next.js 15.1.0
   - ✅ All required packages present

3. **Data Files**

   - ✅ 341 real attendees in `data/static/attendees.json`
   - ✅ JSON syntax error fixed (removed stray "k" character)
   - ✅ All attendee emails and tokens validated

4. **Server Actions**

   - ✅ `lib/claim-actions.ts` - verifyClaim() and confirmClaim()
   - ✅ Uses 'use server' directive
   - ✅ Imports from production claims-store.ts
   - ✅ No local mock logic

5. **Netlify Blobs Integration**

   - ✅ `lib/claims-store.ts` - Production KV wrapper
   - ✅ Uses @netlify/blobs package
   - ✅ Includes debug logging
   - ✅ Proper error handling

6. **UI Components**

   - ✅ `src/components/flows/ClaimMealNew.tsx` - Complete UI
   - ✅ Integrated into `src/components/sections/Flows.tsx`
   - ✅ Email verification flow
   - ✅ Food/drink selection

7. **Configuration**
   - ✅ `netlify.toml` created with proper build settings
   - ✅ Node 20 specified
   - ✅ Build command: `npm run build`
   - ✅ Publish directory: `dist`

## Deployment Instructions

### Option 1: Netlify CLI (Quick Deploy)

```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site (first time only)
netlify init

# Deploy to production
netlify deploy --prod
```

### Option 2: GitHub Integration (Recommended)

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Production-ready: Meal claim system with Netlify Blobs"
   git push origin main
   ```

2. **Connect to Netlify:**

   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings are auto-detected from netlify.toml
   - Click "Deploy site"

3. **Automatic Deployments:**
   - Every push to `main` will trigger a new deployment
   - Preview deployments for pull requests

## Post-Deployment Testing

Once deployed, test with these real attendee emails from your CSV:

1. **Test Valid Claim:**

   - Email: `medhanimakuloluwa02@gmail.com`
   - Token: `CC-6369`
   - Should allow claim

2. **Test Duplicate Prevention:**

   - Use same email again
   - Should show "already claimed" message

3. **Test Invalid Email:**

   - Email: `fake@example.com`
   - Should show "not found in attendee list"

4. **Check Netlify Blobs:**
   - In Netlify dashboard → Blobs
   - You should see `meal-claims` store
   - Claimed emails stored as keys

## Expected Behavior in Production

### ✅ What Will Work

- **Netlify Blobs**: Automatically available in Netlify environment
- **Server Actions**: Run securely on Netlify Functions
- **Static Attendees**: 341 attendees loaded from JSON
- **One-Time Claims**: Each email can only claim once
- **Persistence**: Claims stored permanently in Netlify KV

### ⚠️ What Won't Work Locally

- Netlify Blobs requires cloud environment
- `npm run dev` on port 3001 won't have access to Blobs
- Must test on production URL after deployment

## Monitoring & Debugging

### View Logs in Netlify

1. Go to your site in Netlify dashboard
2. Click "Functions" tab
3. View server action logs with `[CLAIMS]` prefix

### Common Log Messages

```
[CLAIMS] Using Netlify Blobs storage
[CLAIMS] Checking claim for email: user@example.com
[CLAIMS] User has not claimed yet
[CLAIMS] Successfully marked user@example.com as claimed
```

### Troubleshooting

**Issue**: "Netlify Blobs is not available"

- **Solution**: You're running locally, deploy to Netlify

**Issue**: Claims not persisting

- **Solution**: Check Netlify Blobs dashboard, verify store exists

**Issue**: All emails can claim

- **Solution**: Check function logs, verify attendees.json is being read

## Environment Variables

**No environment variables needed!**

- Netlify Blobs works automatically in Netlify environment
- No API keys or secrets required
- attendees.json is committed to repository

## Success Criteria

After deployment, verify:

1. ✅ Site loads at Netlify URL
2. ✅ Can navigate to claim meal section
3. ✅ Valid attendee email allows claim
4. ✅ Same email cannot claim twice
5. ✅ Invalid emails are rejected
6. ✅ Claims persist between page refreshes
7. ✅ Function logs show `[CLAIMS]` messages

## Quick Commands Reference

```bash
# Build locally (test build process)
npm run build

# Deploy to production
netlify deploy --prod

# View deployment logs
netlify logs:function server-action

# Check Blobs storage
netlify blobs:list meal-claims

# Open production site
netlify open:site
```

## Files Modified for Production

- ✅ `lib/claim-actions.ts` - Removed local mock logic
- ✅ `data/static/attendees.json` - Fixed JSON syntax error
- ✅ `netlify.toml` - Created with build config
- ❌ `lib/claims-store-local.ts` - DELETED

## Ready to Deploy! 🚀

All code is production-ready. Choose your deployment method above and deploy!

**Recommended Next Steps:**

1. Commit all changes to git
2. Push to GitHub
3. Connect to Netlify
4. Test on production URL
5. Share the URL with attendees!
