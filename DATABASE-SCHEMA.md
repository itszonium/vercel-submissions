# Database Schema Documentation

Complete reference for the word submission system database structure.

---

## Overview

The system uses a single PostgreSQL table (via Supabase) to store all submissions. This simple but powerful design allows for:
- ✅ Easy querying and filtering
- ✅ Accurate ranking by timestamp
- ✅ Row-level security
- ✅ Automatic indexing for performance

---

## Submissions Table

### Definition

```sql
CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  discord_username TEXT NOT NULL,
  phrase TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT true,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | BIGSERIAL | NO | auto | Unique auto-incrementing ID for each submission |
| `discord_username` | TEXT | NO | — | Discord username (e.g., 'alice#1234') |
| `phrase` | TEXT | NO | — | Complete 12-word phrase (space-separated, lowercase) |
| `is_valid` | BOOLEAN | NO | true | Whether phrase is correctly validated |
| `submitted_at` | TIMESTAMP | NO | NOW() | Exact UTC timestamp of submission (for ranking) |
| `created_at` | TIMESTAMP | NO | NOW() | Database record creation time (redundant, for audit trail) |

### Example Row

```json
{
  "id": 42,
  "discord_username": "alice#1234",
  "phrase": "steel hamster casual nose raise right various cherry trick purse bag session",
  "is_valid": true,
  "submitted_at": "2024-02-12T15:30:45.123Z",
  "created_at": "2024-02-12T15:30:45.456Z"
}
```

---

## Indexes

Indexes are created to optimize query performance:

```sql
-- Fast sorting/filtering by submission time (used in rankings)
CREATE INDEX idx_submissions_timestamp ON submissions(submitted_at);

-- Fast filtering for valid submissions (used in all queries)
CREATE INDEX idx_submissions_valid ON submissions(is_valid);
```

### When Indexes Are Used

| Query Type | Index Used | Why |
|-----------|-----------|-----|
| `ORDER BY submitted_at` | `idx_submissions_timestamp` | Ranking users |
| `WHERE is_valid = true` | `idx_submissions_valid` | Show only valid submissions |
| Both combined | Both | Ranking valid submissions |

**Result**: Queries return instantly even with 100,000+ submissions.

---

## Row-Level Security (RLS)

Security policies control who can see and write data:

### READ Policy: `Allow public read`
```sql
CREATE POLICY "Allow public read"
  ON submissions FOR SELECT
  USING (true);
```
✅ **Effect**: Anyone can read all submissions

### INSERT Policy: `Allow public insert`
```sql
CREATE POLICY "Allow public insert"
  ON submissions FOR INSERT
  WITH CHECK (true);
```
✅ **Effect**: Anyone can submit new phrases

### Implications
- Frontend users cannot verify usernames (no auth needed)
- No login required to submit
- All submissions are visible to everyone
- Cannot edit/delete submissions (update/delete policies not created)

---

## Data Types Explained

### BIGSERIAL
- Integer from 1 to 9,223,372,036,854,775,807
- Auto-increments with each insert
- Used for `id` to ensure unique identifiers

### TEXT
- Unlimited length string
- Used for `discord_username` and `phrase`
- Supports Unicode (emoji, special characters)

### BOOLEAN
- true / false
- Used for `is_valid` flag
- Default: true

### TIMESTAMP WITH TIME ZONE
- Date + Time + UTC offset
- Stored as ISO 8601 format
- Current server time: `NOW()`
- Includes millisecond precision

---

## Query Patterns

### 1. Get User's Rank

```sql
WITH ranked AS (
  SELECT 
    ROW_NUMBER() OVER (ORDER BY submitted_at) as rank,
    discord_username,
    submitted_at
  FROM submissions
  WHERE is_valid = true
)
SELECT * FROM ranked 
WHERE discord_username = 'alice#1234';
```

**Result**: 
```
rank | discord_username | submitted_at
-----|------------------|------------------
   5 | alice#1234       | 2024-02-12 15:30
```

### 2. Get Submissions Within Time Window

```sql
SELECT 
  discord_username,
  submitted_at
FROM submissions
WHERE is_valid = true
  AND submitted_at BETWEEN '2024-02-12'::date AND '2024-02-13'::date
ORDER BY submitted_at;
```

### 3. Get User Statistics

```sql
SELECT 
  COUNT(*) as total_submissions,
  MIN(submitted_at) as first_submission,
  MAX(submitted_at) as latest_submission
FROM submissions
WHERE discord_username = 'alice#1234'
  AND is_valid = true;
```

### 4. Get Submission Count Per Hour

```sql
SELECT 
  DATE_TRUNC('hour', submitted_at) as hour,
  COUNT(*) as submission_count
FROM submissions
WHERE is_valid = true
GROUP BY DATE_TRUNC('hour', submitted_at)
ORDER BY hour DESC;
```

---

## Constraints & Validation

### Constraints in Schema

| Constraint | Column | Rule | Effect |
|-----------|--------|------|--------|
| PRIMARY KEY | `id` | Unique, not null | Cannot duplicate rows |
| NOT NULL | `discord_username` | Must have value | Required field |
| NOT NULL | `phrase` | Must have value | Required field |
| NOT NULL | `is_valid` | Must have value | Defaults to true |

### Frontend Validation

| Field | Format | Max Length | Example |
|-------|--------|-----------|---------|
| `discord_username` | `username` or `username#1234` | 37 | `alice#1234` |
| `phrase` | Space-separated lowercase words | Unlimited | `steel hamster ...` |

---

## Performance Characteristics

### Query Speed

