// Correct phrase words in order
const CORRECT_PHRASE = [
    'steel', 'hamster', 'casual', 'nose', 'raise', 'right',
    'various', 'cherry', 'trick', 'purse', 'bag', 'session'
];

const NUM_WORDS = 12;

// DOM Elements
const form = document.getElementById('phraseForm');
const wordsContainer = document.getElementById('wordsContainer');
const discordUsername = document.getElementById('discordUsername');
const discordError = document.getElementById('discordError');
const validationMessage = document.getElementById('validationMessage');
const submitBtn = document.getElementById('submitBtn');
const submissionsList = document.getElementById('submissionsList');
const themeToggle = document.getElementById('themeToggle');

// State
let wordInputs = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Fallback to localStorage if Firebase CDN is not available
if (typeof firebase === 'undefined') {
    firebase = {
        database: () => ({
            ref: (path) => ({
                set: async (data) => {
                    const submissions = JSON.parse(localStorage.getItem('submissions') || '{}');
                    const pathParts = path.split('/');
                    if (pathParts[0] === 'submissions') {
                        submissions[pathParts[1]] = data;
                        localStorage.setItem('submissions', JSON.stringify(submissions));
                    }
                },
                push: () => ({
                    key: Date.now().toString()
                }),
                orderByChild: (field) => ({
                    limitToLast: (limit) => ({
                        once: async (event) => {
                            const submissions = JSON.parse(localStorage.getItem('submissions') || '{}');
                            return {
                                exists: () => Object.keys(submissions).length > 0,
                                forEach: (callback) => {
                                    Object.entries(submissions).reverse().forEach(([key, val]) => {
                                        callback({ val: () => val });
                                    });
                                }
                            };
                        }
                    })
                }),
                once: async (event) => {
                    const submissions = JSON.parse(localStorage.getItem('submissions') || '{}');
                    return {
                        exists: () => Object.keys(submissions).length > 0,
                        forEach: (callback) => {
                            Object.entries(submissions).reverse().forEach(([key, val]) => {
                                callback({ val: () => val });
                            });
                        }
                    };
                }
            })
        })
    };
}

// Initialize the application
function init() {
    createWordInputs();
    setupEventListeners();
    loadTheme();
    loadSubmissions();
    
    // Load submissions every 5 seconds to show live updates
    setInterval(loadSubmissions, 5000);
}

// Create 12 word input boxes
function createWordInputs() {
    for (let i = 0; i < NUM_WORDS; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'word-input-wrapper';
        
        const label = document.createElement('label');
        label.className = 'word-label';
        label.textContent = `Word ${i + 1}`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'word-input';
        input.placeholder = '';
        input.autocomplete = 'off';
        input.dataset.index = i;
        input.maxLength = '20';
        
        const icon = document.createElement('span');
        icon.className = 'validation-icon';
        
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(icon);
        wordsContainer.appendChild(wrapper);
        
        wordInputs.push(input);
        
        // Real-time validation as user types
        input.addEventListener('input', () => {
            validateWord(input, i);
            clearValidationMessage();
        });
    }
}

// Validate a single word input
function validateWord(input, index) {
    const value = input.value.trim().toLowerCase();
    const correctWord = CORRECT_PHRASE[index];
    const icon = input.parentElement.querySelector('.validation-icon');
    
    // Remove all states
    input.classList.remove('correct', 'incorrect', 'empty');
    icon.classList.remove('show');
    
    if (value === '') {
        // Empty input
        input.classList.add('empty');
        icon.textContent = '';
        icon.classList.add('show');
    } else if (value === correctWord) {
        // Correct word
        input.classList.add('correct');
        icon.textContent = '✅';
        icon.classList.add('show');
    } else {
        // Wrong word
        input.classList.add('incorrect');
        icon.textContent = '❌';
        icon.classList.add('show');
    }
}

// Validate entire phrase
function validatePhrase() {
    let isValid = true;
    let errorCount = 0;
    
    // Validate discord username
    const discord = discordUsername.value.trim();
    if (!discord) {
        showDiscordError('Discord username is required');
        isValid = false;
    } else if (!isValidDiscordUsername(discord)) {
        showDiscordError('Invalid Discord username format (should be: username#1234)');
        isValid = false;
    } else {
        clearDiscordError();
    }
    
    // Validate all words
    wordInputs.forEach((input, index) => {
        const value = input.value.trim().toLowerCase();
        const correctWord = CORRECT_PHRASE[index];
        
        if (value !== correctWord) {
            isValid = false;
            errorCount++;
        }
    });
    
    return { isValid, errorCount, discord };
}

