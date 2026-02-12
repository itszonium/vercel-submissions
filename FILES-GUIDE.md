# Project Files Guide

**What each file does and when you need to edit it.**

---

## 🎯 Start Here

| File | Purpose | When to use |
|------|---------|-----------|
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minute setup guide | First time setup |
| **[PRODUCTION-README.md](PRODUCTION-README.md)** | System overview & architecture | Understanding how it works |
| **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** | Pre-launch verification | Before going live |

---

## 📚 Documentation Files

### [SUPABASE-SETUP.md](SUPABASE-SETUP.md)
**Complete detailed setup guide (40 min read)**

Includes:
- Step-by-step Supabase project creation
- Database table creation with SQL
- Local development setup
- Vercel deployment walkthrough
- Troubleshooting section
- Performance optimization tips

**Read this if:**
- First time setting up Supabase
- Deploying to Vercel
- Getting database errors
- Need detailed explanations

### [API-EXAMPLES.md](API-EXAMPLES.md)
**Code examples for common operations**

Includes:
- JavaScript function examples
- SQL query examples
- Real-time subscription code
- Data export to CSV
- Dashboard integration examples
- Webhook notification code

**Read this if:**
- Need to add a feature
- Want to query the database
- Need SQL examples
- Integrating with Discord/email

### [DATABASE-SCHEMA.md](DATABASE-SCHEMA.md)
**Complete database structure reference**

Includes:
- Table definitions
- Column descriptions
- Index explanations
- Row-level security policies
- Query patterns
- Performance benchmarks
- Backup & restore procedures

**Read this if:**
- Need database details
- Designing extensions
- Optimizing queries
- Understanding RLS

---

## 💻 Code Files

### [index.html](index.html)
**Main webpage (the user interface)**

Contains:
- 12 word input form
- Discord username field
- Form validation message area
- Live submission wall container
- Links to CSS and JavaScript files

**Edit to:**
- Change page title
- Adjust form layout
- Add custom sections
- Modify HTML structure

**Don't change:**
- Element IDs (referenced in JS)
- Script src attributes
- Form structure (app.js expects it)

---

### [app.js](app.js)
**Main application logic (most important file!)**

Contains:
- Form validation functions
- Word input creation (12 boxes)
- Real-time validation (✅/❌)
- Supabase submission handling
- Live submission wall rendering
- Dark mode toggle
- Real-time update loop (every 3 seconds)

**Edit to:**
- Change `CORRECT_PHRASE` array ← **Most common!**
- Adjust refresh rate (default 3 seconds)
- Add custom validation
- Modify submission behavior
- Send webhooks/notifications
- Change ranking logic

**Don't break:**
- `getSupabase()` function
- Event listeners
- Database column names (`discord_username`, `submitted_at`)
- DOM element IDs

**Key sections:**
```javascript
const CORRECT_PHRASE = [...];  // ← Edit this!
setInterval(loadSubmissions, 3000);  // ← Change update interval
async function handleSubmit() { ... }  // ← Submit logic
async function loadSubmissions() { ... }  // ← Display logic
```

---

### [config.js](config.js)
**Supabase initialization (configure for your project)**

Contains:
- Supabase URL configuration
- Supabase API key initialization
- Client library setup

**Edit to:**
- Add your Supabase URL
- Add your Supabase Anon Key
- Change initialization logic

**Better approach:**
- Use `.env.local` file instead
- Never hardcode credentials in code

---

### [styles.css](styles.css)
**Visual styling (colors, layout, animation)**

Contains:
- CSS variables (colors, spacing)
- Form styling
- Input validation states
- Dark mode styles
- Responsive layout
- Animations

**Edit to:**
- Change colors
- Adjust button sizes
- Modify spacing
- Update fonts
- Add animations
- Fix responsive layout

**CSS Variables at top:**
```css
:root {
    --primary-color: #3b82f6;     /* Blue */
    --success-color: #10b981;     /* Green ✅ */
    --error-color: #ef4444;       /* Red ❌ */
}
```

---

## ⚙️ Configuration Files

### [.env.local.example](.env.local.example)
**Environment variables template**

Contains:
- Example Supabase URL
- Example Supabase key
- Instructions for each value

