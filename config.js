// IMPORTANT: Replace these values with your Firebase project configuration
// Get these from your Firebase Console: https://console.firebase.google.com/

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// For development/testing, you can use this demo config
// But please set up your own Firebase project for production

// Initialize Firebase only if it exists
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    // Get reference to the database
    const database = firebase.database();
}
