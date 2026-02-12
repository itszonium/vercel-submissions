# Pre-Deployment Checklist

**Verify everything before going live to production.**

---

## ✅ Database Setup

- [ ] Created Supabase project at app.supabase.com
- [ ] Created `submissions` table with correct schema
- [ ] Created indexes: `idx_submissions_timestamp`, `idx_submissions_valid`
- [ ] Enabled Row-Level Security (RLS)
- [ ] Created RLS policies:
  - [ ] `Allow public read` (SELECT)
  - [ ] `Allow public insert` (INSERT)
- [ ] Tested table by inserting test row manually
- [ ] Verified test row appears in Table Editor

---

## ✅ Environment Variables

- [ ] Created `.env.local` file (or `.env` for production)
- [ ] Set `VITE_SUPABASE_URL` to your Supabase project URL
- [ ] Set `VITE_SUPABASE_ANON_KEY` to your Supabase anon key
- [ ] Both values are from Supabase Settings → API
- [ ] `.env.local` is in `.gitignore` (don't commit secrets!)
- [ ] For Vercel: Added same values to project Settings → Environment Variables

---

## ✅ Code Customization

- [ ] Updated `CORRECT_PHRASE` array in `app.js` with your 12 words
- [ ] Verified words are lowercase, space-separated
- [ ] Tested form with correct phrase shows all ✅ marks
- [ ] Tested form with wrong words shows ❌ marks
- [ ] Discord username validation works (test with invalid format)
- [ ] Form clears after successful submission

---

## ✅ Testing Locally

- [ ] Started local server: `python -m http.server 8000`
- [ ] Opened `http://localhost:8000` in browser
- [ ] Tested full submission with valid phrase
- [ ] Submission appears in "Live Submission Wall"
- [ ] Wall updates every 3 seconds
- [ ] Refresh page, submission still shows
- [ ] Dark mode toggle works (🌙 → ☀️)
- [ ] Mobile view is responsive and usable

---

## ✅ Browser Compatibility

- [ ] Tested in Chrome/Chromium ✓
- [ ] Tested in Firefox ✓
- [ ] Tested in Safari (if Mac)
- [ ] Tested in Edge (if Windows)
- [ ] Mobile browser works (iOS Safari or Chrome)

---

## ✅ Security Review

- [ ] No hardcoded credentials in code
- [ ] No sensitive data in console logs
- [ ] XSS protection enabled (HTML escaping)
- [ ] RLS policies are correct (public read/insert only)
- [ ] No DELETE/UPDATE policies (immutable submissions)
- [ ] Environment variables use Supabase Anon Key (not Service Role key)

---

## ✅ Vercel Deployment

- [ ] Pushed all code to GitHub
- [ ] Created new project at Vercel.com
- [ ] Imported GitHub repository
- [ ] Added Environment Variables in Vercel:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Build completed successfully
- [ ] No build errors in Vercel dashboard
- [ ] Deployment URL assigned (e.g., `your-project.vercel.app`)

---

## ✅ Post-Deployment Testing

- [ ] Opened Vercel deployment URL in browser
- [ ] Form loads without errors
- [ ] Verified Supabase connection (check browser console)
- [ ] Submitted test entry from Vercel URL
- [ ] Test entry appears in live wall within 3 seconds
- [ ] Entry also visible in Supabase Table Editor
- [ ] Dark mode works on Vercel URL
- [ ] Mobile view works on Vercel URL

---

## ✅ CORS Configuration

- [ ] Went to Supabase Settings → API → CORS
- [ ] Added your Vercel deployment URL: `https://your-project.vercel.app`
- [ ] Waited 5 minutes for CORS to propagate
- [ ] Tested submission again after waiting

---

## ✅ Monitoring & Maintenance

- [ ] Set calendar reminder to check Supabase dashboard weekly
- [ ] Reviewed submission count in dashboard
- [ ] Checked for any errors in submissions table
- [ ] Verified latest submission timestamp is recent
- [ ] Backed up submissions (via Supabase, automatic)

---

## ✅ Documentation & Handover

- [ ] Updated `CORRECT_PHRASE` documentation if needed
- [ ] Saved Supabase credentials in secure location
- [ ] Documented any customizations made
- [ ] Shared project URL with stakeholders
- [ ] Created admin guide (if applicable)
- [ ] Set up admin access to Supabase if needed

---

## ⚠️ Common Mistakes (Avoid These!)

- ❌ Left `.env.local` values as placeholders
- ❌ Used Service Role Key instead of Anon Key
- ❌ Didn't add CORS URL to Supabase settings
- ❌ Forgot to enable RLS
- ❌ Created RLS deny policies instead of allow
- ❌ Committed `.env.local` to GitHub
- ❌ Used Firebase instead of Supabase
- ❌ Forgot to deploy environment variables to Vercel
- ❌ Used wrong timestamp field for ranking
- ❌ Allowed DELETE/UPDATE policies (security risk!)

---

## 🆘 If Something Breaks

**Submissions aren't appearing?**
1. Check browser console (F12) for JavaScript errors
2. Check Supabase dashboard - is data in the table?
3. Verify RLS policies are enabled
4. Check CORS settings in Supabase
5. Hard refresh browser (Ctrl+Shift+R)

**Getting authentication errors?**
1. Verify Anon Key is correct (not Service Role Key)
2. Check CORS URL matches your domain exactly
3. Ensure RLS policies allow public insert

**Form won't submit?**
1. Check Firefox/Chrome console for errors
2. Verify `.env.local` has correct values
3. Test network connectivity (check Network tab in DevTools)
4. Try submitting from Vercel dashboard (might be localhost issue)

**Wall shows "Error loading submissions"?**
1. Check Supabase is online (dashboard accessible?)
2. Verify CORS entries
3. Check browser console for specific error
4. Reload page and wait 5 seconds

---

## 📋 Phase 2 Checklist (Future Features)

- [ ] Add Discord OAuth authentication
- [ ] Send email on submission
- [ ] Create admin dashboard
- [ ] Add rate limiting
- [ ] Set up Discord webhook notifications
- [ ] Create leaderboard webpage
- [ ] Add CSV export functionality
- [ ] Set up monitoring/alerts

---

## 🎉 You're Ready!

If you've checked all boxes above, your system is production-ready. 

**Next steps:**
1. Share your Vercel URL with users
2. Monitor submissions daily
3. Celebrate the first few entries! 🎊

---

**Questions?** See [SUPABASE-SETUP.md](SUPABASE-SETUP.md) for detailed help.
