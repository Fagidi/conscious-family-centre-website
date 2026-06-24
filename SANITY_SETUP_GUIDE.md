# 🎨 Sanity CMS Setup & Integration Guide

## Quick Overview

Your site has a complete Sanity CMS setup with:
- ✅ Schemas defined (documents, objects, singletons)
- ✅ Desk structure (organized interface)
- ✅ Frontend queries configured
- ✅ Image handling with alt text
- ✅ SEO fields
- ✅ Slug generation

You just need to:
1. Create/link a Sanity project
2. Set environment variables
3. Deploy Sanity Studio
4. Add content
5. Test connections

---

## Step 1: Create a Sanity Project

### Option A: Using Sanity CLI (Recommended)

```bash
npm install -g @sanity/cli
sanity init
```

**During init, select:**
- Create a new project
- Project name: "Conscious Family Centre"
- Dataset name: "production"
- Select "Blog" template (we'll customize)
- Skip TypeScript (we have it in code)

### Option B: Use Existing Sanity Account

Go to https://sanity.io/manage and create a new project there.

---

## Step 2: Get Project Credentials

After project creation, you'll have:

```
Project ID: [your-id]
Dataset: production
```

### Find Your Credentials:

1. Go to https://sanity.io/manage
2. Select your project
3. Click "API" in left sidebar
4. Copy **Project ID**
5. Note dataset name (usually "production")

---

## Step 3: Set Environment Variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
```

### Get API Token:

1. Go to https://sanity.io/manage
2. Select your project → API
3. Click "Tokens" tab
4. Create new token:
   - Name: "Web Frontend"
   - Permissions: Editor (for now)
5. Copy token to `.env.local`

### Update `.env.example`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
```

---

## Step 4: Deploy Sanity Studio

### Local Development:

```bash
npm run dev
```

Visit: http://localhost:3000/studio

### Deploy to Sanity Hosting (Free):

```bash
sanity deploy
```

You'll get a URL like: `https://[project-slug].sanity.studio`

---

## Step 5: Content Structure Overview

### **Core Data Model**

#### **Settings (Singletons)**
- **Site Settings** — Logo, phone, email, address, socials
- **Home Page** — Hero, sections, CTAs
- **About Page** — Story, mission, vision, stats
- **Programs Page** — Programs list, categories
- **FAQ Page** — FAQ list
- **Contact Page** — Form settings
- **Navigation** — Menu items

#### **Programs & Camps**
- **Program** — Name, description, age group, schedule
- **Camp Session** — Dates, price, capacity
- **Registration** — Camp/program registrations

#### **People & Proof**
- **Team Member** — Name, role, photo, bio, qualifications
- **Author** — For blog posts
- **Testimonial** — Quote, author, program, video
- **Gallery Item** — Image, title, category
- **Featured Story** — Multi-image story

#### **Content**
- **Post** — Blog articles
- **Guide** — Educational guides
- **FAQ** — FAQ items
- **Page** — Custom pages
- **Contact Message** — Form submissions (auto-collected)

---

## Step 6: Add Content in Sanity Studio

### Access Studio:
- **Local:** http://localhost:3000/studio
- **Hosted:** https://[project].sanity.studio

### Start with Site Settings (Required First)

1. Click "Site Settings"
2. Fill in:
   - Site name
   - Phone number
   - Email
   - Address
   - Social links

3. Click "Publish"

### Add Team Members

1. Go to "People & Proof" → "Team"
2. Click "Create"
3. Fill in:
   - **Name** — Full name
   - **Role** — Job title
   - **Slug** — Auto-generates from name
   - **Photo** — Upload image (will ask for alt text)
   - **Bio** — Biography text
   - **Qualifications** — Array of credentials
   - **Order** — Sort order (lower = first)
4. Click "Publish"

### Add Programs

1. Go to "Programs" → "Programs"
2. Click "Create"
3. Fill in:
   - **Title** — Program name
   - **Description** — Full description
   - **Slug** — Auto-generates
   - **Age Group** — Target age
   - **Duration** — How long (e.g., "6 weeks")
   - **Schedule** — When/how often
   - **Image** — Program photo
   - **Features** — Array of key features
   - **Category** — Choose category
4. Click "Publish"

### Add Blog Posts

1. Go to "Content" → "Blog"
2. Click "Create"
3. Fill in:
   - **Title** — Post title
   - **Slug** — Auto-generates
   - **Content** — Rich text editor
   - **Author** — Choose author
   - **Category** — Blog category
   - **Published Date** — When to publish
   - **Featured Image** — Post hero image
   - **Excerpt** — Short summary
   - **SEO** — Meta title, description, keywords
4. Click "Publish"

---

## Step 7: Test the Connection

### In Your App:

1. Restart dev server: `npm run dev`
2. Check console for Sanity queries
3. Visit pages and verify data loads:
   - `/` — Homepage (check theme, announcements)
   - `/about/team` — Team members should appear
   - `/programs` — Programs should load
   - `/blog` or `/news` — Posts should display

### Debug Queries:

1. Go to http://localhost:3000/studio
2. Click "Vision" tab (GROQ query builder)
3. Test queries:

```groq
*[_type == "teamMember"] | order(order asc)

*[_type == "program"] | order(order asc)

*[_type == "post"] | order(publishedDate desc)

*[_type == "siteSettings"][0]
```

---

## Step 8: Understanding Sanity Queries

### Where Queries Are Defined:

```
lib/sanity/queries.ts  ← GROQ queries
lib/data.ts            ← Data-fetching functions
```

### Example Query:

```typescript
// lib/sanity/queries.ts
export const TEAM_QUERY = groq`
  *[_type == "teamMember"] | order(order asc) {
    name,
    role,
    bio,
    "slug": slug.current,
    photo {
      asset -> {
        url,
      },
      alt,
    },
    qualifications,
  }
`;

// lib/data.ts
export async function getTeam() {
  return await sanityFetch<TeamMember[]>({
    query: TEAM_QUERY,
  });
}
```

### Using in Components:

```typescript
// app/(site)/about/team/page.tsx
const team = await getTeam();

team.map(member => (
  <TeamMemberCard key={member.slug} member={member} />
))
```

---

## Step 9: Content Best Practices

### Images
- ✅ Always add alt text
- ✅ Use descriptive names
- ✅ Optimize before uploading (max 2MB)
- ✅ Use WebP format when possible

### Text
- ✅ Use rich text editor for long content
- ✅ Add proper headings (H2, H3)
- ✅ Keep paragraphs short
- ✅ Use bullet points for lists

### SEO
- ✅ Fill in meta title (50-60 chars)
- ✅ Add meta description (150-160 chars)
- ✅ Add keywords
- ✅ Use descriptive slugs

### Workflow
- ✅ Save drafts frequently
- ✅ Preview before publishing
- ✅ Don't delete old content (archive instead)
- ✅ Keep slug URLs consistent

---

## Step 10: Production Deployment

### Before Deploying:

1. **Test locally:**
   ```bash
   npm run build
   npm run dev
   ```

2. **Check all pages load:**
   - Homepage
   - About/Team
   - Programs
   - News/Blog
   - Contact

3. **Verify Sanity queries work:**
   - No console errors
   - Data displays correctly
   - Images load properly

### Deploy to Vercel:

```bash
git push origin main
```

Vercel will auto-deploy when you push.

### Set Production Environment Variables:

1. Go to Vercel dashboard
2. Select project → Settings → Environment Variables
3. Add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`

---

## Common Issues & Fixes

### Images Not Loading
- ✅ Check image URLs in GROQ queries
- ✅ Verify image asset exists in Sanity
- ✅ Check alt text is provided

### Content Not Updating
- ✅ Rebuild frontend: `npm run build`
- ✅ Clear cache: `rm -rf .next`
- ✅ Check Sanity API token is valid

### Draft vs Published
- ✅ Make sure to click "Publish" (not just "Save")
- ✅ Drafts don't appear on frontend by default
- ✅ Use Vision tool to debug

### Slug Errors
- ✅ Slugs must be unique per document type
- ✅ Use only lowercase letters, numbers, hyphens
- ✅ Auto-generated from title (modify as needed)

---

## Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Deploy Sanity Studio
sanity deploy

# Check Sanity status
sanity hook list

# Export data
sanity dataset export production ./export.ndjson

# Import data
sanity dataset import ./export.ndjson production
```

---

## API Reference

### Key Sanity Functions:

```typescript
// Fetch with caching
await sanityFetch({ query: GROQ_QUERY })

// Fetch live (no cache)
await sanityFetch({ query: GROQ_QUERY, cache: false })

// Get single document
*[_type == "siteSettings"][0]

// Get multiple with filter
*[_type == "program" && featured == true]

// Order by field
*[_type == "teamMember"] | order(order asc)

// Select specific fields
*[_type == "post"] { title, slug, "image": image.asset->url }
```

---

## Next Steps

1. ✅ Create Sanity project
2. ✅ Set environment variables
3. ✅ Deploy Studio
4. ✅ Add Site Settings
5. ✅ Add Team Members
6. ✅ Add Programs
7. ✅ Add Blog Posts
8. ✅ Test locally
9. ✅ Deploy to Vercel
10. ✅ Monitor and maintain

---

## Support Resources

- **Sanity Docs:** https://www.sanity.io/docs
- **GROQ Reference:** https://www.sanity.io/docs/groq
- **Image Handling:** https://www.sanity.io/docs/image-type
- **API Reference:** https://www.sanity.io/docs/api-reference

---

**You're all set! Start building your content in Sanity Studio. 🚀**
