# 📋 How to Add Your Luma CSV

## Quick Start (3 Steps)

### Step 1: Export CSV from Luma

1. Go to your Luma event dashboard
2. Navigate to **Attendees** or **Registrations**
3. Click **Export** or **Download CSV**
4. Save the file (e.g., `cafe-cursor-attendees.csv`)

Your CSV should look like this:

```csv
name,email,status
John Doe,john@example.com,confirmed
Jane Smith,jane@example.com,confirmed
Alice Wong,alice@example.com,waitlist
```

### Step 2: Convert CSV to JSON

Open your terminal and run:

```bash
cd /Users/kavina/Documents/side-chicks/cafe-cursor-ai
npm run convert-csv ~/Downloads/cafe-cursor-attendees.csv
```

You should see:

```
✅ Conversion successful!
📊 Total attendees: 42
📁 Output: data/static/attendees.json

📋 Sample entries:
   john@example.com → CC-7842 (John Doe)
   jane@example.com → CC-3291 (Jane Smith)
   alice@example.com → CC-5619 (Alice Wong)
```

### Step 3: Deploy

```bash
# Commit the new data
git add data/static/attendees.json
git commit -m "Add event attendees"
git push

# Netlify will auto-deploy ✨
```

---

## 📧 Email Your Attendees

After converting, you can email each attendee their unique token:

### Option 1: Manual (Small Events)

Open `data/static/attendees.json` and copy/paste tokens into your email client.

### Option 2: Automated (Recommended)

Create a simple email script:

```bash
# Install sendgrid or nodemailer
npm install @sendgrid/mail

# Run email script
node scripts/send-tokens.js
```

Example email:

```
Subject: Your Cafe Cursor AI Event Token 🎉

Hi {{name}},

You're registered for Cafe Cursor AI!

Your meal claim token: {{token}}

Use this link to claim your meal:
https://cafe-cursor-ai.netlify.app/claim

See you there!
```

---

## 🔍 Verify Your Data

Check if conversion worked:

```bash
# Count attendees
cat data/static/attendees.json | grep "email" | wc -l

# View first 5
cat data/static/attendees.json | head -20

# Search for specific email
cat data/static/attendees.json | grep "john@example.com"
```

---

## 🧪 Test Locally

1. **Start dev server:**

   ```bash
   npm run dev
   ```

2. **Test verification:**

   - Go to http://localhost:3000
   - Click "Claim Meal"
   - Enter an email from your JSON file
   - Should say "Welcome, [Name]!"

3. **Test full flow:**
   - Verify email ✅
   - Select food & drink ✅
   - Confirm order ✅
   - Get order number ✅

---

## 🚨 Common Issues

### Issue: "Email not found"

**Fix:** Check if email exists in `data/static/attendees.json`

```bash
cat data/static/attendees.json | grep "problem-email@example.com"
```

### Issue: "Already claimed"

**Fix:** Reset claims in Netlify Blobs

```bash
netlify blobs:delete claims claimed:email@example.com
```

### Issue: CSV parsing errors

**Fix:** Ensure CSV has these columns:

- `email` (required)
- `name` (optional, will use email prefix if missing)

Supported CSV formats:

- ✅ `name,email`
- ✅ `Email,Name,Status`
- ✅ `email,name,phone,ticket_type`
- ❌ No `email` column → ERROR

---

## 📦 File Structure

After conversion:

```
cafe-cursor-ai/
├── data/
│   └── static/
│       └── attendees.json       ← Generated from CSV
├── scripts/
│   └── convert-csv.js           ← Converter script
└── lib/
    ├── attendees.ts             ← Loads JSON file
    ├── claims-store.ts          ← Tracks claims
    └── claim-actions.ts         ← Verification logic
```

---

## 🔄 Update Attendees Later

Need to add more people after the first import?

```bash
# Export new CSV from Luma
# Run converter again (overwrites old data)
npm run convert-csv ~/Downloads/new-attendees.csv

# Deploy
git add data/static/attendees.json
git commit -m "Update attendee list"
git push
```

**Note:** Claims are stored separately in Netlify Blobs, so updating attendees won't affect existing claims.

---

## 💡 Pro Tips

1. **Keep backup CSV:** Don't delete your original Luma export
2. **Test tokens:** Try claiming with a test email before going live
3. **Monitor claims:** Check dashboard to see real-time claims
4. **Export claims:** Use `netlify blobs:list claims` to see who claimed

---

## 📞 Need Help?

- Check logs: `netlify logs`
- View blobs: `netlify blobs:list claims`
- Reset everything: `netlify blobs:delete claims --all`

---

## ✅ Checklist

Before going live:

- [ ] Exported CSV from Luma
- [ ] Ran `npm run convert-csv`
- [ ] Verified `data/static/attendees.json` has correct emails
- [ ] Tested locally (verified at least one email)
- [ ] Committed and pushed to GitHub
- [ ] Netlify deployed successfully
- [ ] Tested on production URL
- [ ] Emailed tokens to attendees (optional)

🎉 You're ready!
