// Supabase Configuration
const SUPABASE_URL = 'https://fxfarkkatekivolrgvad.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_J0jwybaGEAxeyP3gzaYNvQ_fxD5Q3Om';

// Initialize Supabase client as soon as the library loads
if (typeof window !== 'undefined') {
    // Use a more aggressive initialization strategy
    let initialized = false;
    
    const initSupabase = () => {
        if (initialized) return;
        
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            try {
                window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                initialized = true;
                console.log('✅ Supabase client initialized successfully');
                console.log('Project URL:', SUPABASE_URL);
            } catch (error) {
                console.error('❌ Failed to initialize Supabase:', error);
            }
        } else {
            if (!initialized) {
                setTimeout(initSupabase, 50);
            }
        }
    };
    
    // Try multiple initialization strategies
    setTimeout(initSupabase, 10);
    setTimeout(initSupabase, 100);
    setTimeout(initSupabase, 200);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSupabase);
    } else {
        initSupabase();
    }
    
    // Last resort - initialize on first user interaction
    window.addEventListener('click', initSupabase, { once: true });
}


