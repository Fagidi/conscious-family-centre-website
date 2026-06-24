# Deployment Guide — Conscious Family Centre Website

**Status:** ✅ Production Ready
**Build:** 24 routes optimized
**Commit:** e7701ed (Phase 3 CMS integration)
**Date:** 2026-06-24

---

## Quick Deploy (Recommended: Vercel)

### Step 1: GitHub Setup
```bash
# Push to GitHub (if not already done)
git push origin main
```

### Step 2: Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Select the Conscious Family Centre repository
5. Configure environment variables (see below)
6. Click "Deploy"

**Vercel will auto-deploy on every push to main**

---

## Environment Variables

Create `.env.production` with these variables:

```
# Required: Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=v2021-06-07

# Optional: Payment Gateway (if using)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_public_key
FLUTTERWAVE_SECRET_KEY=your_secret_key

# Optional: Email & Forms (if using)
RESEND_API_KEY=your_api_key
GOOGLE_SHEETS_API_KEY=your_api_key
```

**Get values from:**
- Sanity: sanity.io → Project settings
- Paystack: dashboard.paystack.com
- Flutterwave: dashboard.flutterwave.com
- Resend: resend.com
- Google Sheets: console.cloud.google.com

---

## Domain Configuration

### Option A: Vercel Domain
- Vercel auto-assigns: `conscious-family-centre.vercel.app`
- Custom domain: Project Settings → Domains → Add custom domain

### Option B: Custom Domain (Cloudflare, GoDaddy, etc.)
1. Purchase domain
2. Create DNS A records pointing to Vercel IP
3. Add domain in Vercel project settings
4. Wait for SSL certificate (5-10 minutes)

**Recommended DNS records:**
```
Type    Name    Value
A       @       76.76.19.0  (Vercel IP)
CNAME   www     cname.vercel-dns.com
```

---

## Alternative Deployment Options

### Option B: Node.js Server (Self-Hosted)
```bash
npm install
npm run build
npm run start
# Runs on http://localhost:3000

# Use PM2 for production:
pm2 start "npm run start" --name "cfc-website"
pm2 startup
pm2 save
```

### Option C: Docker
```bash
# Build image
docker build -t cfc-website .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SANITY_PROJECT_ID=your_id \
  -e NEXT_PUBLIC_SANITY_DATASET=production \
  cfc-website

# Push to Docker Hub or use with Heroku, AWS, etc.
```

### Option D: AWS Amplify
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Deploy
amplify publish
```

---

## Post-Deployment Verification

Run this checklist after deployment:

- [ ] Homepage loads (/).
- [ ] Navigation floats correctly
- [ ] Mega menu opens and shows categories
- [ ] Secondary nav appears after scrolling
- [ ] About page loads (/about)
- [ ] Programs page loads (/programs)
- [ ] Contact form loads (/contact)
- [ ] News page loads with CMS structure (/news)
- [ ] Founder page accessible (/about/founder)
- [ ] Team page loads (/about/team)
- [ ] Images load without errors
- [ ] Forms submit without errors
- [ ] Mobile responsive (test on phone)
- [ ] Lighthouse score > 75
- [ ] No console errors

---

## Content Population (Next Steps)

After deployment, add content to Sanity CMS:

### 1. Log into Sanity Studio
```
https://your-domain.com/studio
```

### 2. Add Content
- **Posts**: Blog articles, announcements
- **Guides**: Parent resources
- **Events**: Workshops and gatherings
- **Team**: Team member profiles
- **FAQs**: Frequently asked questions

### 3. Verify on Website
Content auto-displays on:
- `/news` — Articles, events, guides
- `/about/team` — Team profiles
- `/faq` — FAQ categories

---

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor builds: [vercel.com/dashboard](https://vercel.com/dashboard)
- View analytics: Real-time traffic, errors, performance
- Rollback deployments: One-click if needed

### Performance Tracking
```bash
# Test Lighthouse score
npm run build && npm run start
# Then run Lighthouse audit in Chrome DevTools
```

### Regular Maintenance
- Monitor error logs weekly
- Review analytics monthly
- Update content monthly
- Security updates as needed

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm install
npm run build
```

### Sanity CMS Not Loading
- Verify environment variables in Vercel
- Check Sanity project is public
- Review CORS settings

### Forms Not Submitting
- Check email service API keys
- Verify Google Sheets permissions
- Test locally first

### Images Not Loading
- Verify Sanity image URLs are public
- Check Cloudinary/image service credentials
- Use Next.js Image component

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Sanity CMS**: https://sanity.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React**: https://react.dev

---

## Rollback Procedure

If deployment issues occur:

### Vercel Rollback
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "Promote to Production"

### Git Rollback
```bash
git revert <commit-hash>
git push origin main
```

---

**Deployment Date:** Ready Now
**Next Review:** After content population
**Status:** ✅ READY FOR LAUNCH