| Operation | Time | Reason |
|-----------|------|--------|
| Get all submissions (1000+) | ~100ms | Full table scan |
| Get first submitter | ~1ms | Index on `submitted_at` |
| Get user's submissions | ~5ms | Index on `submitted_at` |
| Count valid submissions | ~50ms | Index on `is_valid` |

### Storage

| Metric | Value | Note |
|--------|-------|------|
| Disk per row | ~300 bytes | Username + phrase + overhead |
| 10,000 submissions | ~3 MB | Tiny footprint |
| 1,000,000 submissions | ~300 MB | Still manageable |

### Scaling Limits

Supabase free tier can handle:
- ✅ 10,000 submissions easily
- ✅ 100,000 submissions with minor optimizations
- ✅ 1,000,000+ with proper indexing

---

## Backup & Recovery

### Automatic Backups
Supabase automatically backs up your data:
- Daily backups (free tier keeps 7 days)
- Weekly snapshots for production
- Point-in-time recovery available (paid)

### Manual Backup via pg_dump

```bash
# Export data to CSV
psql postgresql://[user]:[password]@[host]/postgres -c \
  "COPY submissions TO STDOUT WITH CSV HEADER;" > submissions_backup.csv

# Export to SQL dump
pg_dump postgresql://[user]:[password]@[host]/postgres > submissions.sql
```

### Restore from CSV

```sql
COPY submissions (discord_username, phrase, is_valid, submitted_at) 
FROM '/path/to/submissions_backup.csv' 
WITH CSV HEADER;
```

---

## Schema Evolution

### Adding a New Column

```sql
-- Add column with default value
ALTER TABLE submissions
ADD COLUMN status VARCHAR(20) DEFAULT 'approved';

-- Make it not null
ALTER TABLE submissions
ALTER COLUMN status SET NOT NULL;
```

### Example: Adding Location Field

```sql
ALTER TABLE submissions
ADD COLUMN country_code CHAR(2);

CREATE INDEX idx_submissions_country ON submissions(country_code);
```

### Example: Adding Verification Field

```sql
ALTER TABLE submissions
ADD COLUMN verified_by TEXT DEFAULT NULL;

ALTER TABLE submissions
ADD COLUMN verified_at TIMESTAMP DEFAULT NULL;
```

---

## Data Export Formats

### Export as JSON (in SQL Editor)

```sql
SELECT json_agg(row_to_json(t)) FROM submissions t 
WHERE is_valid = true;
```

### Export as Newline-Delimited JSON (NDJSON)

```sql
SELECT row_to_json(t) || CHR(10) FROM submissions t 
WHERE is_valid = true;
```

### Export by Date Range

```sql
SELECT * FROM submissions 
WHERE submitted_at >= '2024-02-12'::date 
  AND submitted_at < '2024-02-13'::date
ORDER BY submitted_at DESC;
```

---

## Common Errors & Solutions

### "Invalid text representation for type timestamp"
**Cause**: Timestamp not in ISO 8601 format
**Solution**: Use `NOW()` or ISO format: `2024-02-12T15:30:00Z`

### "Violates unique constraint"
**Cause**: Exactly duplicate submission
**Solution**: This shouldn't happen; frontend prevents duplicates

### "Field is required (NOT NULL constraint)"
**Cause**: Trying to insert empty `discord_username` or `phrase`
**Solution**: Validate on frontend before submitting

### "Rate limited"
**Cause**: Too many queries too fast
**Solution**: Implement client-side rate limiting or increase refresh interval

---

## Security Considerations

### PII (Personally Identifiable Information)
- Discord usernames stored in plain text (public)
- Phrases stored in plain text (public)
- No emails, passwords, or sensitive data

### Sensitive Operations to Avoid

❌ **Never do these in production**:
```sql
-- Don't query via public API without auth verification
SELECT * FROM submissions WHERE discord_username = ?;

-- Don't allow users to update their own submissions
UPDATE submissions SET is_valid = true WHERE ...;

-- Don't delete submissions (audit trail loss)
DELETE FROM submissions WHERE ...;
```

✅ **Better approach**:
```sql
-- Only admins can verify authenticity
CREATE ROLE admin;
CREATE POLICY "Admin can verify" ON submissions
  FOR UPDATE USING (auth.uid() = admin_id);

-- Users can read their own submissions  
CREATE POLICY "Users can read their submissions" ON submissions
  FOR SELECT USING (
    auth.uid()::text = (discord_username || '#' || user_id)
  );
```

---

## Maintenance Tasks

### Weekly
1. Check row count: `SELECT COUNT(*) FROM submissions;`
2. Verify no null values: `SELECT * FROM submissions WHERE discord_username IS NULL;`
3. Check for duplicates: `SELECT discord_username, COUNT(*) FROM submissions GROUP BY discord_username HAVING COUNT(*) > 5;`

### Monthly
1. Analyze table for query optimization: `ANALYZE submissions;`
2. Export full backup to CSV
3. Review using dashboard statistics

### Quarterly
1. Check index health and rebuild if needed
2. Archive old submissions (older than 90 days) if needed
3. Update schema if any feature requests

---

## Reference: SQL Cheat Sheet

```sql
-- Show table structure
\d submissions

-- Show indexes
\di submissions*

-- Show row count
SELECT COUNT(*) FROM submissions;

-- Show table size
SELECT pg_size_pretty(pg_total_relation_size('submissions'));

-- Show sample data
SELECT * FROM submissions LIMIT 5;

-- Vacuum and optimize (admin only)
VACUUM ANALYZE submissions;

-- Show slow queries
SELECT query, calls, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
```

---

**For more help, visit**: [PostgreSQL Docs](https://www.postgresql.org/docs/) | [Supabase Docs](https://supabase.com/docs)
