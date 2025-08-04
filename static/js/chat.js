// Chat Management
class ChatManager {
    constructor() {
        this.chatForm = document.getElementById('chatForm');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatWindow = document.getElementById('chatWindow');
        this.charCounter = document.getElementById('charCounter');
        this.imageUpload = document.getElementById('imageUpload');
        this.modelChoice = document.getElementById('modelChoice');
        this.mobileModelChoice = document.getElementById('mobileModelChoice');
        
        this.maxCharacters = 4000;
        this.attachedFiles = new Map();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupTextareaAutoResize();
        this.syncModelChoices();
    }
    
    bindEvents() {
        // Form submission
        this.chatForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Input handling
        this.chatInput?.addEventListener('input', () => {
            this.handleInputChange();
        });
        
        this.chatInput?.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        // File upload
        this.imageUpload?.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        
        // Model choice sync
        this.modelChoice?.addEventListener('change', () => {
            this.syncModelChoices();
        });
        
        this.mobileModelChoice?.addEventListener('change', () => {
            this.syncModelChoices();
        });
        
        // Paste handling for images
        document.addEventListener('paste', (e) => {
            this.handlePaste(e);
        });
    }
    
    handleSubmit() {
        const message = this.chatInput?.value.trim();
        if (!message && this.attachedFiles.size === 0) return;
        
        this.sendMessage(message);
        this.clearInput();
    }
    
    handleInputChange() {
        const value = this.chatInput?.value || '';
        const length = value.length;
        
        // Update send button state
        if (this.sendBtn) {
            this.sendBtn.disabled = length === 0 && this.attachedFiles.size === 0;
        }
        
        // Update character counter
        if (this.charCounter) {
            if (length > this.maxCharacters * 0.8) {
                this.charCounter.textContent = `${length}/${this.maxCharacters}`;
                this.charCounter.classList.remove('hidden');
                this.charCounter.classList.toggle('text-red-500', length > this.maxCharacters);
            } else {
                this.charCounter.classList.add('hidden');
            }
        }
        
        // Auto-resize textarea
        this.resizeTextarea();
    }
    
    handleKeyDown(e) {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSubmit();
        }
        
