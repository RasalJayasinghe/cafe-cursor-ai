# Migration Guide: Vite + React → Next.js

## ✅ Completed Migration Steps

This project has been successfully migrated from **Vite + React** to **Next.js 15** with the App Router.

### 1. **Dependencies Updated** ✅

- ✅ Removed: `vite`, `react-router-dom`, `@vitejs/plugin-react-swc`
- ✅ Added: `next@^15.1.0`, `eslint-config-next`
- ✅ Kept all UI libraries: Radix UI, TanStack Query, Framer Motion, Tailwind CSS, shadcn/ui components

### 2. **Project Structure** ✅

```
cafe-cursor-ai/
├── app/                          # ← NEW: Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (/)
│   ├── dashboard/page.tsx       # /dashboard route
│   ├── projects/page.tsx        # /projects route
│   ├── post-gen/page.tsx        # /post-gen route
│   ├── moments/page.tsx         # /moments route
│   └── not-found.tsx            # 404 page
├── src/
│   ├── components/              # ← UNCHANGED: All components stay here
│   ├── context/                 # ← UPDATED: Added 'use client'
│   ├── hooks/                   # ← UNCHANGED
│   └── lib/                     # ← UNCHANGED
├── public/                       # ← UNCHANGED: Static assets
├── next.config.js               # ← NEW: Next.js config
├── tsconfig.json                # ← UPDATED: Next.js TypeScript config
└── package.json                 # ← UPDATED: Next.js scripts
```

### 3. **Configuration Files** ✅

- ✅ Created `next.config.js`
- ✅ Updated `tsconfig.json` for Next.js
- ✅ Updated `.gitignore` for Next.js
- ✅ Removed `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`

### 4. **Routing Migration** ✅

**Before (React Router):**

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

<Link to="/dashboard">Dashboard</Link>;
```

**After (Next.js):**

```tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

<Link href="/dashboard">Dashboard</Link>;
```

### 5. **Client Components** ✅

Added `"use client"` directive to all interactive components:

- ✅ `src/context/AppContext.tsx`
- ✅ `src/components/sections/Hero.tsx`
- ✅ `src/components/flows/*.tsx`
- ✅ `app/layout.tsx`
- ✅ All page components in `app/`

### 6. **Context Provider Updates** ✅

Updated `AppContext` to handle Next.js SSR:

- Changed from lazy initialization to `useEffect` for localStorage
- Added `mounted` state to prevent hydration mismatches
- Wrapped with `"use client"` directive

## 🚀 How to Run

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit: http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## 📋 Remaining Tasks

### High Priority

1. **Complete Page Implementations**

   - `app/projects/page.tsx` - Full ShareProject implementation
   - `app/post-gen/page.tsx` - Full PostGeneration implementation
   - `app/moments/page.tsx` - Full CursorMoments implementation

2. **Update All React Router References**

   - Search for any remaining `react-router-dom` imports
   - Replace `useNavigate()` with `useRouter()` from `next/navigation`
   - Replace `<Link to="">` with `<Link href="">`

3. **Image Optimization**
   - Replace `<img>` with Next.js `<Image>` component
   - Configure image domains in `next.config.js` if needed

### Medium Priority

4. **Metadata & SEO**

   ```tsx
   // Add to each page
   export const metadata = {
     title: "Page Title",
     description: "Page description",
   };
   ```

5. **Environment Variables**

   - Create `.env.local` for local environment variables
   - Use `NEXT_PUBLIC_` prefix for client-side variables

6. **API Routes** (if needed)
   - Create `app/api/` directory for API endpoints
   - Example: `app/api/hello/route.ts`

### Low Priority

7. **Performance Optimization**

   - Add `loading.tsx` files for route loading states
   - Implement `error.tsx` for error boundaries
   - Consider Server Components where possible

8. **Testing**
   - Update test configurations for Next.js
   - Test all routes and functionality

## 🔧 Key Differences: Vite vs Next.js

| Feature          | Vite + React                  | Next.js                              |
| ---------------- | ----------------------------- | ------------------------------------ |
| **Routing**      | React Router                  | File-based routing                   |
| **Entry Point**  | `src/main.tsx` + `index.html` | `app/layout.tsx` + `app/page.tsx`    |
| **Client State** | Always client-side            | Server Components by default         |
| **Images**       | `<img>` tag                   | `<Image>` component                  |
| **Navigation**   | `useNavigate()`               | `useRouter()` from `next/navigation` |
| **Links**        | `<Link to="">`                | `<Link href="">`                     |
| **Build Output** | `dist/`                       | `.next/`                             |
| **Dev Server**   | `vite dev`                    | `next dev`                           |

## 📝 Important Notes

### "use client" Directive

Components need `"use client"` when they use:

- React hooks (`useState`, `useEffect`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`localStorage`, `window`, etc.)
- Context consumers

### File Structure

- **`app/`**: Routes and layouts (Next.js App Router)
- **`src/`**: Shared components, utilities, and logic
- **`public/`**: Static assets (accessible at root `/`)

### Imports

- Path aliases work the same: `@/components/...`
- No need to change component imports
- Only routing-related imports need updates

## 🎯 Migration Checklist

- [x] Update package.json
- [x] Create Next.js config files
- [x] Set up app directory structure
- [x] Create root layout
- [x] Create home page
- [x] Create route pages
- [x] Update context provider
- [x] Add "use client" directives
- [x] Update routing in Hero component
- [x] Remove Vite files
- [x] Update .gitignore
- [ ] Complete all page implementations
- [ ] Test all routes
- [ ] Verify all features work
- [ ] Update documentation

## 🐛 Troubleshooting

### Hydration Errors

If you see hydration mismatch errors:

- Ensure `"use client"` is at the top of client components
- Check for server/client content mismatches
- Use `mounted` state for client-only content

### Module Not Found

If you see import errors:

- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

### Styling Issues

If styles aren't loading:

- Check `app/layout.tsx` imports `@/index.css`
- Verify Tailwind config paths include `app/**`
- Check PostCSS config is correct

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Vite to Next.js Migration](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)

---

**Migration completed by:** GitHub Copilot  
**Date:** December 16, 2025  
**Status:** ✅ Core migration complete, full implementation in progress
