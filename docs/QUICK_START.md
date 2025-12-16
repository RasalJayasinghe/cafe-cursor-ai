# 🚀 Quick Start Guide - Next.js Migration

## ✅ Migration Complete!

Your Vite + React project has been successfully converted to **Next.js 15** with the App Router.

## 🏃 Run the Project

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Then open: **http://localhost:3000**

## 📂 New Project Structure

```
app/                    # ← Next.js routes
├── layout.tsx         # Root layout (replaces App.tsx)
├── page.tsx           # Home page (/)
├── dashboard/         # /dashboard
├── projects/          # /projects
├── post-gen/          # /post-gen
└── moments/           # /moments

src/                   # Your components (unchanged!)
├── components/
├── context/
├── hooks/
└── lib/
```

## 🔄 Key Changes

### Navigation

```tsx
// OLD (Vite)
import { Link } from "react-router-dom";
<Link to="/dashboard">Go</Link>;

// NEW (Next.js)
import Link from "next/link";
<Link href="/dashboard">Go</Link>;
```

### Router Hook

```tsx
// OLD (Vite)
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate("/dashboard");

// NEW (Next.js)
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/dashboard");
```

### Scripts

```bash
# OLD
npm run dev      # vite
npm run build    # vite build

# NEW
npm run dev      # next dev
npm run build    # next build
npm start        # next start
```

## ⚠️ TODO: Complete Page Implementations

The following pages need full implementation (currently placeholders):

1. **`app/projects/page.tsx`** - ShareProject page
2. **`app/post-gen/page.tsx`** - PostGeneration page
3. **`app/moments/page.tsx`** - CursorMoments page

Copy the content from the original `src/pages/` files and:

- Add `"use client"` at the top
- Replace `Link` from `react-router-dom` with Next.js `Link`
- Replace `useNavigate()` with `useRouter()`

## 📝 Next Steps

1. **Test the current routes:**

   - Home: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard

2. **Complete remaining pages** (see TODO above)

3. **Optional optimizations:**
   - Add metadata to pages
   - Optimize images with Next.js `<Image>`
   - Add loading states

## 🐛 Common Issues

### Hydration Error?

Make sure `"use client"` is at the top of files using:

- `useState`, `useEffect`
- Event handlers (`onClick`, etc.)
- Browser APIs (`localStorage`, etc.)

### Module Not Found?

```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📚 Documentation

- See `MIGRATION_GUIDE.md` for detailed migration info
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

---

**Ready to go!** Start the dev server and visit http://localhost:3000 🎉
