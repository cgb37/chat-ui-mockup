// Mobile Enhancements
class MobileManager {
    constructor() {
        this.mobileFormOptions = document.getElementById('mobileFormOptions');
        this.mobileOptionsPanel = document.getElementById('mobileOptionsPanel');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        this.isMobile = window.innerWidth < 768;
        this.isTouch = 'ontouchstart' in window;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupTouchHandlers();
        this.setupViewportHandler();
        
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    bindEvents() {
        // Mobile form options toggle
        this.mobileFormOptions?.addEventListener('click', () => {
            this.toggleMobileOptions();
        });
        
        // Mobile menu toggle
        this.mobileMenuToggle?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Tools button handlers
        document.getElementById('toolsBtn')?.addEventListener('click', () => {
            this.showToolsPanel();
        });
        
        document.getElementById('mobileToolsBtn')?.addEventListener('click', () => {
            this.showToolsPanel();
        });
        
        // Settings button handlers
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettingsPanel();
        });
        
        // Handle clicks outside panels
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
    }
    
    setupTouchHandlers() {
        if (!this.isTouch) return;
        
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('button, .cursor-pointer');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.classList.add('opacity-75');
            }, { passive: true });
            
            button.addEventListener('touchend', () => {
                setTimeout(() => {
                    button.classList.remove('opacity-75');
                }, 150);
            }, { passive: true });
        });
        
        // Prevent zoom on double tap for input elements
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('touchend', (e) => {
                e.preventDefault();
                input.focus();
            });
        });
    }
    
    setupViewportHandler() {
        // Handle virtual keyboard on mobile
        if (this.isMobile) {
            const chatInput = document.getElementById('chatInput');
            
            chatInput?.addEventListener('focus', () => {
                this.handleKeyboardShow();
            });
            
            chatInput?.addEventListener('blur', () => {
                this.handleKeyboardHide();
            });
        }
    }
    
    toggleMobileOptions() {
        if (!this.mobileOptionsPanel) return;
        
        const isHidden = this.mobileOptionsPanel.classList.contains('hidden');
        
        if (isHidden) {
            this.mobileOptionsPanel.classList.remove('hidden');
            this.mobileOptionsPanel.classList.add('fade-in');
        } else {
            this.mobileOptionsPanel.classList.add('hidden');
            this.mobileOptionsPanel.classList.remove('fade-in');
        }
    }
    
    toggleMobileMenu() {
        // Create mobile menu if it doesn't exist
        let mobileMenu = document.getElementById('mobileMenu');
        
        if (!mobileMenu) {
            mobileMenu = this.createMobileMenu();
            document.body.appendChild(mobileMenu);
        }
        
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        } else {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    }
    
    createMobileMenu() {
        const menu = document.createElement('div');
        menu.id = 'mobileMenu';
        menu.className = 'fixed inset-0 z-50 bg-black/50 hidden md:hidden';
        
        menu.innerHTML = `
            <div class="fixed right-0 top-0 h-full w-80 max-w-full bg-gray-900 text-white shadow-xl transform transition-transform">
                <div class="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h3 class="font-semibold text-lg">Menu</h3>
                    <button id="closeMobileMenu" class="p-2 hover:bg-gray-800 rounded">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-4 space-y-4">
                    <a href="#" class="block py-2 hover:text-blue-300">Documentation</a>
                    <a href="#" class="block py-2 hover:text-blue-300">About</a>
                    <a href="#" class="block py-2 hover:text-blue-300">Settings</a>
                    <a href="#" class="block py-2 hover:text-blue-300">Help & Support</a>
                </div>
            </div>
        `;
        
        // Bind close events
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                this.closeMobileMenu();
            }
        });
        
        menu.querySelector('#closeMobileMenu')?.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        
        return menu;
    }
    
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    }
    
    showToolsPanel() {
        // Create and show tools panel
        this.showModal('Tools', this.createToolsContent());
    }
    
    showSettingsPanel() {
        // Create and show settings panel
        this.showModal('Settings', this.createSettingsContent());
    }
    
    createToolsContent() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Temperature</label>
                    <input type="range" min="0" max="1" step="0.1" value="0.7" class="w-full">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Max Tokens</label>
                    <input type="number" value="2048" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                </div>
                <div>
                    <label class="flex items-center">
                        <input type="checkbox" class="mr-2">
                        <span>Stream responses</span>
                    </label>
                </div>
            </div>
        `;
    }
    
    createSettingsContent() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Language</label>
                    <select class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                    </select>
                </div>
                <div>
                    <label class="flex items-center">
                        <input type="checkbox" class="mr-2" checked>
                        <span>Send analytics</span>
                    </label>
                </div>
                <div>
                    <label class="flex items-center">
                        <input type="checkbox" class="mr-2">
                        <span>Enable notifications</span>
                    </label>
                </div>
            </div>
        `;
    }
    
    showModal(title, content) {
        // Remove existing modal
        const existingModal = document.getElementById('mobileModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'mobileModal';
        modal.className = 'fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center';
        
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 w-full md:w-96 md:rounded-lg shadow-xl transform transition-transform">
                <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 class="font-semibold text-lg">${title}</h3>
                    <button id="closeModal" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-4">
                    ${content}
                </div>
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button id="cancelModal" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Cancel</button>
                    <button id="saveModal" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.classList.add('overflow-hidden');
        
        // Bind close events
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        modal.querySelector('#closeModal')?.addEventListener('click', () => {
            this.closeModal();
        });
        
        modal.querySelector('#cancelModal')?.addEventListener('click', () => {
            this.closeModal();
        });
        
        modal.querySelector('#saveModal')?.addEventListener('click', () => {
            this.closeModal();
        });
    }
    
    closeModal() {
        const modal = document.getElementById('mobileModal');
        if (modal) {
            modal.remove();
            document.body.classList.remove('overflow-hidden');
        }
    }
    
    handleKeyboardShow() {
        // Adjust layout when virtual keyboard appears
        if (this.isMobile) {
            document.body.classList.add('keyboard-open');
            
            // Scroll to chat input
            setTimeout(() => {
                const chatInput = document.getElementById('chatInput');
                chatInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }
    
    handleKeyboardHide() {
        if (this.isMobile) {
            document.body.classList.remove('keyboard-open');
        }
    }
    
    handleOrientationChange() {
        // Force layout recalculation
        document.body.style.height = window.innerHeight + 'px';
        setTimeout(() => {
            document.body.style.height = '';
        }, 500);
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        
        if (wasMobile !== this.isMobile) {
            // Clean up mobile-specific elements when switching to desktop
            if (!this.isMobile) {
                this.closeMobileMenu();
                this.closeModal();
                document.body.classList.remove('overflow-hidden', 'keyboard-open');
            }
        }
    }
    
    handleOutsideClick(e) {
        // Close mobile options panel when clicking outside
        if (this.mobileOptionsPanel && 
            !this.mobileOptionsPanel.contains(e.target) && 
            !this.mobileFormOptions?.contains(e.target)) {
            this.mobileOptionsPanel.classList.add('hidden');
        }
    }
    
    // Public methods
    isMobileDevice() {
        return this.isMobile;
    }
    
    isTouchDevice() {
        return this.isTouch;
    }
}

// Initialize mobile manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mobileManager = new MobileManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileManager;
}