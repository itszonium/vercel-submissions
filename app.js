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
let submissionCache = []; // Cache submissions for ranking

// Initialize the application
async function init() {
    createWordInputs();
    setupEventListeners();
    loadTheme();
    
    // Wait longer for Supabase to initialize, then start polling
    console.log('⏳ Waiting for Supabase to initialize...');
    
    let attempts = 0;
    const waitForSupabase = setInterval(() => {
        attempts++;
        if (typeof window !== 'undefined' && window.supabaseClient) {
            clearInterval(waitForSupabase);
            console.log('✅ Supabase ready! Starting submission updates...');
            loadSubmissions();
            // Load submissions every 3 seconds for live updates
            setInterval(loadSubmissions, 3000);
        } else if (attempts > 100) {
            clearInterval(waitForSupabase);
            console.error('❌ Supabase initialization timed out');
            submissionsList.innerHTML = '<div class="loading">Failed to connect to database. Check browser console.</div>';
        }
    }, 100);
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
        // Get Supabase client (might be async)
        let supabaseClient = getSupabase();
        
        // If it's a promise, wait for it
        if (supabaseClient && typeof supabaseClient.then === 'function') {
            supabaseClient = await supabaseClient;
        }
        
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized. Waiting for connection...');
        }
        
        // Prepare submission data
        const phrase = wordInputs.map(input => input.value.trim().toLowerCase()).join(' ');
        const now = new Date().toISOString();
        
        const submission = {
            discord_username: discord,
            phrase: phrase,
            is_valid: true,
            submitted_at: now
        };
        
        console.log('Submitting to Supabase:', submission);
        
        // Save to Supabase
        const { data, error } = await supabaseClient
            .from('submissions')
            .insert([submission])
            .select();
        
        if (error) {
            console.error('Supabase error:', error);
            throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('✅ Submission saved successfully', data);
        
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
        console.error('❌ Error submitting phrase:', error);
        const errorMsg = error.message || 'Unknown error. Check console for details.';
        showValidationMessage(`Error: ${errorMsg}`, 'error');
        submitBtn.disabled = false;
    }
}

// Load all submissions from Supabase
async function loadSubmissions() {
    try {
        let supabaseClient = getSupabase();
        
        // If it's a promise, wait for it
        if (supabaseClient && typeof supabaseClient.then === 'function') {
            supabaseClient = await supabaseClient;
        }
        
        if (!supabaseClient) {
            submissionsList.innerHTML = '<div class="loading">Initializing database connection...</div>';
            return;
        }
        
        // Fetch submissions ordered by submission time (earliest first)
        const { data: submissions, error } = await supabaseClient
            .from('submissions')
            .select('*')
            .eq('is_valid', true)
            .order('submitted_at', { ascending: true })
            .limit(100);
        
        if (error) {
            console.error('Error loading submissions:', error);
            submissionsList.innerHTML = '<div class="loading">Error loading submissions</div>';
            return;
        }
        
        submissionsList.innerHTML = '';
        
        if (!submissions || submissions.length === 0) {
            submissionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">No verified submissions yet. Be the first!</div>
                </div>
            `;
            submissionCache = [];
            return;
        }
        
        // Update cache
        submissionCache = submissions;
        
        // Show submissions with ranking (1st, 2nd, 3rd, etc.)
        submissions.forEach((submission, index) => {
            const rank = index + 1;
            const item = createSubmissionItem(submission, rank);
            submissionsList.appendChild(item);
        });
        
    } catch (error) {
        console.error('Unexpected error loading submissions:', error);
        submissionsList.innerHTML = '<div class="loading">Error loading submissions</div>';
    }
}

// Create a submission display item
function createSubmissionItem(submission, rank) {
    const item = document.createElement('div');
    item.className = 'submission-item';
    
    const timeAgo = formatTimeAgo(new Date(submission.submitted_at));
    const phraseWords = submission.phrase.split(' ').slice(0, 3).join(' ') + '...';
    
    // Determine medal for top 3
    let medal = '';
    if (rank === 1) medal = '🥇';
    else if (rank === 2) medal = '🥈';
    else if (rank === 3) medal = '🥉';
    else medal = `#${rank}`;
    
    item.innerHTML = `
        <div class="submission-header">
            <div class="submission-username">
                <span class="submission-rank">${medal}</span>
                🎮 ${escapeHtml(submission.discord_username)}
            </div>
            <div class="submission-status">✅ Valid</div>
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
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
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
    localStorage.setItem('darkMode', isDarkMode.toString());
    applyTheme();
}

// Apply theme to DOM
function applyTheme() {
    const icon = document.querySelector('.theme-icon');
    if (!icon) return;
    
    if (isDarkMode) {
        document.documentElement.style.colorScheme = 'dark';
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        icon.textContent = '☀️';
        console.log('✅ Dark mode enabled');
    } else {
        document.documentElement.style.colorScheme = 'light';
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        icon.textContent = '🌙';
        console.log('✅ Light mode enabled');
    }
}

// Load theme preference
function loadTheme() {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
        isDarkMode = saved === 'true';
    } else {
        // Check system preference
        isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyTheme();
}

// Get Supabase client instance
function getSupabase() {
    // Check if client exists
    if (typeof window !== 'undefined' && window.supabaseClient) {
        return window.supabaseClient;
    }
    
    // If still loading, wait and try again
    if (!window.supabaseClient) {
        console.warn('Waiting for Supabase to initialize...');
        // Give it a moment to initialize
        return new Promise(resolve => {
            let attempts = 0;
            const checkInit = setInterval(() => {
                attempts++;
                if (window.supabaseClient) {
                    clearInterval(checkInit);
                    resolve(window.supabaseClient);
                } else if (attempts > 50) {
                    clearInterval(checkInit);
                    console.error('Supabase failed to initialize');
                    resolve(null);
                }
            }, 100);
        });
    }
    
    return null;
}

// Wait for document to be ready before starting
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
