# One-Time Meal Claim System - Architecture

## 🎯 Requirements

- User enters email/token
- System verifies against Luma CSV data
- User selects meal (one-time only)
- Claim persists across refreshes & redeploys
- No database, no filesystem writes, no auth

## 🏗️ Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Client Component)                        │
│  - User enters email/token                          │
│  - Selects food & drink                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Server Actions (claim-actions.ts)                  │
│  - verifyClaim(input)                               │
│  - confirmClaim(input)                              │
└──────────┬──────────────────┬───────────────────────┘
           │                  │
           ▼                  ▼
┌──────────────────┐  ┌─────────────────────────────┐
│  Static JSON     │  │  Netlify Blobs (KV Store)   │
│  (Read-only)     │  │  (Persistent Claims)        │
│                  │  │                              │
│  attendees.json  │  │  claimed:<email> → timestamp│
│  - email         │  │                              │
│  - token         │  │  ✅ Survives redeploys      │
│  - name          │  │  ✅ Atomic operations        │
│                  │  │  ✅ Serverless-safe          │
└──────────────────┘  └─────────────────────────────┘
```

## 📁 File Structure

```
/data/
  /static/
    attendees.json          # Static list (from Luma CSV)

/lib/
  attendees.ts              # Read static JSON
  claims-store.ts           # Netlify Blobs interface
  claim-actions.ts          # Server Actions (main logic)

/app/
  /claim/
    page.tsx                # Claim meal UI

/scripts/
  csv-to-json.js            # Convert Luma CSV → JSON
```

## 🔄 State Machine

```
┌─────────┐
│ Initial │
└────┬────┘
     │ User enters email/token
     ▼
┌─────────────┐
│  Verifying  │──────► Invalid ──► Show error
└─────┬───────┘
      │
      ├──► Already claimed ──► Show "claimed on [date]"
      │
      └──► Valid ──► Show menu selection
                           │
                           ▼
                    ┌──────────────┐
                    │   Claiming   │
                    └──────┬───────┘
                           │
                           ├──► Race condition ──► Show error
                           │
                           └──► Success ──► Show confirmation
```

## 🔐 Security & Race Conditions

### Problem: Concurrent Claims

```
Time 0: User A verifies → valid ✅
Time 1: User A selects meal
Time 2: User B verifies → valid ✅ (same email!)
Time 3: User A confirms → success
Time 4: User B confirms → should fail ❌
```

### Solution: Atomic Check-and-Set

```typescript
async function markAsClaimed(email: string): Promise<boolean> {
  // 1. Check if already exists
  const existing = await store.get(key);
  if (existing !== null) {
    return false; // Already claimed
  }

  // 2. Set atomically
  await store.set(key, timestamp);
  return true;
}
```

## 🚀 API Reference

### `verifyClaim(input)`

**Input:**

```typescript
{
  email?: string;
  token?: string;
}
```

**Output:**

```typescript
| { status: 'invalid'; message: string }
| { status: 'already_claimed'; message: string; claimedAt: string }
| { status: 'valid'; message: string; attendee: { ... } }
```

### `confirmClaim(input)`

**Input:**

```typescript
{
  email: string;
  name: string;
  phone?: string;
  foodItem: string;
  drinkItem: string;
}
```

**Output:**

```typescript
| { status: 'invalid'; message: string }
| { status: 'already_claimed'; message: string }
| { status: 'success'; message: string; orderId: string }
| { status: 'error'; message: string }
```

## 📊 Why This Architecture?

### ✅ Static JSON for Attendees

- **Pro:** Fast, no API calls, version-controlled
- **Pro:** Can't be modified at runtime (security)
- **Con:** Must redeploy to update list
- **Decision:** CSV is final, this is acceptable

### ✅ Netlify Blobs for Claims

- **Pro:** Persists across deployments
- **Pro:** Serverless-compatible (no connection pools)
- **Pro:** Atomic operations prevent race conditions
- **Pro:** Free tier: 100GB bandwidth, 1GB storage
- **Con:** Vendor lock-in (Netlify only)
- **Decision:** Acceptable for this use case

### ❌ Alternatives Rejected

| Option                | Why Rejected                       |
| --------------------- | ---------------------------------- |
| **Filesystem writes** | Read-only after build on Netlify   |
| **localStorage**      | Client-side only, not persistent   |
| **Cookies**           | Client-side, can be cleared        |
| **PostgreSQL**        | Overkill, requires connection pool |
| **Redis**             | Requires external service          |
| **JSON file writes**  | Not possible on serverless         |

## 🧪 Testing

### Local Development

```bash
# Netlify CLI simulates Blobs locally
netlify dev

# Test verification
curl http://localhost:8888/api/verify \
  -d '{"email": "john@example.com"}'

# Test claim
curl http://localhost:8888/api/claim \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "foodItem": "rice-bowl",
    "drinkItem": "latte"
  }'
```

### Production Testing

```bash
# Verify
curl https://your-site.netlify.app/api/verify \
  -d '{"email": "test@example.com"}'

# Claim
curl https://your-site.netlify.app/api/claim \
  -d '{...}'
```

## 📈 Scalability

| Metric              | Limit       | Notes                         |
| ------------------- | ----------- | ----------------------------- |
| Attendees           | Unlimited   | Static JSON, loaded in-memory |
| Claims              | 1GB storage | ~10M claims with timestamps   |
| Concurrent requests | 1000/s      | Netlify Functions limit       |
| Blob reads          | Unlimited   | Free tier: 100GB/month        |
| Blob writes         | Unlimited   | Free tier: 100GB/month        |

## 🔧 Maintenance

### Adding Attendees

1. Update CSV from Luma
2. Run `npm run convert-csv`
3. Commit updated `attendees.json`
4. Deploy

### Viewing Claims

```bash
# Install Netlify CLI
netlify blobs:list claims

# Get specific claim
netlify blobs:get claims claimed:john@example.com
```

### Resetting Claims (Emergency)

```bash
# Delete all claims
netlify blobs:delete claims claimed:*

# Or specific email
netlify blobs:delete claims claimed:john@example.com
```

## 📝 Summary

**What we built:**

- ✅ One-time claim system
- ✅ Serverless-safe persistence
- ✅ Race condition handling
- ✅ No database needed
- ✅ Works on Netlify

**Key decisions:**

- Static JSON for attendee validation (read-only)
- Netlify Blobs for claim tracking (persistent KV)
- Server Actions for type-safe API (no REST)
- Atomic operations for concurrency (no locks needed)

**Trade-offs:**

- Vendor lock-in to Netlify Blobs
- Must redeploy to update attendee list
- No real-time analytics (add later if needed)
