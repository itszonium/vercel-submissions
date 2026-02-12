# QUICKSTART - Get Running in 5 Minutes

**Fast track to a working system. Detailed setup in [SUPABASE-SETUP.md](SUPABASE-SETUP.md)**

---

## ⚡ 5-Minute Setup

### 1. Create Supabase Project (2 min)
```
1. Go to https://app.supabase.com
2. New Project → Name: "word-verifier" → Create
3. Wait for database (2-3 min)
4. Settings → API → Copy:
   - Project URL
   - Anon Key
```

### 2. Create Database Table (1 min)

Go to **SQL Editor** and paste:

```sql
CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  discord_username TEXT NOT NULL,
  phrase TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT true,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_submissions_timestamp ON submissions(submitted_at);
CREATE INDEX idx_submissions_valid ON submissions(is_valid);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON submissions FOR INSERT WITH CHECK (true);
```

Then click **Run**.

### 3. Configure App (1 min)

Create `.env.local` file in project root:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```### 4. Run Locally (1 min)

```bash
# Python (built-in)
python -m http.server 8000

# OR Node.js
npx http-server

# OR VS Code Live Server extension
# (Right-click index.html → Open with Live Server)
```

Open: **http://localhost:8000**

Test:
- Username: `test#0001`
- Phrase: `steel hamster casual nose raise right various cherry trick purse bag session`
- Click "Verify Phrase"
- Check "Live Submission Wall"

---

## 🚀 Deploy to Vercel (Optional)

```bash
# 1. Push to GitHub
git add .
git commit -m "12-word verifier"
git push

# 2. Go to Vercel → New Project → Import GitHub repo
# 3. Settings → Environment Variables:
#    VITE_SUPABASE_URL=...
#    VITE_SUPABASE_ANON_KEY=...
# 4. Deploy button → Done!
```

Your URL: `https://your-project.vercel.app`

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main form & live wall |
| `app.js` | All form logic, validation, real-time updates |
| `config.js` | Supabase initialization |
| `.env.local` | Your API credentials (keep secret!) |

---

## 🎯 What's Included

✅ **Frontend**
- 12 word input boxes
- Real-time validation (green ✅ / red ❌)
- Live submission wall (updates every 3 seconds)
- Dark mode
- Mobile responsive

✅ **Backend**
- Supabase PostgreSQL database
- Row-level security
- Automatic timestamps
- Accurate ranking

✅ **Features**
- Prevents duplicate submissions
- Shows "time ago" (just now, 5m ago, etc.)
- Medals for top 3: 🥇 🥈 🥉
- Discord username validation
- XSS protection

---

## 🔧 Customize

### Change the Phrase Words

Edit in `app.js`:
```javascript
const CORRECT_PHRASE = [
    'word1', 'word2', 'word3', 'word4', 'word5', 'word6',
    'word7', 'word8', 'word9', 'word10', 'word11', 'word12'
];
```

### Change Refresh Rate

In `app.js`, change interval (default 3000 = 3 seconds):
```javascript
setInterval(loadSubmissions, 5000); // 5 seconds
```

### Change Styling

Edit `styles.css` (variables at top):
```css
:root {
    --primary-color: #3b82f6;
    --success-color: #10b981;
    --error-color: #ef4444;
}
```

---

## ❓ Troubleshooting

### "Cannot read property 'createClient'" or undefined error
- Check `.env.local` exists and has correct values
- Clear cache: Ctrl+Shift+Delete (hard refresh)
- Check browser console (F12) for errors

### Submissions not appearing
- Verify table exists in Supabase dashboard
- Check RLS policies are enabled
- Try refreshing page
- Check network tab (F12) for API errors

### "Invalid Discord username"
- Format: `username` or `username#1234`
- Minimum 2 characters
- Only letters, numbers, dots, dashes, underscores

---

## 📖 Full Documentation

- **[SUPABASE-SETUP.md](SUPABASE-SETUP.md)** - Complete setup guide
- **[API-EXAMPLES.md](API-EXAMPLES.md)** - Code examples
- **[DATABASE-SCHEMA.md](DATABASE-SCHEMA.md)** - Database reference

---

## ✨ Next Steps

1. ✅ Customize the 12-word phrase
2. ✅ Change styling in `styles.css`
3. ✅ Add Discord webhook notifications (see API-EXAMPLES.md)
4. ✅ Set up admin dashboard to view stats
5. ✅ Add email notifications for winners

---

## 🎓 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Vercel Deployment Docs](https://vercel.com/docs)

---

**Questions?** See the full docs in this project folder.

**Ready?** Start with step 1 above! ⚡

# Then open: http://localhost:8000
```

#### 6. Deploy (Optional)
Choose ONE:

**Firebase Hosting (Easiest):**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Netlify (No CLI needed):**
1. Go to netlify.com
2. Drag folder to deploy
3. Done!

**GitHub Pages:**
1. Push to GitHub repo
2. Enable Pages in Settings
3. Done!

---

## Testing the Application

### Test with Correct Phrase
```
Word 1: steel
Word 2: hamster
Word 3: casual
Word 4: nose
Word 5: raise
Word 6: right
Word 7: various
Word 8: cherry
Word 9: trick
Word 10: purse
Word 11: bag
Word 12: session
Discord: testuser#1234
```

### Features to Test
- ✅ Correct words show green check
- ❌ Wrong words show red X
- Validation happens as you type
- Dark mode toggle (🌙 button)
- Submission appears in ledger immediately
- Ledger auto-updates every 5 seconds

---

## Common Issues & Fixes

### "Firebase is not defined"
- Fix: Check that config.js is included before app.js in index.html
- Verify: Browser console shows no errors (F12)

### Submissions not saving
- Fix: Check database rules allow write access
- Verify: Go to Firebase Console → Database → Rules
- Should have: `".write": true` for test, or authentication for production

### Page looks broken
- Fix: Check all file extensions are correct (.html, .css, .js)
- Verify: index.html, styles.css, app.js, config.js all in same folder

### Dark mode doesn't persist
- Fix: Enable localStorage (not private/incognito mode)
- Verify: Try normal browsing mode

---

## Production Checklist

Before going live:

- [ ] Update Firebase security rules (see README.md)
- [ ] Test form validation thoroughly
- [ ] Test on mobile devices
- [ ] Verify all 12 words validate correctly
- [ ] Test discord username validation
- [ ] Check darkmode works
- [ ] Verify submissions appear in real-time
- [ ] Test on different browsers
- [ ] Set up error monitoring
- [ ] Document your Firebase config location (keep it secret!)

---

## Need Help?

1. **Setup Issues**: Follow step-by-step in "Fastest Way" above
2. **Code Issues**: Check browser console (F12 → Console)
3. **Firebase Issues**: Check Firebase Console for logs
4. **Deployment Issues**: See README.md deployment options

Still stuck? Check the README.md troubleshooting section.
