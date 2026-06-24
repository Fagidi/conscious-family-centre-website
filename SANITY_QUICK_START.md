# ⚡ Sanity Quick Start Checklist

## Phase 1: Project Setup (15 minutes)

- [ ] Create Sanity project at https://sanity.io
- [ ] Get Project ID and Dataset name
- [ ] Create API token (Editor permission)
- [ ] Copy to `.env.local`:
  ```
  NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
  NEXT_PUBLIC_SANITY_DATASET=production
  SANITY_API_TOKEN=xxx
  ```
- [ ] Restart dev server: `npm run dev`
- [ ] Access Sanity Studio: http://localhost:3000/studio

## Phase 2: Content Structure (30 minutes)

### Settings (Do These First)
- [ ] Fill "Site Settings" (name, phone, email, address)
- [ ] Fill "Navigation" (menu items)
- [ ] Publish both

### People (Team)
- [ ] Add 3-4 team members:
  - Name, role, photo, bio, qualifications
  - Use team page modal to test
- [ ] Publish each

### Content
- [ ] Add 2-3 blog posts:
  - Title, content, featured image
  - Category, author
- [ ] Add 2-3 programs:
  - Name, description, age group, image
- [ ] Add 1-2 testimonials:
  - Quote, author name, program

## Phase 3: Testing (15 minutes)

- [ ] Restart dev: `npm run dev`
- [ ] Check homepage loads
- [ ] View `/about/team` — see team members
- [ ] View `/news` or `/blog` — see posts
- [ ] View `/programs` — see programs
- [ ] Check all images load
- [ ] Check all text appears correct

## Phase 4: Debug (If Issues)

- [ ] Open http://localhost:3000/studio
- [ ] Click "Vision" tab
- [ ] Test GROQ query:
  ```groq
  *[_type == "teamMember"]
  ```
- [ ] Should see data returned
- [ ] Check browser console for errors
- [ ] Check Sanity API token is valid

## Phase 5: Production (10 minutes)

- [ ] Add environment variables to Vercel:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `SANITY_API_TOKEN`
- [ ] Deploy Studio: `sanity deploy`
- [ ] Push to GitHub: `git push origin main`
- [ ] Vercel auto-deploys
- [ ] Visit your Vercel domain
- [ ] Check Studio works: https://[project].sanity.studio

## Key Contacts/Links

| Item | Location |
|------|----------|
| Project | https://sanity.io/manage |
| Studio (Local) | http://localhost:3000/studio |
| Studio (Live) | https://[project].sanity.studio |
| Queries | `lib/sanity/queries.ts` |
| Data Functions | `lib/data.ts` |
| Desk Structure | `sanity/structure.ts` |
| Setup Guide | `SANITY_SETUP_GUIDE.md` |

## Quick Commands

```bash
# Start dev server
npm run dev

# Build
npm run build

# Deploy Studio
sanity deploy

# Check Sanity CLI
sanity --version
```

## Common Paths

**Adding Team Members:**
1. Go to http://localhost:3000/studio
2. Click "People & Proof" → "Team"
3. Click "Create"
4. Fill form
5. Click "Publish"

**Adding Blog Posts:**
1. Click "Content" → "Blog"
2. Click "Create"
3. Fill form
4. Click "Publish"

**Viewing on Website:**
- Team: http://localhost:3000/about/team
- Blog: http://localhost:3000/news (or /blog)
- Programs: http://localhost:3000/programs

## Environment Variables Template

Save this in `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here

# Optional: Other services
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing Checklist

After adding content, verify:

- [ ] Team members show on `/about/team`
- [ ] Team modal opens and shows full bio
- [ ] Blog posts show on `/news`
- [ ] Images display correctly
- [ ] No console errors
- [ ] All links work
- [ ] SEO fields display in head (check page source)

---

**Time to complete: ~1 hour total**

Once done, you can edit everything from Sanity Studio! 🎉
