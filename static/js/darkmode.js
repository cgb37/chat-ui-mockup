// Dark Mode Management
class DarkModeManager {
    constructor() {
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentMode = this.getSavedMode() || (this.prefersDark ? 'dark' : 'light');
        
        this.init();
    }
    
    init() {
        this.applyMode(this.currentMode);
        this.bindEvents();
        this.updateIcon();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
                if (!this.getSavedMode()) {
                    this.currentMode = e.matches ? 'dark' : 'light';
                    this.applyMode(this.currentMode);
                    this.updateIcon();
                }
            });
        }
    }
    
    bindEvents() {
        this.darkModeToggle?.addEventListener('click', () => {
            this.toggle();
        });
        
        // Keyboard shortcut (Ctrl/Cmd + Shift + L)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    toggle() {
        this.currentMode = this.currentMode === 'dark' ? 'light' : 'dark';
        this.applyMode(this.currentMode);
        this.saveMode(this.currentMode);
        this.updateIcon();
        
        // Dispatch custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('darkModeChanged', {
            detail: { mode: this.currentMode }
        }));
    }
    
    applyMode(mode) {
        const html = document.documentElement;
        const body = document.body;
        
        if (mode === 'dark') {
            html.classList.add('dark');
            body.classList.add('dark');
        } else {
            html.classList.remove('dark');
            body.classList.remove('dark');
        }
        
        // Update meta theme-color for mobile browsers
        this.updateThemeColor(mode);
    }
    
    updateIcon() {
        const icon = this.darkModeToggle?.querySelector('i');
        if (!icon) return;
        
        if (this.currentMode === 'dark') {
            // Moon icon for dark mode
            icon.className = 'fas fa-moon w-5 h-5';
            this.darkModeToggle.setAttribute('title', 'Switch to light mode');
        } else {
            // Sun icon for light mode
            icon.className = 'fas fa-sun w-5 h-5';
            this.darkModeToggle.setAttribute('title', 'Switch to dark mode');
        }
    }
    
    updateThemeColor(mode) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        
        themeColorMeta.content = mode === 'dark' ? '#1f2937' : '#f9fafb';
    }
    
    getSavedMode() {
        try {
            return localStorage.getItem('darkMode');
        } catch (e) {
            return null;
        }
    }
    
    saveMode(mode) {
        try {
            localStorage.setItem('darkMode', mode);
        } catch (e) {
            // localStorage not available, fail silently
        }
    }
    
    // Public methods
    getCurrentMode() {
        return this.currentMode;
    }
    
    setMode(mode) {
        if (mode !== 'light' && mode !== 'dark') return;
        
        this.currentMode = mode;
        this.applyMode(mode);
        this.saveMode(mode);
        this.updateIcon();
        
        document.dispatchEvent(new CustomEvent('darkModeChanged', {
            detail: { mode: this.currentMode }
        }));
    }
    
    isDark() {
        return this.currentMode === 'dark';
    }
}

// Initialize dark mode manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}