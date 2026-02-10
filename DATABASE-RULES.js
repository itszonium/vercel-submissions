// Firebase Realtime Database Rules
// Copy these rules into your Firebase Console → Database → Rules tab

// ============================================
// DEVELOPMENT RULES (Test Mode)
// Use these while developing/testing
// ============================================
{
  "rules": {
    "submissions": {
      ".read": true,          // Anyone can read submissions
      ".write": true,         // Anyone can write submissions
      ".indexOn": ["timestamp"],  // Optimize queries by timestamp
      "$id": {
        "discord": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 50"
        },
        "phrase": {
          ".validate": "newData.isString() && newData.val().length == 71" // 12 words separated by spaces
        },
        "timestamp": {
          ".validate": "newData.isString() && newData.val().matches(/\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/)"
        },
        "verified": {
          ".validate": "newData.val() === true"
        },
        ".validate": "newData.hasChildren(['discord', 'phrase', 'timestamp', 'verified'])"
      }
    }
  }
}

// ============================================
// PRODUCTION RULES v1 (Authenticated Users)
// Use this if you add user authentication
// ============================================
{
  "rules": {
    "submissions": {
      ".read": true,          // Anyone can read
      ".write": "auth.uid != null",  // Only authenticated users can write
      ".indexOn": ["timestamp"],    // Optimize queries
      "$id": {
        "discord": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 50"
        },
        "phrase": {
          ".validate": "newData.isString() && newData.val().length == 71"
        },
        "timestamp": {
          ".validate": "newData.isString()"
        },
        "verified": {
          ".validate": "newData.val() === true"
        },
        ".validate": "newData.hasChildren(['discord', 'phrase', 'timestamp', 'verified'])"
      }
    }
  }
}

// ============================================
// PRODUCTION RULES v2 (Rate Limited - with Cloud Functions)
// Use if you implement rate limiting backend
// ============================================
{
  "rules": {
    "submissions": {
      ".read": true,
      ".write": "root.child('rateLimit').child(auth.uid).val() < 5",
      ".indexOn": ["timestamp"],
      "$id": {
        "discord": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 50"
        },
        "phrase": {
          ".validate": "newData.isString() && newData.val().length == 71"
        },
        "timestamp": {
          ".validate": "newData.isString()"
        },
        "verified": {
          ".validate": "newData.val() === true"
        },
        ".validate": "newData.hasChildren(['discord', 'phrase', 'timestamp', 'verified'])"
      }
    },
    "rateLimit": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}

// ============================================
// STRICT RULES (Admin Only)
// Use if you want complete control
// ============================================
{
  "rules": {
    "submissions": {
      ".read": true,
      ".write": false,  // Disable writes completely
      ".indexOn": ["timestamp"]
    },
    "settings": {
      ".read": "auth.uid === 'your-admin-uid'",
      ".write": "auth.uid === 'your-admin-uid'"
    }
  }
}

// ============================================
// How to apply these rules:
// ============================================
// 1. Go to Firebase Console
// 2. Click "Realtime Database"
// 3. Click the "Rules" tab at the top
// 4. Replace the entire content with one of the rule sets above
// 5. Click "Publish"
// 6. Confirm the warning

// ============================================
// Rule Validation Explanation:
// ============================================
// .read: Can this user READ this data?
// .write: Can this user WRITE this data?
// .validate: Is the data in the correct format?
// .indexOn: Which fields should be indexed for faster queries?

// true  = Allow
// false = Deny
// "auth.uid != null" = Allow if user is logged in

// ============================================
// Recommended Setup Steps:
// ============================================
// 1. START: Use Development Rules (test mode)
// 2. TESTING: Test all functionality
// 3. BEFORE LAUNCH: Choose Production v1 or v2
// 4. BEFORE LAUNCH: Test all functionality again
// 5. LAUNCH: Update to Production rules
// 6. MONITOR: Watch Firebase usage in Console

// ============================================
// If you get "Permission denied" errors:
// ============================================
// 1. Check browser console (F12)
// 2. Check your current rules allow the operation
// 3. Make sure .read and .write are set correctly
// 4. Verify timestamp format matches validation rule
// 5. Check that Discord username is 1-50 characters
// 6. Check that phrase is exactly 12 words

// ============================================
// For Cloud Functions Rate Limiting:
// ============================================
// If you implement backend validation with Cloud Functions:
// 1. Create Cloud Function: functions/index.js
// 2. Function validates: phrase, discord username, rate limiting
// 3. Function writes to database if valid
// 4. Use strict rules on database side
// 5. See README.md for Cloud Functions setup

// ============================================
// Security Considerations:
// ============================================
// - Never expose SECRET keys in client code
// - Use ENVIRONMENT VARIABLES for sensitive data
// - Always validate on the server (Cloud Functions)
// - Implement rate limiting to prevent spam
// - Use HTTPS only (automatic on Firebase)
// - Keep database rules as restrictive as possible
// - Monitor usage in Firebase Console
// - Set up billing alerts
// - Review access logs regularly
