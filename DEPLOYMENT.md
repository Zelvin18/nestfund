# NestFund Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Select your GitHub repository: `Zelvin18/nestfund`
5. Vercel will auto-detect Next.js configuration
6. Click "Deploy"

That's it! Vercel will:
- Build your project
- Deploy to a production URL
- Set up automatic deployments on every push to `main`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd nestfund
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? nestfund
# - In which directory is your code located? ./
# - Want to override settings? No

# For production deployment
vercel --prod
```

## 🔧 Configuration

### Build Settings (Auto-detected by Vercel)

```
Framework: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### Environment Variables

No environment variables needed for MVP. Future additions:

```env
# Database
DATABASE_URL=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Payment Gateway
PAYMENT_API_KEY=
PAYMENT_SECRET_KEY=

# AI Services
OPENAI_API_KEY=
```

## 🌐 Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `nestfund.com`)
4. Follow DNS configuration instructions
5. Vercel will automatically provision SSL certificate

## 📊 Monitoring & Analytics

Vercel provides built-in:
- **Analytics**: Page views, visitors, performance
- **Speed Insights**: Core Web Vitals
- **Logs**: Runtime logs and errors

Access in your Vercel dashboard.

## 🔄 Automatic Deployments

Every push to GitHub will trigger:
1. Build on Vercel
2. Preview deployment for branches
3. Production deployment for `main` branch

**Preview URLs**: Each PR gets its own preview URL for testing.

## 🛠️ Troubleshooting

### Build Errors

If build fails, check:
1. All dependencies are in `package.json`
2. No TypeScript errors (`npm run build` locally)
3. All environment variables are set

### Slow Builds

- Vercel automatically caches dependencies
- First build takes ~2-3 minutes
- Subsequent builds: ~30-60 seconds

### Image Optimization

Vercel automatically optimizes images via Next.js Image component.
No additional configuration needed.

## 📈 Performance Tips

1. **Enable Vercel Analytics** (free tier)
2. **Set up Edge Functions** for global performance
3. **Use Vercel Speed Insights** to monitor Core Web Vitals
4. **Configure caching headers** for static assets

## 🔐 Security

Vercel provides:
- ✅ Automatic HTTPS (SSL)
- ✅ DDoS protection
- ✅ Firewall
- ✅ Edge network security

## 📱 Mobile Testing

Test your deployed site on:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- Real devices via Vercel Preview URLs

## 🎯 Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test responsive design on mobile
- [ ] Check homepage performance
- [ ] Verify all links work
- [ ] Test property detail pages
- [ ] Check portfolio and intelligence pages
- [ ] Monitor build logs for warnings
- [ ] Set up custom domain (if applicable)
- [ ] Enable Vercel Analytics
- [ ] Share preview URL with team

## 🔗 Useful Links

- **Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)

---

**Your project is now live! 🎉**

Every commit to `main` will automatically deploy updates.
