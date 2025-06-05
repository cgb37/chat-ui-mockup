// static/chatui.js
// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

// Sidebar toggle for mobile (optional, if you want to add responsive behavior)
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
sidebarToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('hidden');
});

// Chat form submit (placeholder, no backend logic)
document.getElementById('chatForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    if (input.value.trim()) {
        const chatWindow = document.getElementById('chatWindow');
        const bubble = document.createElement('div');
        bubble.className = 'self-end max-w-lg bg-blue-600 text-white rounded-lg px-4 py-2 shadow';
        bubble.textContent = input.value;
        chatWindow.appendChild(bubble);
        input.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});

// Image upload button (placeholder)
document.getElementById('imageUpload')?.addEventListener('change', function(e) {
    alert('Image upload is not implemented in this mockup.');
});
