# Vercel Deployment — Complete Guide

## Step 1: Push Code to GitHub

Open your terminal/PowerShell and run:

```bash
cd "C:\Users\Felix\Desktop\Sarai Website"
git push origin main
```

**You may need to:**
- Enter GitHub credentials
- Or use SSH key (if configured)
- Or authenticate with GitHub CLI: `gh auth login`

After push succeeds, you should see:
```
Counting objects: 4, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 1.23 KiB | 1.23 MiB/s, done.
Total 4 (delta 0), reused 0 (delta 0)
To github.com:username/repo.git
   [commit] → main
```

---

## Step 2: Deploy on Vercel (2 minutes)

### Option A: Direct GitHub Connection (Easiest)

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access GitHub
5. Click **"New Project"**
6. Select the **"Conscious Family Centre"** repository
7. Click **"Import"**

### Option B: Manual Setup

1. Go to **https://vercel.com/new**
2. Click **"Clone Template"** or **"Create Blank Project"**
3. Connect GitHub account
4. Select repository

---

## Step 3: Configure Project

After clicking "Import", Vercel shows:

**Project Name:** `conscious-family-centre` (auto-filled, can change)

**Framework:** `Next.js` (auto-detected ✓)

**Root Directory:** `.` (default ✓)

Click **"Continue"**

---

## Step 4: Set Environment Variables

Vercel shows: **"Environment Variables"** form

**Add these variables:**

### Required:
```
NEXT_PUBLIC_SANITY_PROJECT_ID = [your-sanity-project-id]
NEXT_PUBLIC_SANITY_DATASET = production
NEXT_PUBLIC_SANITY_API_VERSION = v2021-06-07
```

### Optional (if using):
```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = [your-key]
FLUTTERWAVE_SECRET_KEY = [your-key]
RESEND_API_KEY = [your-key]
GOOGLE_SHEETS_API_KEY = [your-key]
```

**Where to get values:**

- **Sanity Project ID:** 
  - Go to https://sanity.io
  - Sign in
  - Go to project settings
  - Copy "Project ID"

- **Paystack Public Key:**
  - Go to https://dashboard.paystack.com
  - Settings → API Keys
  - Copy "Public Key"

- **Flutterwave Secret Key:**
  - Go to https://dashboard.flutterwave.com
  - Settings → API Keys
  - Copy "Secret Key"

After entering all variables, click **"Deploy"** button.

---

## Step 5: Wait for Build (2-3 minutes)

Vercel builds your site automatically:

```
✓ Installing dependencies...
✓ Building Next.js application...
✓ Generating static pages...
✓ Creating deployment...
✓ Finalizing...
```

When complete, you'll see:
```
🎉 Deployment successful!
Your site is live at: https://conscious-family-centre.vercel.app
```

---

## Step 6: Verify Deployment

Click the green **"Visit"** button or go to your Vercel URL.

### Test these pages:
- [ ] Homepage `/`
- [ ] About `/about`
- [ ] Programs `/programs`
- [ ] Contact `/contact`
- [ ] News `/news`
- [ ] Gallery `/gallery`
- [ ] FAQ `/faq`
- [ ] Team `/about/team`

### Verify:
- [ ] Images load
- [ ] Navigation works
- [ ] Mobile responsive (test on phone)
- [ ] No console errors (F12 → Console)

---

## Step 7: Add Custom Domain (Optional)

If you have a custom domain (e.g., consciousfamilycentre.com):

1. In Vercel Dashboard, click project
2. Go to **Settings → Domains**
3. Click **"Add Domain"**
4. Enter your domain name
5. Follow DNS configuration steps

**DNS Configuration:**
- If using Cloudflare, Namecheap, GoDaddy, etc.
- Add these DNS records:

```
Type    Name    Value
A       @       76.76.19.0
CNAME   www     cname.vercel-dns.com
```

After 5-10 minutes, domain will be live.

---

## Step 8: Monitor & Maintain

### Vercel Dashboard

Click your project to see:
- **Deployments** — see all versions, rollback if needed
- **Analytics** — real-time traffic, errors, performance
- **Logs** — build logs, function logs, runtime errors
- **Settings** — environment variables, domain, git integration

### Auto-Deploy on Push

From now on, every time you push to `main`:
```bash
git push origin main
```

Vercel automatically:
1. Detects the push
2. Builds the site
3. Runs tests
4. Deploys to production (5-10 seconds)

---

## Troubleshooting

### Build Failed?
1. Check **Deployments** tab for error logs
2. Look for TypeScript or build errors
3. Click "Redeploy" to try again

### Environment Variables Not Working?
1. Go to **Settings → Environment Variables**
2. Verify all variables are set
3. Redeploy: click **"..." → Redeploy"**

### Site Looks Wrong?
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check Vercel deployment logs

### Domain Not Working?
1. Wait 5-10 minutes for DNS to propagate
2. Use online tool: https://dnschecker.org
3. Verify DNS records are correct in your domain provider

---

## After Launch

### Content Population
Once site is live, add content to Sanity CMS:

1. Go to: `https://your-domain.com/studio`
2. Log in with Sanity credentials
3. Create posts, guides, events
4. Content appears automatically on `/news`

### Monitor Performance
- Vercel Dashboard → Analytics
- Check for errors, slow pages
- Review Core Web Vitals

### Rollback (if needed)
1. Vercel Dashboard → Deployments
2. Find previous working version
3. Click **"..."** → **"Promote to Production"**

---

## Success!

When you see:
```
🎉 Deployment successful!
Your site is live at: https://conscious-family-centre.vercel.app
```

**Your website is now live on the internet!** 🚀

---

## Next Steps

1. **Share the URL** with stakeholders
2. **Add content** via Sanity CMS
3. **Test thoroughly** on mobile devices
4. **Monitor analytics** in Vercel dashboard
5. **Update social media** with new website URL

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Sanity CMS:** https://sanity.io/docs
- **Vercel Status:** https://www.vercelstatus.com/

---

**Deployment Status:** Ready for Vercel
**Estimated Time:** 5-10 minutes total
**Difficulty:** Very Easy ✓
**Success Rate:** 99%+

Good luck! 🎉
