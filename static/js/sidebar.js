// Sidebar Management
class SidebarManager {
    constructor() {
        this.leftSidebar = document.getElementById('leftSidebar');
        this.rightSidebar = document.getElementById('rightSidebar');
        this.overlay = document.getElementById('overlay');
        
        this.leftToggle = document.getElementById('leftSidebarToggle');
        this.rightToggle = document.getElementById('rightSidebarToggle');
        this.leftClose = document.getElementById('leftSidebarClose');
        this.rightClose = document.getElementById('rightSidebarClose');
        
        this.isDesktop = window.innerWidth >= 768;
        this.leftOpen = this.isDesktop;
        this.rightOpen = this.isDesktop;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateSidebarStates();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const wasDesktop = this.isDesktop;
            this.isDesktop = window.innerWidth >= 768;
            
            if (wasDesktop !== this.isDesktop) {
                this.updateSidebarStates();
            }
        });
    }
    
    bindEvents() {
        this.leftToggle?.addEventListener('click', () => this.toggleLeftSidebar());
        this.rightToggle?.addEventListener('click', () => this.toggleRightSidebar());
        this.leftClose?.addEventListener('click', () => this.closeLeftSidebar());
        this.rightClose?.addEventListener('click', () => this.closeRightSidebar());
        
        // Close sidebars when clicking overlay
        this.overlay?.addEventListener('click', () => {
            this.closeAllSidebars();
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        this.toggleLeftSidebar();
                        break;
                    case 'j':
                        e.preventDefault();
                        this.toggleRightSidebar();
                        break;
                }
            }
            
            // Close sidebars on Escape
            if (e.key === 'Escape') {
                this.closeAllSidebars();
            }
        });
    }
    
    toggleLeftSidebar() {
        this.leftOpen = !this.leftOpen;
        this.updateSidebarStates();
    }
    
    toggleRightSidebar() {
        this.rightOpen = !this.rightOpen;
        this.updateSidebarStates();
    }
    
    closeLeftSidebar() {
        this.leftOpen = false;
        this.updateSidebarStates();
    }
    
    closeRightSidebar() {
        this.rightOpen = false;
        this.updateSidebarStates();
    }
    
    closeAllSidebars() {
        if (!this.isDesktop) {
            this.leftOpen = false;
            this.rightOpen = false;
            this.updateSidebarStates();
        }
    }
    
    updateSidebarStates() {
        if (!this.leftSidebar || !this.rightSidebar) return;
        
        // Update left sidebar
        this.leftSidebar.setAttribute('data-open', this.leftOpen.toString());
        
        if (this.isDesktop) {
            // Desktop behavior
            this.leftSidebar.classList.remove('sidebar-hidden-left', 'fixed');
            this.leftSidebar.classList.add('sidebar-desktop');
            
            if (this.leftOpen) {
                this.leftSidebar.classList.remove('sidebar-collapsed');
            } else {
                this.leftSidebar.classList.add('sidebar-collapsed');
            }
        } else {
            // Mobile behavior
            this.leftSidebar.classList.remove('sidebar-desktop', 'sidebar-collapsed');
            this.leftSidebar.classList.add('fixed');
            
            if (this.leftOpen) {
                this.leftSidebar.classList.remove('sidebar-hidden-left');
            } else {
                this.leftSidebar.classList.add('sidebar-hidden-left');
            }
        }
        
        // Update right sidebar
        this.rightSidebar.setAttribute('data-open', this.rightOpen.toString());
        
        if (this.isDesktop) {
            // Desktop behavior
            this.rightSidebar.classList.remove('sidebar-hidden-right', 'fixed');
            this.rightSidebar.classList.add('sidebar-desktop');
            
            if (this.rightOpen) {
                this.rightSidebar.classList.remove('sidebar-collapsed');
            } else {
                this.rightSidebar.classList.add('sidebar-collapsed');
            }
        } else {
            // Mobile behavior
            this.rightSidebar.classList.remove('sidebar-desktop', 'sidebar-collapsed');
            this.rightSidebar.classList.add('fixed');
            
            if (this.rightOpen) {
                this.rightSidebar.classList.remove('sidebar-hidden-right');
            } else {
                this.rightSidebar.classList.add('sidebar-hidden-right');
            }
        }
        
        // Update overlay
        if (!this.isDesktop && (this.leftOpen || this.rightOpen)) {
            this.overlay?.classList.remove('hidden');
        } else {
            this.overlay?.classList.add('hidden');
        }
        
        // Update toggle button states
        this.updateToggleButtons();
    }
    
    updateToggleButtons() {
        // Update left toggle button
        if (this.leftToggle) {
            const icon = this.leftToggle.querySelector('i');
            if (this.leftOpen && this.isDesktop) {
                // Show close icon
                icon.className = 'fas fa-chevron-left w-5 h-5';
            } else {
                // Show menu/open icon
                icon.className = 'fas fa-bars w-5 h-5';
            }
        }
        
        // Update right toggle button
        if (this.rightToggle) {
            const icon = this.rightToggle.querySelector('i');
            if (this.rightOpen && this.isDesktop) {
                // Show close icon
                icon.className = 'fas fa-chevron-right w-5 h-5';
            } else {
                // Show open icon
                icon.className = 'fas fa-chevron-left w-5 h-5';
            }
        }
    }
    
    // Public methods for external access
    getState() {
        return {
            leftOpen: this.leftOpen,
            rightOpen: this.rightOpen,
            isDesktop: this.isDesktop
        };
    }
    
    setState(state) {
        if (typeof state.leftOpen === 'boolean') {
            this.leftOpen = state.leftOpen;
        }
        if (typeof state.rightOpen === 'boolean') {
            this.rightOpen = state.rightOpen;
        }
        this.updateSidebarStates();
    }
}

// Initialize sidebar manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarManager;
}