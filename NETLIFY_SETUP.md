# Netlify Configuration for Meal Claim System

## Environment Setup

### Local Development

Create `.env.local`:

```bash
# Netlify Blobs will use local storage in dev mode
# No configuration needed
```

### Netlify Deployment

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Netlify Blobs works automatically (no API keys needed)
3. Store name: `claims`

## Build Settings

**Build command:** `npm run build`  
**Publish directory:** `.next`

## Functions

Netlify automatically detects Next.js API routes and Server Actions.

## Data Persistence

- **Static data:** `/data/static/attendees.json` (committed to repo)
- **Claim tracking:** Netlify Blobs (serverless KV store)

The `claims` store tracks:

```
claimed:<email> → timestamp (ISO string)
```

## Testing Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Run dev server with Netlify functions
netlify dev
```

## Deployment

```bash
# Deploy to production
git push origin main

# Or manual deploy
netlify deploy --prod
```

## Monitoring

Check claim status in Netlify Dashboard:

- Navigate to Site → Blobs
- View `claims` store
- See all claimed emails with timestamps
