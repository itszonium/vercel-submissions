# API & Database Query Examples

Complete examples for common operations with the word submission system.

## Table of Contents
1. [Frontend JavaScript API](#frontend-javascript-api)
2. [SQL Queries](#sql-queries)
3. [Advanced Use Cases](#advanced-use-cases)

---

## Frontend JavaScript API

### Initialize Supabase

```javascript
// The app.js automatically initializes Supabase from config.js
// But here's how to do it manually:

const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Submit a Phrase

```javascript
async function submitPhrase(discordUsername, phraseWords) {
    const supabase = window.supabaseClient;
    
    const submission = {
        discord_username: discordUsername,
        phrase: phraseWords.join(' ').toLowerCase(),
        is_valid: true,
        submitted_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
        .from('submissions')
        .insert([submission])
        .select();
    
    if (error) {
        console.error('Submission failed:', error.message);
        return null;
    }
    
    console.log('✅ Submission successful:', data[0]);
    return data[0];
}

// Usage example:
const words = ['steel', 'hamster', 'casual', 'nose', 'raise', 'right', 
               'various', 'cherry', 'trick', 'purse', 'bag', 'session'];
await submitPhrase('alice#1234', words);
```

### Get All Valid Submissions (Ranked)

```javascript
async function getSubmissionRanking() {
    const supabase = window.supabaseClient;
    
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('is_valid', true)
        .order('submitted_at', { ascending: true });
    
    if (error) throw error;
    
    // Convert to ranking format
    return data.map((submission, index) => ({
        rank: index + 1,
        medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`,
        username: submission.discord_username,
        submittedAt: submission.submitted_at,
        timeAgo: formatTimeAgo(new Date(submission.submitted_at))
    }));
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Usage:
const rankings = await getSubmissionRanking();
rankings.forEach(sub => {
    console.log(`${sub.medal} ${sub.username} - ${sub.timeAgo}`);
});
```

### Get First Submitter (Winner)

```javascript
async function getWinner() {
    const supabase = window.supabaseClient;
    
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('is_valid', true)
        .order('submitted_at', { ascending: true })
        .limit(1);
    
    if (error) throw error;
    if (!data || data.length === 0) return null;
    
    const winner = data[0];
    return {
        rank: '🥇 #1 Champion',
        username: winner.discord_username,
        submittedAt: winner.submitted_at,
        elapsedTime: getElapsedTime(winner.submitted_at)
    };
}

function getElapsedTime(isoDate) {
    const date = new Date(isoDate);
    const formatted = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return formatted;
}

// Usage:
const winner = await getWinner();
if (winner) {
    console.log(`🎉 ${winner.username} won! Submitted at ${winner.submittedAt}`);
}
```

### Count Submissions

```javascript
async function countSubmissions() {
    const supabase = window.supabaseClient;
    
    const { data, error, count } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('is_valid', true);
    
    return error ? 0 : count;
}

// Usage:
const total = await countSubmissions();
console.log(`Total valid submissions: ${total}`);
```

### Get User's Submissions

```javascript
async function getUserSubmissions(discordUsername) {
    const supabase = window.supabaseClient;
    
    const { data, error } = await supabase
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
mySubmissions.forEach((submission, index) => {
    console.log(`  Submission #${index + 1}: ${submission.submitted_at}`);
});
```

### Get Recent Submissions

```javascript
async function getRecentSubmissions(hours = 24) {
    const supabase = window.supabaseClient;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('is_valid', true)
        .gte('submitted_at', since)
        .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
}

// Usage:
const lastDay = await getRecentSubmissions(24);
console.log(`New submissions in the last 24 hours: ${lastDay.length}`);

const lastHour = await getRecentSubmissions(1);
console.log(`New submissions in the last hour: ${lastHour.length}`);
```

### Real-time Subscription

```javascript
function subscribeToSubmissions(callback) {
    const supabase = window.supabaseClient;
    
    const subscription = supabase
        .from('submissions')
        .on('*', payload => {
            console.log('New submission:', payload);
            callback(payload);
        })
        .subscribe();
    
    return subscription;
}

// Usage:
subscribeToSubmissions((payload) => {
    if (payload.eventType === 'INSERT') {
        console.log('New submission from:', payload.new.discord_username);
    }
});
```

---

## SQL Queries

Run these in Supabase **SQL Editor** for advanced operations.

### Get Rankings with Rank Numbers

```sql
SELECT 
    ROW_NUMBER() OVER (ORDER BY submitted_at) as rank,
    discord_username,
    submitted_at,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY submitted_at) = 1 THEN '🥇'
        WHEN ROW_NUMBER() OVER (ORDER BY submitted_at) = 2 THEN '🥈'
        WHEN ROW_NUMBER() OVER (ORDER BY submitted_at) = 3 THEN '🥉'
        ELSE '#' || ROW_NUMBER() OVER (ORDER BY submitted_at)
    END as medal
FROM submissions
WHERE is_valid = true
ORDER BY submitted_at ASC;
```

### Find Who Submitted First

```sql
SELECT 
    discord_username,
    submitted_at
FROM submissions
WHERE is_valid = true
ORDER BY submitted_at ASC
LIMIT 1;
```

### Count Submissions by User

```sql
SELECT 
    discord_username,
    COUNT(*) as submission_count,
    MIN(submitted_at) as first_submission,
    MAX(submitted_at) as latest_submission
FROM submissions
WHERE is_valid = true
GROUP BY discord_username
ORDER BY submission_count DESC;
```

### Get Submissions in Last 24 Hours

```sql
SELECT 
    discord_username,
    submitted_at,
    EXTRACT(EPOCH FROM (NOW() - submitted_at))/3600 as hours_ago
FROM submissions
WHERE is_valid = true
    AND submitted_at > NOW() - INTERVAL '24 hours'
ORDER BY submitted_at DESC;
```

### Get Top Submitters (Leaderboard)

```sql
SELECT 
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as leaderboard_rank,
    discord_username,
    COUNT(*) as total_submissions,
    MIN(submitted_at) as first_submission_date
FROM submissions
WHERE is_valid = true
GROUP BY discord_username
ORDER BY COUNT(*) DESC
LIMIT 10;
```

### Find Duplicate Submissions

```sql
SELECT 
    discord_username,
    COUNT(*) as submission_count
FROM submissions
WHERE is_valid = true
GROUP BY discord_username
HAVING COUNT(*) > 1
ORDER BY submission_count DESC;
```

### Get Statistics

```sql
SELECT 
    COUNT(*) as total_submissions,
    COUNT(DISTINCT discord_username) as unique_users,
    MIN(submitted_at) as first_submission,
    MAX(submitted_at) as latest_submission,
    ROUND(AVG(EXTRACT(EPOCH FROM (submitted_at - LAG(submitted_at) OVER (ORDER BY submitted_at))))/60)::integer as avg_minutes_between
FROM submissions
WHERE is_valid = true;
```

---

## Advanced Use Cases

### 1. Dashboard Data

```javascript
async function getDashboardData() {
    const supabase = window.supabaseClient;
    
    // Get statistics
    const { count: totalSubmissions } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('is_valid', true);
    
    // Get winner
    const { data: winnerData } = await supabase
        .from('submissions')
        .select('*')
        .eq('is_valid', true)
        .order('submitted_at', { ascending: true })
        .limit(1);
    
    // Get unique users
    const { data: allData } = await supabase
        .from('submissions')
        .select('discord_username')
        .eq('is_valid', true);
    
    const uniqueUsers = new Set(allData.map(s => s.discord_username)).size;
    
    return {
        totalSubmissions,
        uniqueUsers,
        winner: winnerData[0]?.discord_username || 'No winner yet',
        winningTime: winnerData[0]?.submitted_at || null
    };
}

// Usage:
const dashboard = await getDashboardData();
console.log(`
Dashboard Stats:
- Total Submissions: ${dashboard.totalSubmissions}
- Unique Users: ${dashboard.uniqueUsers}
- Winner: ${dashboard.winner}
- Time: ${dashboard.winningTime}
`);
```

### 2. Export to CSV

```javascript
async function exportToCSV() {
    const supabase = window.supabaseClient;
    
    const { data } = await supabase
        .from('submissions')
        .select('*')
        .eq('is_valid', true)
        .order('submitted_at', { ascending: true });
    
    // Create CSV header
    const headers = ['Rank', 'Discord Username', 'Phrase', 'Submitted At'];
    const rows = data.map((sub, i) => [
        i + 1,
        sub.discord_username,
        sub.phrase,
        sub.submitted_at
    ]);
    
    // Convert to CSV
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// Usage:
exportToCSV();
```

### 3. Webhook Notification

```javascript
async function notifyWinner(discordWebhookUrl) {
    const winner = await getWinner();
    
    const message = {
        content: `🎉 **New Winner!**\n${winner.username} submitted the phrase!`,
        embeds: [{
            title: `🥇 #1 - ${winner.username}`,
            description: `Submitted at ${winner.submittedAt}`,
            color: 0xFFD700
        }]
    };
    
    await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    });
}

// Usage (with Discord webhook URL):
// await notifyWinner('https://discordapp.com/api/webhooks/...');
```

---

**Need more examples?** Check the main app.js file for additional reference implementations.