**Use this to:**
1. Copy file: `cp .env.local.example .env.local`
2. Fill in your actual Supabase values
3. Save in project root
4. Add to `.gitignore` (don't commit!)

**For Vercel:**
- Add same values to Vercel Settings → Environment Variables
- Don't need `.env.local` file on Vercel

---

### [vercel.json](vercel.json)
**Vercel deployment configuration**

Contains:
- Build command (empty for static)
- Output directory (current directory)
- Environment variable descriptions

**Do NOT edit** unless you understand Vercel config.

---

### [.gitignore](.gitignore)
**Git ignore patterns (what to keep secret)**

Contains:
- `.env.local` - Your API keys
- `node_modules/` - Dependencies
- `.DS_Store`, etc. - OS files

**Edit to:**
- Add more files to ignore
- Never commit credentials

---

## 📖 Other Documentation

### [README.md](README.md)
**Original project description**

### [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md)
**Original setup steps**

### [firebase.json](firebase.json)
**Firebase config (from old system, can delete)**

### [DATABASE-RULES.js](DATABASE-RULES.js)
**Firebase rules (from old system, can delete)**

---

## 🗂️ File Structure Summary

```
Submit your words/
│
├─ 📄 QUICKSTART.md           ⭐ Start here!
├─ 📄 PRODUCTION-README.md    System overview
├─ 📄 SUPABASE-SETUP.md       Complete guide (40 min)
├─ 📄 API-EXAMPLES.md         Code examples
├─ 📄 DATABASE-SCHEMA.md      Database reference
├─ 📄 DEPLOYMENT-CHECKLIST.md Pre-launch checklist
│
├─ 🌐 index.html              Main webpage
├─ ⚙️  app.js                 Main logic (EDIT PHRASE HERE!)
├─ 🔧 config.js              Supabase init
├─ 🎨 styles.css             Styling & colors
│
├─ 📋 .env.local.example      Env template (copy to .env.local)
├─ 🚀 vercel.json            Vercel config
├─ 🚫 .gitignore             Secret files list
│
├─ 📋 package.json           Project metadata
├─ 📄 README.md              Original docs
└─ 📄 SETUP-CHECKLIST.md     Original checklist
```

---

## 🔄 File Edit Workflow

### To Change the Phrase Words
1. Open `app.js`
2. Find `const CORRECT_PHRASE = [...]`
3. Replace with your 12 words (lowercase, space-separated)
4. Save file
5. Refresh browser to test

### To Customize Colors
1. Open `styles.css`
2. Find `:root { ... }` section at top
3. Change color values:
   - `--primary-color`: Button color
   - `--success-color`: Green ✅
   - `--error-color`: Red ❌
4. Save file
5. Hard refresh browser (Ctrl+Shift+R)

### To Set Up Supabase
1. Read [SUPABASE-SETUP.md](SUPABASE-SETUP.md)
2. Create project at app.supabase.com
3. Create table (SQL in documentation)
4. Copy URL & key from Settings → API
5. Create `.env.local` file
6. Paste URL and key
7. Restart local server

### To Deploy to Vercel
1. Read [SUPABASE-SETUP.md](SUPABASE-SETUP.md) Vercel section
2. Push code to GitHub
3. Import repo to Vercel
4. Add environment variables
5. Deploy button - done!

---

## 🆘 Quick Troubleshooting by File

### `index.html` issues?
- Element missing? Check if ID matches in `app.js`
- Page looks broken? Check `styles.css` syntax
- Scripts not loading? Verify `src=` paths

### `app.js` issues?
- Submissions not saving? Check Supabase connection
- Phrase validation wrong? Edit `CORRECT_PHRASE` array
- Real-time not updating? Check `setInterval` value
- Console errors? Open DevTools (F12) to debug

### `config.js` issues?
- "Cannot read property 'createClient'"? `env.local` values wrong
- Gets stuck on "Initializing"? Check Supabase project is active
- Network errors? Check CORS settings in Supabase

### `styles.css` issues?
- Colors not changing? Hard refresh (Ctrl+Shift+R)
- Layout broken? Check CSS syntax and bracket matching
- Dark mode not working? Check dark-mode class toggle

### `.env.local` issues?
- File not found? Create it in project root
- Variables not loading? Restart local server
- Vercel: Add to Settings → Environment Variables

---

## 📝 File Editing Tips

**Before editing:**
- Make a backup: `cp file.js file.js.bak`
- Read the current file first
- Understand what you're changing

**After editing:**
- Save file
- If JavaScript: Refresh browser
- If CSS: Hard refresh (Ctrl+Shift+R)
- Check browser console for errors (F12)
- Test the change

**Common mistakes:**
- Forgetting to save file
- Not refreshing browser after changes
- Breaking JavaScript syntax (missing comma, bracket)
- Committing secrets to GitHub

---

## 🎓 Learning Order

**If you're new to this project:**

1. Read [QUICKSTART.md](QUICKSTART.md) (5 min)
2. Get it running locally
3. Read [PRODUCTION-README.md](PRODUCTION-README.md) (10 min)
4. Look at these files:
   - `index.html`
   - `app.js` (the CORRECT_PHRASE part)
   - `styles.css` (the :root variables)
5. Customize colors and phrase
6. Read [SUPABASE-SETUP.md](SUPABASE-SETUP.md) (40 min)
7. Deploy to Vercel
8. Celebrate! 🎉

---

## 🔗 File Dependencies

```
index.html
├── Loads: styles.css
├── Loads: config.js
│    └── Initializes: Supabase client
└── Loads: app.js
     ├── Uses: getSupabase() from config.js
     ├── Queries: Database via Supabase
     └── Manipulates: DOM from index.html
```

**Impact analysis:**
- Delete `index.html` → Page won't show
- Delete `app.js` → Page shows but nothing works
- Delete `config.js` → Database connection fails
- Delete `styles.css` → Page looks ugly
- Delete `.env.local` → Dev server fails

---

## ✨ File Modification Frequency

| File | How Often | Difficulty |
|------|-----------|-----------|
| `app.js` (PHRASE) | Once | Easy |
| `styles.css` | Once | Easy |
| `.env.local` | Once | Easy |
| `config.js` | Never | Expert |
| `index.html` | Rarely | Medium |
| `vercel.json` | Never | Expert |

---

**Need more info?** Check the specific documentation file at the top of this guide.
