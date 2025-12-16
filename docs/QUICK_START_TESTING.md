# 🎯 Quick Start: Testing Your Meal Claim System

## 1. Add Your CSV File (Choose One Method)

### Method A: Using the Converter Script (Recommended)

```bash
# Download your Luma CSV first, then:
cd /Users/kavina/Documents/side-chicks/cafe-cursor-ai
npm run convert-csv ~/Downloads/your-luma-export.csv
```

### Method B: Create Test Data Manually

Create sample attendees for testing:

```bash
# Create a test CSV file
cat > test-attendees.csv << 'EOF'
name,email
Kavina Test,kavina@example.com
John Doe,john@example.com
Jane Smith,jane@example.com
EOF

# Convert it
npm run convert-csv test-attendees.csv
```

This creates `data/static/attendees.json` with unique tokens for each person.

---

## 2. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 3. Test the Claim Flow

### Step 1: Click "Claim Meal" Card

On the homepage, expand the "Claim Meal" interactive flow.

### Step 2: Enter Your Email

Type one of the emails from your CSV:

- Example: `kavina@example.com`

### Step 3: Click "Verify Email"

The system will:

1. ✅ Check if email exists in `attendees.json`
2. ✅ Check if already claimed (via Netlify Blobs)
3. ✅ Show welcome message with your name

### Step 4: Select Food & Drink

Choose from the dropdown menus:

- 🍚 Rice Bowl / 🍜 Noodles / 🥪 Sandwich / etc.
- ☕ Latte / 🧃 Juice / 🍵 Tea / etc.

### Step 5: Confirm Order

Click "Confirm Order" button.

### Step 6: Get Order Number

You'll see:

```
✓ Order Confirmed!
   Your Order Number
   #A7B3C4D2
```

### Step 7: Try Claiming Again (Should Fail)

- Enter the same email again
- Click "Verify Email"
- Should show: ❌ "You have already claimed your meal"

---

## 4. View Your Data

### Check Attendees

```bash
cat data/static/attendees.json
```

You'll see:

```json
[
  {
    "email": "kavina@example.com",
    "token": "CC-7842",
    "name": "Kavina Test"
  }
]
```

### Check Claims (Local Testing)

Note: In development mode, Netlify Blobs may not persist. To test persistence:

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Run with Netlify dev server
netlify dev

# Now test at http://localhost:8888 (not 3000)
```

---

## 5. Deploy to Netlify

### First Time Setup:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Follow prompts:
# - Build command: npm run build
# - Publish directory: .next
```

### Deploy:

```bash
# Commit your changes
git add .
git commit -m "Add meal claim system"
git push

# Netlify auto-deploys from GitHub
# Or deploy manually:
netlify deploy --prod
```

---

## 6. Test in Production

After deployment, test the full flow:

1. **Get your production URL:**

   ```
   https://your-site-name.netlify.app
   ```

2. **Test claim flow:**

   - Enter email → Verify → Select meal → Confirm
   - Try same email again → Should be blocked

3. **View claims in Netlify:**

   ```bash
   netlify blobs:list claims
   ```

   You'll see:

   ```
   claimed:kavina@example.com
   claimed:john@example.com
   ```

---

## 7. Common Issues & Fixes

### Issue: "Module not found: Can't resolve '@/lib/claim-actions'"

**Fix:** Check import paths. Should be:

```tsx
import { verifyClaim, confirmClaim } from "@/lib/claim-actions";
```

### Issue: "Email not found"

**Fix:**

```bash
# Check if email exists
cat data/static/attendees.json | grep "your-email@example.com"

# If not found, regenerate JSON
npm run convert-csv your-csv-file.csv
```

### Issue: Blobs not working locally

**Fix:** Use Netlify dev server:

```bash
netlify dev
# Access at http://localhost:8888
```

### Issue: Claims not persisting

**Fix:** Make sure you're deployed to Netlify (not just `npm run dev`)

---

## 8. Reset Claims (Testing)

### Reset All Claims:

```bash
netlify blobs:delete claims --all
```

### Reset Specific Email:

```bash
netlify blobs:delete claims claimed:email@example.com
```

---

## ✅ Complete Testing Checklist

- [ ] CSV converted to JSON
- [ ] Server running (`npm run dev`)
- [ ] Can verify valid email
- [ ] Can select food & drink
- [ ] Can confirm order and get order number
- [ ] Second claim with same email fails
- [ ] Invalid email shows error
- [ ] Deployed to Netlify
- [ ] Production claims persist across refreshes

---

## 🎉 You're Ready!

Your meal claim system is now:

- ✅ Integrated with the "Claim Meal" button
- ✅ Using Server Actions for security
- ✅ Storing claims in Netlify Blobs
- ✅ Preventing double claims
- ✅ Showing real-time validation

**Next:** Email your attendees their tokens from `attendees.json`! 📧
