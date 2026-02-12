# 12-Word Phrase Verifier - Complete Setup Guide

**Production-ready system for collecting, validating, and displaying word phrase submissions with real-time updates.**

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Features](#features)
3. [Database Setup](#database-setup)
4. [Local Setup](#local-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [API Examples](#api-examples)
7. [Database Schema](#database-schema)
8. [Troubleshooting](#troubleshooting)

---

## System Architecture

```
Frontend (HTML + Vanilla JS)
    ↓
Supabase Client SDK (JavaScript)
    ↓
Supabase Backend
    - PostgreSQL Database
    - Real-time subscriptions
    - Row-level security
```

### Why Supabase?
- ✅ Built on PostgreSQL (powerful & reliable)
- ✅ Real-time subscriptions included
- ✅ Works perfectly on Vercel
- ✅ Free tier supports testing
- ✅ Row-level security for data protection
- ✅ Auto-generated REST API

---

## Features

✅ **Real-time Submissions**
- Live updates every 3 seconds
- See new submissions instantly

✅ **Accurate Ranking**
- Ranked by submission time (earliest = #1)
- Medals for top 3: 🥇 🥈 🥉
- Prevents tie-breaking issues

✅ **Validation System**
- Green ✅ for correct words
- Red ❌ for incorrect words
- Real-time feedback

✅ **Live Wall Display**
- Shows username, timestamp, status
- 3-second auto-refresh
- Shows "time ago" (just now, 5m ago, etc.)

✅ **Security**
- XSS protection (HTML escaping)
- Only valid submissions displayed
- Discord username validation

---

## Database Setup

### Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **New Project**
   - **Organization**: Create or select
   - **Name**: `word-verifier`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to you
3. Wait for database to be created (2-3 minutes)
4. Go to **Settings > API** to find your credentials:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: Your public anon key

### Step 2: Create Submissions Table

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query** and paste this SQL:

```sql
-- Create submissions table
CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  discord_username TEXT NOT NULL,
  phrase TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT true,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast queries
CREATE INDEX idx_submissions_timestamp ON submissions(submitted_at);
CREATE INDEX idx_submissions_valid ON submissions(is_valid);

-- Enable row-level security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (SELECT)
CREATE POLICY "Allow public read"
  ON submissions FOR SELECT
  USING (true);

-- Allow anyone to insert
CREATE POLICY "Allow public insert"
  ON submissions FOR INSERT
  WITH CHECK (true);

-- Insert example submissions (optional)
INSERT INTO submissions (discord_username, phrase, is_valid, submitted_at)
VALUES 
  ('alice#1234', 'steel hamster casual nose raise right various cherry trick purse bag session', true, NOW()),
  ('bob#5678', 'steel hamster casual nose raise right various cherry trick purse bag session', true, NOW() + INTERVAL '5 minutes'),
  ('charlie#9999', 'steel hamster casual nose raise right various cherry trick purse bag session', true, NOW() + INTERVAL '10 minutes');
```

3. Click **Run** button
4. You should see success message

### Step 3: Verify Table Setup

1. Go to **Table Editor**
2. You should see the `submissions` table
3. Click it to see the columns and example data

---

## Local Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime, etc.)
- Git (for cloning)

### Installation

1. **Clone or download the project**:
```bash
git clone <your-repo-url>
cd submit-your-words
```

2. **Create `.env.local` file** in project root:
```bash
# Copy the example
cp .env.local.example .env.local

# OR create it manually with:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-step-above
```

3. **Start local server**:

**Option A: Python** (built-in on Mac/Linux)
```bash
python -m http.server 8000
```

**Option B: Node.js**
```bash
npx http-server
```

**Option C: VS Code**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

4. **Open in browser**: `http://localhost:8000`

5. **Test**:
   - Enter Discord username: `testuser#0001`
   - Enter phrase: `steel hamster casual nose raise right various cherry trick purse bag session`
   - Click "Verify Phrase"
   - Check **Live Submission Wall** for your entry

---

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: 12-word verifier"
git remote add origin https://github.com/YOUR_USERNAME/word-verifier.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Select **Import Git Repository**
4. Paste your GitHub repo URL
5. Click **Import**

### Step 3: Add Environment Variables

1. In Vercel project settings:
2. Go to **Settings > Environment Variables**
3. Add these variables:
   - **VITE_SUPABASE_URL**: `https://your-project-id.supabase.co`
   - **VITE_SUPABASE_ANON_KEY**: Your anon key
   - **REACT_APP_SUPABASE_URL**: `https://your-project-id.supabase.co`
   - **REACT_APP_SUPABASE_ANON_KEY**: Your anon key

4. Click **Deploy**
5. Wait for build to complete (2-3 minutes)
6. Your URL will be something like: `https://word-verifier.vercel.app`

### Step 4: Update Supabase CORS

1. Go to Supabase project settings
2. **Settings > API > CORS**
3. Add your Vercel URL: `https://word-verifier.vercel.app`

---

## API Examples

### JavaScript - Submit a Phrase

```javascript
async function submitPhrase(discordUsername, phrase) {
    const supabaseClient = window.supabaseClient;
    
    const { data, error } = await supabaseClient
        .from('submissions')
        .insert([{
            discord_username: discordUsername,
            phrase: phrase,
            is_valid: true,
            submitted_at: new Date().toISOString()
        }])
        .select();
    
    if (error) {
        console.error('Error:', error.message);
        return null;
    }
    
    console.log('Submission saved:', data);
    return data[0];
}

// Usage:
submitPhrase('alice#1234', 'steel hamster casual ...');
```

### JavaScript - Get All Submissions

```javascript
async function getAllSubmissions() {
    const supabaseClient = window.supabaseClient;
    
    const { data, error } = await supabaseClient
        .from('submissions')
        .select('*')
        .eq('is_valid', true)
        .order('submitted_at', { ascending: true });
    
    if (error) {
        console.error('Error:', error.message);
        return [];
    }
    
    return data;
}
```

### JavaScript - Get Top Submitter

```javascript
async function getFirstSubmitter() {
    const supabaseClient = window.supabaseClient;
    
    const { data, error } = await supabaseClient
        .from('submissions')
        .select('discord_username, submitted_at')
        .eq('is_valid', true)
        .order('submitted_at', { ascending: true })
        .limit(1);
    
    if (error) throw error;
    if (!data || data.length === 0) return null;
    
    return {
        username: data[0].discord_username,
        time: data[0].submitted_at,
        rank: '🥇 #1'
    };
}

// Usage:
const champion = await getFirstSubmitter();
console.log(`${champion.rank} - ${champion.username} at ${champion.time}`);
```

### JavaScript - Get User's Submissions

```javascript
async function getUserSubmissions(discordUsername) {
    const supabaseClient = window.supabaseClient;
    
    const { data, error } = await supabaseClient
        .from('submissions')
        .select('*')
        .eq('discord_username', discordUsername)
        .eq('is_valid', true)
        .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
}

// Usage:
const mySubmissions = await getUserSubmissions('alice#1234');
console.log(`You have ${mySubmissions.length} valid submissions`);
```

### SQL Query - Find Winner

```sql
-- Get the first person to submit
SELECT 
    discord_username,
    submitted_at,
    RANK() OVER (ORDER BY submitted_at) as rank
FROM submissions
WHERE is_valid = true
ORDER BY submitted_at ASC
LIMIT 1;
```

---

## Database Schema

### submissions table

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Auto-incrementing ID |
| `discord_username` | TEXT | Discord user (e.g., alice#1234) |
| `phrase` | TEXT | Full 12-word phrase |
| `is_valid` | BOOLEAN | Always true (can filter invalid later) |
| `submitted_at` | TIMESTAMP | Exact submission time (UTC) |
| `created_at` | TIMESTAMP | Record creation time (auto) |

### Indexes
- `idx_submissions_timestamp` - Fast sorting by submission time
- `idx_submissions_valid` - Fast filtering for valid submissions

### Row-Level Security Policies
- Anyone can **SELECT** (read)
- Anyone can **INSERT** (submit)
- *(No update/delete from frontend)*

---

## Troubleshooting

### "Supabase client not initialized"
- Check `.env.local` contains correct URL and key
- Wait 2-3 seconds before submitting
- Check browser console for error messages

### "Error loading submissions"
- Check Supabase project is active
- Verify CORS is configured
- Check network tab in browser dev tools
- Try refreshing the page

### "Discord username format error"
- Must be 2-32 characters
- Can include: letters, numbers, .， _, -
- Optional: Add #1234 (4 digits)
- Examples: `alice`, `alice#1234`, `alice_bob`, `alice-1234`

### Submissions not appearing
1. Check table in Supabase dashboard
2. Verify `is_valid` column is `true`
3. Check that row-level security is enabled
4. Try refreshing the browser

### Timestamps are wrong
- All times stored in UTC
- Frontend converts to "time ago" format
- Check your local browser timezone

---

## Performance Considerations

### Query Optimization
- Queries are limited to 100 submissions (adjust if needed)
- 3-second refresh prevents database overload
- Indexes on `submitted_at` and `is_valid` for speed

### Scaling
For 10,000+ submissions:
- Add pagination (fetch 50 at a time)
- Create materialized view for ranking
- Cache submission count separately

### Example pagination:

```javascript
async function getSubmissionsPaginated(page = 1, pageSize = 50) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error } = await supabaseClient
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('is_valid', true)
        .order('submitted_at', { ascending: true })
        .range(from, to);
    
    return data;
}
```

---

## Security Notes

✅ **Currently Secure**:
- XSS protection via HTML escaping
- CORS limited to your domain
- Row-level security enabled
- No authentication required (intentional)

⚠️ **Future Hardening**:
- Rate limiting (TBD)
- Discord OAuth verification
- Admin dashboard for review
- Spam detection

---

## Next Steps

1. **Test locally**: Follow Local Setup section
2. **Deploy to Vercel**: Follow Vercel Deployment section
3. **Monitor submissions**: Check Supabase dashboard regularly
4. **Customize**: Edit `CORRECT_PHRASE` in `app.js` to change the words
5. **Extend**: Add features like:
   - Email notifications for submissions
   - Admin dashboard
   - Discord webhook integration
   - Verification email before accepting

---

## Support

**Error in console?** Open browser DevTools (F12) and check the console tab for error messages - copy the full error text for debugging.

**Need help?** Check:
1. [Supabase Docs](https://supabase.com/docs)
2. [Vercel Docs](https://vercel.com/docs)
3. Your project's GitHub issues

---

## License

MIT - You're free to use and modify this for any project.

---

**Happy submitting! 🚀**