        // Prevent input if over character limit
        if (this.chatInput?.value.length >= this.maxCharacters && 
            !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
        }
    }
    
    handleFileUpload(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => this.addFile(file));
        
        // Clear the input so the same file can be selected again
        e.target.value = '';
    }
    
    handlePaste(e) {
        const items = Array.from(e.clipboardData?.items || []);
        const imageItems = items.filter(item => item.type.startsWith('image/'));
        
        if (imageItems.length > 0 && this.chatInput === document.activeElement) {
            e.preventDefault();
            imageItems.forEach(item => {
                const file = item.getAsFile();
                if (file) this.addFile(file);
            });
        }
    }
    
    addFile(file) {
        const fileId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.attachedFiles.set(fileId, file);
        
        this.renderAttachedFiles();
        this.updateSendButtonState();
    }
    
    removeFile(fileId) {
        this.attachedFiles.delete(fileId);
        this.renderAttachedFiles();
        this.updateSendButtonState();
    }
    
    renderAttachedFiles() {
        let container = document.getElementById('attachedFiles');
        
        if (this.attachedFiles.size === 0) {
            container?.remove();
            return;
        }
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'attachedFiles';
            container.className = 'flex flex-wrap gap-2 mb-3';
            this.chatForm?.insertBefore(container, this.chatForm.firstChild);
        }
        
        container.innerHTML = '';
        this.attachedFiles.forEach((file, fileId) => {
            const fileElement = this.createFileElement(file, fileId);
            container.appendChild(fileElement);
        });
    }
    
    createFileElement(file, fileId) {
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm';
        
        const icon = file.type.startsWith('image/') ? '🖼️' : '📄';
        const name = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
        
        div.innerHTML = `
            <span>${icon}</span>
            <span class="text-gray-700 dark:text-gray-300">${name}</span>
            <button type="button" class="text-gray-500 hover:text-red-500 ml-2" onclick="window.chatManager.removeFile('${fileId}')">
                <i class="fas fa-times text-sm"></i>
            </button>
        `;
        
        return div;
    }
    
    updateSendButtonState() {
        if (this.sendBtn) {
            const hasMessage = this.chatInput?.value.trim().length > 0;
            const hasFiles = this.attachedFiles.size > 0;
            this.sendBtn.disabled = !hasMessage && !hasFiles;
        }
    }
    
    setupTextareaAutoResize() {
        if (!this.chatInput) return;
        
        this.chatInput.addEventListener('input', () => {
            this.resizeTextarea();
        });
        
        // Initial resize
        this.resizeTextarea();
    }
    
    resizeTextarea() {
        if (!this.chatInput) return;
        
        this.chatInput.style.height = 'auto';
        const newHeight = Math.min(this.chatInput.scrollHeight, 120); // Max height 120px
        this.chatInput.style.height = newHeight + 'px';
    }
    
    syncModelChoices() {
        const desktopValue = this.modelChoice?.value;
        const mobileValue = this.mobileModelChoice?.value;
        
        if (desktopValue && this.mobileModelChoice && this.mobileModelChoice.value !== desktopValue) {
            this.mobileModelChoice.value = desktopValue;
        }
        
        if (mobileValue && this.modelChoice && this.modelChoice.value !== mobileValue) {
            this.modelChoice.value = mobileValue;
        }
    }
    
    sendMessage(message) {
        if (!this.chatWindow) return;
        
        // Create user message bubble
        const userBubble = this.createMessageBubble(message, 'user');
        this.chatWindow.appendChild(userBubble);
        
        // Handle attached files
        if (this.attachedFiles.size > 0) {
            const filesInfo = Array.from(this.attachedFiles.values()).map(f => f.name).join(', ');
            const filesBubble = this.createMessageBubble(`📎 Attached: ${filesInfo}`, 'user', true);
            this.chatWindow.appendChild(filesBubble);
        }
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            this.simulateAIResponse(message);
        }, 1000);
    }
    
    createMessageBubble(content, sender, isFile = false) {
        const bubble = document.createElement('div');
        const isUser = sender === 'user';
        
        bubble.className = `
            chat-message ${isUser ? 'self-end' : 'self-start'} 
            ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-800 dark:bg-gray-700 text-white'} 
            rounded-lg px-4 py-2 shadow-sm mb-3
            ${isFile ? 'text-sm opacity-75' : ''}
        `;
        
        bubble.textContent = content;
        return bubble;
    }
    
    simulateAIResponse(userMessage) {
        if (!this.chatWindow) return;
        
        const responses = [
            "I understand you're asking about: " + userMessage,
            "That's an interesting question! Let me help you with that.",
            "Based on your message, here's what I think...",
            "I can help you with that. Here are some suggestions:",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const aiBubble = this.createMessageBubble(randomResponse, 'ai');
        this.chatWindow.appendChild(aiBubble);
        
        this.scrollToBottom();
    }
    
    clearInput() {
        if (this.chatInput) {
            this.chatInput.value = '';
            this.resizeTextarea();
        }
        
        this.attachedFiles.clear();
        this.renderAttachedFiles();
        this.updateSendButtonState();
        
        if (this.charCounter) {
            this.charCounter.classList.add('hidden');
        }
    }
    
    scrollToBottom() {
        if (this.chatWindow) {
            this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
        }
    }
    
    // Public methods
    addMessage(content, sender = 'ai') {
        const bubble = this.createMessageBubble(content, sender);
        this.chatWindow?.appendChild(bubble);
        this.scrollToBottom();
    }
    
    clearChat() {
        if (this.chatWindow) {
            this.chatWindow.innerHTML = '';
        }
    }
    
    getSelectedModel() {
        return this.modelChoice?.value || 'gpt-4';
    }
    
    setModel(model) {
        if (this.modelChoice) {
            this.modelChoice.value = model;
        }
        if (this.mobileModelChoice) {
            this.mobileModelChoice.value = model;
        }
    }
}

// Initialize chat manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatManager;
}