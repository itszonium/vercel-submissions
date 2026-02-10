# Deployment Guide

Choose your preferred hosting platform and follow the steps below.

## Table of Contents
1. [Firebase Hosting](#firebase-hosting) - Recommended
2. [Netlify](#netlify) - Easiest
3. [GitHub Pages](#github-pages) - Free with GitHub
4. [Vercel](#vercel) - Modern static hosting
5. [Traditional Web Hosting](#traditional-web-hosting)
6. [Setting Up Custom Domain](#custom-domain)

---

## Firebase Hosting

**Why Choose**: Integrates seamlessly with your Firebase Realtime Database, reliable, free tier included.

### Prerequisites
- Node.js installed (download from nodejs.org)
- Firebase account
- Firebase CLI

### Steps

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```
   This opens your browser to authenticate.

3. **Initialize Firebase in your project:**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project from the list
   - When asked "What do you want to use as your public directory?": Enter `.` (current directory)
   - When asked "Configure as a single-page app?": Enter `y` (yes)
   - When asked "File index.html already exists. Overwrite?": Enter `n` (no)

4. **Deploy:**
   ```bash
   firebase deploy
   ```

5. **Get your URL:**
   After deployment, you'll see:
   ```
   Hosting URL: https://your-project.web.app
   Also available at: https://your-project.firebaseapp.com
   ```

### Continuous Deployment
Set up automatic deployments on push:

```bash
firebase init hosting:github
```

Select "Set up automatic builds and deploys with GitHub" and follow the prompts.

---

## Netlify

**Why Choose**: Simplest deployment, no CLI needed initially, excellent performance.

### Option A: Drag & Drop (Simplest)

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub, GitLab, Bitbucket, or email
3. Drag and drop your project folder
4. Your site is live!

Site URL format: `https://random-name.netlify.app`

### Option B: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com), click "New site from Git"
3. Connect to GitHub, authorize Netlify
4. Select your repository
5. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `.` (or current directory)
6. Deploy!

**Auto-Deploy**: Every push to main branch auto-deploys

### Option C: CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Authenticate:
   ```bash
   netlify login
   ```

3. Deploy:
   ```bash
   netlify deploy
   ```

4. To make live (optional):
   ```bash
   netlify deploy --prod
   ```

---

## GitHub Pages

**Why Choose**: Free, integrates with GitHub, good for public projects.

### Steps

1. **Create GitHub repository:**
   - Go to github.com and create a new repository
   - Name it: `12-word-verifier`
   - Make it public

2. **Initialize git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/12-word-verifier.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings
   - Click "Pages" in left sidebar
   - Under "Build and deployment"
   - Source: Select "Deploy from a branch"
   - Branch: Select `main` and `/(root)`
   - Click Save

4. **Wait and access:**
   - Pages will take ~1 minute to build
   - Your site: `https://yourusername.github.io/12-word-verifier`

### Auto-Update
Any push to `main` branch automatically updates your live site.

---

## Vercel

**Why Choose**: Built for static sites, super fast, great integrations.

### Option A: CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts, answer `y` to setup defaults.

### Option B: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click Deploy

---

## Traditional Web Hosting

If using cPanel, Shared Hosting, or similar:

1. **Upload files** via FTP/SFTP:
   - Connect to your hosting via FTP
   - Upload all files to `public_html` folder:
     - index.html
     - styles.css
     - app.js
     - config.js
     - README.md
     - Other files

2. **Ensure correct permissions:**
   - index.html: 644
   - Folders: 755

3. **Create .htaccess** (for Apache servers):
   Create a file named `.htaccess` with:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule ^ index.html [QSA,L]
   </IfModule>
   ```

4. **Access your site:**
   Visit `https://yourdomain.com`

---

## Custom Domain

### For Firebase Hosting

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain
4. Follow the DNS setup instructions
5. Verify domain ownership (usually with DNS record)

### For Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records at your domain registrar
4. Wait for DNS propagation (can take 48 hours)

### For GitHub Pages

1. Go to repository Settings → Pages
2. Under "Custom domain" enter your domain
3. Create DNS record pointing to GitHub Pages (see docs)
4. GitHub will handle SSL certificate automatically

### For Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Vercel auto-provisions SSL

---

## Performance Optimization

### Before Deploying

1. **Minify files** (optional):
   ```bash
   # Using terser for JavaScript
   npm install -g terser
   terser app.js -o app.min.js -c -m
   ```

2. **Enable gzip compression** (automatic on most platforms)

3. **Set cache headers** (Firebase/Netlify do this automatically)

### Monitor Performance

- Use [PageSpeed Insights](https://pagespeed.web.dev)
- Check [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/) in Chrome DevTools
- Monitor Firebase usage in Firebase Console

---

## Monitoring & Maintenance

### Firebase Console
- Check **Database** → **Usage** to monitor reads/writes
- Check **Hosting** → **Metrics** for traffic
- Set up **Alerts** for high usage

### Netlify Analytics
- Built-in analytics (paid plan)
- Or integrate with Google Analytics

### GitHub
- Watch for security alerts
- Update dependencies regularly

---

## Troubleshooting Deployments

### Firebase
```
Error: "Hosting URL not showing"
Fix: Wait 5 minutes, refresh page

Error: "404 Not Found"
Fix: Check firebase.json public directory is correct
Fix: Ensure all files uploaded (check Firebase Console → Hosting → Files)
```

### Netlify
```
Error: "Site not deploying"
Fix: Check build log in Netlify dashboard
Fix: Ensure no build errors

Error: "Submissions not showing"
Fix: Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
```

### GitHub Pages
```
Error: "Page not found"
Fix: Wait 1-2 minutes, refresh browser
Fix: Check repository Settings → Pages is enabled
Fix: Verify branch is 'main' and directory is '/(root)'
```

---

## Summary

| Platform | Setup Time | Cost | Best For |
|----------|-----------|------|----------|
| Firebase | 10 min | Free tier | Firebase users |
| Netlify | 5 min | Free/Paid | Easiest setup |
| GitHub Pages | 10 min | Free | GitHub users |
| Vercel | 5 min | Free/Paid | Modern deployments |
| Traditional | 15 min | Varies | Legacy hosting |

**Recommendation**: Start with **Netlify** for simplicity, upgrade to **Firebase** if you need closer integration with your database.

---

## Next Steps

1. Choose your platform above
2. Follow deployment steps
3. Test your live URL
4. Share with users
5. Monitor submissions in real-time
6. Keep Firebase config secret (don't expose in version control)