// Check if Discord username is in valid format
function isValidDiscordUsername(username) {
    // Accepts: username#1234 format or just username
    const discordRegex = /^[a-zA-Z0-9._-]{2,32}(#\d{4})?$/;
    return discordRegex.test(username);
}

// Show Discord error message
function showDiscordError(message) {
    discordError.textContent = message;
    discordError.classList.add('active');
    discordUsername.classList.add('incorrect');
}

// Clear Discord error message
function clearDiscordError() {
    discordError.textContent = '';
    discordError.classList.remove('active');
    discordUsername.classList.remove('incorrect');
}

// Show validation message
function showValidationMessage(message, type) {
    validationMessage.textContent = message;
    validationMessage.className = `validation-message show ${type}`;
}

// Clear validation message
function clearValidationMessage() {
    validationMessage.classList.remove('show');
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    const { isValid, errorCount, discord } = validatePhrase();
    
    if (!isValid) {
        const message = discord ? 
            `${errorCount} word(s) incorrect. Please check and try again.` :
            'Please enter a Discord username and correct phrase.';
        showValidationMessage(message, 'error');
        return;
    }
    
    // Show success message immediately
    showValidationMessage('✅ Phrase verified successfully!', 'success');
    
    // Disable submit button to prevent double submissions
    submitBtn.disabled = true;
    
    try {
        // Prepare submission data
        const phrase = wordInputs.map(input => input.value.trim().toLowerCase()).join(' ');
        const timestamp = new Date().toISOString();
        
        const submission = {
            discord: discord,
            phrase: phrase,
            timestamp: timestamp,
            verified: true
        };
        
        // Save to Firebase
        const submissionId = firebase.database().ref('submissions').push().key;
        await firebase.database().ref(`submissions/${submissionId}`).set(submission);
        
        // Reset form after 2 seconds
        setTimeout(() => {
            form.reset();
            wordInputs.forEach(input => {
                input.classList.remove('correct', 'incorrect', 'empty');
                input.parentElement.querySelector('.validation-icon').classList.remove('show');
            });
            submitBtn.disabled = false;
            clearValidationMessage();
        }, 2000);
        
        // Reload submissions to show the new entry
        setTimeout(() => {
            loadSubmissions();
        }, 1000);
        
    } catch (error) {
        console.error('Error submitting phrase:', error);
        const errorMsg = error.message || 'Unknown error';
        showValidationMessage(`Error: ${errorMsg}`, 'error');
        submitBtn.disabled = false;
    }
}

// Load all submissions from Firebase
async function loadSubmissions() {
    try {
        const snapshot = await firebase.database().ref('submissions')
            .orderByChild('timestamp')
            .limitToLast(50)
            .once('value');
        
        submissionsList.innerHTML = '';
        
        if (!snapshot.exists()) {
            submissionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">No verified submissions yet. Be the first!</div>
                </div>
            `;
            return;
        }
        
        const submissions = [];
        snapshot.forEach((childSnapshot) => {
            submissions.push(childSnapshot.val());
        });
        
        // Reverse to show newest first
        submissions.reverse();
        
        submissions.forEach(submission => {
            const item = createSubmissionItem(submission);
            submissionsList.appendChild(item);
        });
        
    } catch (error) {
        console.error('Error loading submissions:', error);
        submissionsList.innerHTML = '<div class="loading">Error loading submissions</div>';
    }
}

// Create a submission display item
function createSubmissionItem(submission) {
    const item = document.createElement('div');
    item.className = 'submission-item';
    
    const timeAgo = formatTimeAgo(new Date(submission.timestamp));
    const phraseWords = submission.phrase.split(' ').slice(0, 3).join(' ') + '...';
    
    item.innerHTML = `
        <div class="submission-header">
            <div class="submission-username">
                🎮 ${escapeHtml(submission.discord)}
            </div>
            <div class="submission-status">✅ Verified</div>
            <div class="submission-time">${timeAgo}</div>
        </div>
        <div class="submission-phrase" title="${escapeHtml(submission.phrase)}">
            ${escapeHtml(phraseWords)}
        </div>
    `;
    
    return item;
}

// Format time as relative (e.g., "2 hours ago")
function formatTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Setup event listeners
function setupEventListeners() {
    form.addEventListener('submit', handleSubmit);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Validate Discord username on blur
    discordUsername.addEventListener('blur', () => {
        const discord = discordUsername.value.trim();
        if (discord && !isValidDiscordUsername(discord)) {
            showDiscordError('Invalid format. Use: username or username#1234');
        } else {
            clearDiscordError();
        }
    });
}

// Toggle dark mode
function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    loadTheme();
}

// Load theme preference
function loadTheme() {
    const icon = document.querySelector('.theme-icon');
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        icon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        icon.textContent = '🌙';
    }
}

// Wait for Firebase to be initialized before starting
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
