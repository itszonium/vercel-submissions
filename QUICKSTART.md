# Quick Start Guide

## Fastest Way to Get Running (5 minutes)

### Prerequisites
- Any modern web browser
- Firebase account (free tier)

### Steps

#### 1. Create Firebase Project (2 min)
```
1. Visit https://console.firebase.google.com/
2. Click "Add Project"
3. Name: "word-verifier"
4. Click "Create Project"
5. Wait for initialization
```

#### 2. Setup Realtime Database (1 min)
```
1. Click "Realtime Database" in left menu
2. Click "Create Database"
3. Choose region closest to you
4. Start in "Test Mode"
5. Click "Enable"
```

#### 3. Get Firebase Config (1 min)
```
1. Click Project Settings (⚙️ icon, top right)
2. Scroll to "Your apps"
3. Click Web icon (</>)
4. Copy the entire firebaseConfig object
```

#### 4. Update config.js (1 min)
```
1. Open config.js in text editor
2. Replace YOUR_API_KEY, etc with values from step 3
3. Save file
```

#### 5. Test Locally (Optional)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

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
