# 12-Word Phrase Verifier

A responsive, real-time web application for verifying 12-word recovery phrases (like crypto wallet phrases) with live public submission tracking.

## Features

✅ **12 Word Verification**
- Input boxes for all 12 words with order validation
- Real-time visual feedback (✅ green for correct, ❌ red for wrong)
- Case-insensitive word matching with automatic trimming

✅ **Discord Username Required**
- Validates Discord username format (username#1234)
- Required for submissions

✅ **Live Submission Ledger**
- View all verified submissions in real-time
- Shows username, timestamp, and verified status
- Auto-updates every 5 seconds

✅ **Modern UI/UX**
- Fully responsive design (mobile, tablet, desktop)
- Dark mode toggle
- Smooth animations and transitions
- Accessibility-friendly

## Correct Phrase

The 12 words that need to be verified (in order):
```
steel, hamster, casual, nose, raise, right, various, cherry, trick, purse, bag, session
```

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: Firebase Realtime Database
- **Hosting**: Firebase Hosting (recommended)

## Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter a project name (e.g., "12-word-verifier")
4. Click "Create project"
5. Wait for project to initialize

### Step 2: Enable Realtime Database

1. In Firebase Console, go to **Build** → **Realtime Database**
2. Click **"Create Database"**
3. Choose your region (closest to your users)
4. Start in **Test Mode** initially:
   ```json
   {
     "rules": {
       "submissions": {
         ".read": true,
         ".write": true,
         ".validate": true
       }
     }
   }
   ```
5. Click **"Enable"**

### Step 3: Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **Your apps**, click **Web** icon
3. Copy the Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456...",
     appId: "1:123456...:web:abcdef..."
   };
   ```

### Step 4: Update config.js

Replace the placeholder values in `config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 5: Test Locally

1. Open `index.html` in your browser (or use a local server)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```
2. Navigate to `http://localhost:8000`
3. Test the form with the correct phrase

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase login
   firebase init hosting
   ```
   - Choose your project
   - Set public directory to current folder (or `.`)
   - Don't overwrite `index.html`
   - Skip automatic building

3. Deploy:
   ```bash
   firebase deploy
   ```

Your site will be available at:
```
https://your-project.web.app
```

### Option 2: GitHub Pages

1. Create a GitHub repository
2. Push all files to the repository
3. Go to **Settings** → **Pages**
4. Set source to `main` branch
5. Your site will be available at `https://username.github.io/repository-name`

### Option 3: Netlify

1. Create a [Netlify](https://netlify.com/) account
2. Drag and drop the folder to deploy
3. Or connect your GitHub repository for automatic deployments

### Option 4: Any Static Hosting

Since this is just HTML/CSS/JS, it can be deployed on:
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any traditional web hosting

## Security Considerations

### Database Rules (Production)

For production, update your Firebase Realtime Database rules to be more restrictive:

```json
{
  "rules": {
    "submissions": {
      ".read": true,
      ".write": "auth != null",
      ".validate": true,
      "$id": {
        ".validate": "newData.hasChildren(['discord', 'phrase', 'timestamp', 'verified'])"
      }
    }
  }
}
```

Or implement rate limiting using Firebase Cloud Functions.

### Additional Security

1. **Validate on the backend** (use Firebase Cloud Functions)
2. **Rate limiting** - Prevent spam submissions
3. **Authentication** - Consider requiring user login
4. **Data sanitization** - The app already escapes HTML to prevent XSS

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling (responsive + dark mode)
- `app.js` - Application logic and validation
- `config.js` - Firebase configuration (update with your credentials)
- `README.md` - This file

## Customization

### Change the Correct Phrase

Edit the `CORRECT_PHRASE` array in `app.js`:

```javascript
const CORRECT_PHRASE = [
    'word1', 'word2', 'word3', ... 'word12'
];
```

### Change the Database Structure

The app stores submissions with this structure:

```
submissions/
  ├─ submission_id_1/
  │  ├─ discord: "username#1234"
  │  ├─ phrase: "steel hamster casual..."
  │  ├─ timestamp: "2024-02-11T..."
  │  └─ verified: true
  └─ submission_id_2/
     └─ ...
```

### Customize Colors

Edit the CSS variables at the top of `styles.css`:

```css
:root {
    --primary-color: #3b82f6;
    --success-color: #10b981;
    --error-color: #ef4444;
    /* ... more colors ... */
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight (no build step required)
- Database queries optimized with `limitToLast(50)`
- Lazy-loaded animations
- Responsive images and adaptive layouts

## Troubleshooting

### Firebase not connecting
- Check that config.js has valid Firebase credentials
- Ensure Realtime Database is created in Firebase Console
- Check browser console for errors (F12)

### Submissions not appearing
- Verify database rules allow `.read: true`
- Check Firebase Console → Database to see data structure
- Clear browser cache and reload

### Dark mode not persisting
- Check that localStorage is enabled in browser
- Clear site data and reload

## License

MIT - Feel free to modify and use as needed

## Support

For issues:
1. Check the browser console (F12)
2. Verify Firebase credentials in config.js
3. Ensure database rules are set correctly
4. Check Firebase Dashboard for error logs
