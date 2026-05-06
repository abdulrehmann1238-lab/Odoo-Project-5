// Initialize Lucide Icons
lucide.createIcons();

// View State Management
let currentView = 'dashboard-home';
let sidebarExpanded = true;

// Utility function to ensure icons are rendered after DOM changes
function refreshIcons() {
    setTimeout(() => lucide.createIcons(), 50);
}

// NAVIGATION FUNCTIONS
function showLogin() {
    // Force reset scroll
    window.scrollTo(0, 0);
    
    const landing = document.getElementById('landing-page');
    landing.classList.remove('visible-view');
    landing.classList.add('hidden-view');
    
    setTimeout(() => {
        landing.style.display = 'none';
        const login = document.getElementById('login-screen');
        login.style.display = 'flex';
        setTimeout(() => {
            login.classList.add('visible-view');
            login.classList.remove('hidden-view');
            refreshIcons();
        }, 50);
    }, 400); // Reduced delay for better feel
}

function handleLogin() {
    const login = document.getElementById('login-screen');
    login.classList.remove('visible-view');
    login.classList.add('hidden-view');
    
    showToast('Success', 'Authenticated as Enterprise Admin', 'success');
    
    setTimeout(() => {
        login.style.display = 'none';
        // Ensure landing is also gone
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('loading-screen').style.display = 'none';
        
        showDashboard();
    }, 400);
}

function showDashboard() {
    window.scrollTo(0, 0);
    
    const dashboard = document.getElementById('dashboard');
    dashboard.style.display = 'flex';
    
    // Explicitly show the default view container
    const viewContainer = document.getElementById('view-container');
    viewContainer.style.display = 'block';
    
    // Reset all views to hidden first
    document.querySelectorAll('.view-pane').forEach(v => {
        v.style.display = 'none';
        v.classList.remove('visible-view');
        v.classList.add('hidden-view');
    });

    // Explicitly show the default view
    const firstView = document.getElementById('view-dashboard-home');
    if (firstView) {
        firstView.style.display = 'block';
        setTimeout(() => {
            firstView.classList.add('visible-view');
            firstView.classList.remove('hidden-view');
        }, 50);
    }
    
    setTimeout(() => {
        dashboard.classList.add('visible-view');
        dashboard.classList.remove('hidden-view');
        refreshIcons();
    }, 50);
}

function switchTab(tabId) {
    if (tabId === currentView) return;

    // Update UI
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('nav-item-active');
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('nav-item-active');
        }
    });

    const oldView = document.getElementById(`view-${currentView}`) || document.getElementById('view-placeholder');
    const newView = document.getElementById(`view-${tabId}`) || document.getElementById('view-placeholder');

    if (!newView) return;

    document.getElementById('current-tab-title').textContent = tabId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Fast switch for better performance
    oldView.classList.remove('visible-view');
    oldView.classList.add('hidden-view');
    
    setTimeout(() => {
        oldView.style.display = 'none';
        newView.style.display = 'block';
        
        setTimeout(() => {
            newView.classList.remove('hidden-view');
            newView.classList.add('visible-view');
            currentView = tabId;
            refreshIcons();
        }, 20);
    }, 200);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const texts = document.querySelectorAll('.sidebar-text');
    
    if (sidebarExpanded) {
        sidebar.style.width = '80px';
        texts.forEach(t => t.style.opacity = '0');
        setTimeout(() => {
            texts.forEach(t => t.style.display = 'none');
        }, 150);
    } else {
        sidebar.style.width = '256px';
        texts.forEach(t => t.style.display = 'block');
        setTimeout(() => {
            texts.forEach(t => t.style.opacity = '1');
        }, 50);
    }
    sidebarExpanded = !sidebarExpanded;
}

function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    dropdown.classList.toggle('hidden');
    refreshIcons();
}

// Close dropdowns on outside click
window.addEventListener('click', (e) => {
    const notifBtn = document.querySelector('[onclick="toggleNotifications()"]');
    const notifDropdown = document.getElementById('notif-dropdown');
    
    if (notifDropdown && !notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
        notifDropdown.classList.add('hidden');
    }
});

// Modal Logic
function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    refreshIcons();
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('hidden');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
}

// Simulation Logic
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const tTitle = document.getElementById('toast-title');
    const tMsg = document.getElementById('toast-message');
    const tIconBg = document.getElementById('toast-icon-bg');
    const tIcon = document.getElementById('toast-icon');
    
    tTitle.textContent = title;
    tMsg.textContent = message;
    
    if (type === 'success') {
        tIconBg.className = 'w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center';
        tIcon.setAttribute('data-lucide', 'check');
    } else {
        tIconBg.className = 'w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center';
        tIcon.setAttribute('data-lucide', 'alert-circle');
    }
    refreshIcons();
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}

function submitEmployee() {
    closeModal('add-employee-modal');
    showToast('Processing', 'Connecting to Muqeem Gateway...', 'success');
    
    setTimeout(() => {
        showToast('Employee Registered', 'Background check complete. Record added to Odoo.', 'success');
    }, 2000);
}

function simulateSync(system) {
    const overlay = document.getElementById('sync-overlay');
    const progress = document.getElementById('sync-progress');
    const title = document.getElementById('sync-title');
    const subtitle = document.getElementById('sync-subtitle');
    const icon = document.getElementById('sync-icon');
    
    overlay.style.display = 'flex';
    overlay.classList.remove('hidden');
    
    title.textContent = `Connecting to ${system.toUpperCase()}...`;
    progress.style.width = '0%';
    
    let p = 0;
    const interval = setInterval(() => {
        p += Math.random() * 12;
        if (p >= 100) {
            p = 100;
            clearInterval(interval);
            
            title.textContent = 'Verification Complete';
            subtitle.textContent = 'All records are now in sync with government servers.';
            icon.setAttribute('data-lucide', 'check-circle');
            refreshIcons();
            
            setTimeout(() => {
                overlay.classList.add('hidden');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    icon.setAttribute('data-lucide', 'refresh-cw');
                    refreshIcons();
                }, 400);
                showToast('Sync Successful', `${system.toUpperCase()} records updated successfully.`);
            }, 1200);
        }
        progress.style.width = `${p}%`;
        
        if (p > 20 && p < 50) title.textContent = `Verifying credentials with ${system.toUpperCase()}...`;
        if (p > 50 && p < 80) title.textContent = `Pushing data updates...`;
        if (p > 80) title.textContent = `Finalizing handshake...`;
        
    }, 200);
}

// Initial Loading Sequence
window.addEventListener('DOMContentLoaded', () => {
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');
    const statusTexts = [
        "Initializing Government Sync...",
        "Connecting to Muqeem Gateway...",
        "Verifying GOSI Wage Records...",
        "Preparing Compliance Dashboard...",
        "Finalizing Secure Connection..."
    ];
    
    let progress = 0;
    let textIdx = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Exit Loading
            setTimeout(() => {
                const loader = document.getElementById('loading-screen');
                loader.style.opacity = '0';
                loader.style.transform = 'scale(1.05)';
                loader.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    loader.style.display = 'none';
                    const landing = document.getElementById('landing-page');
                    landing.style.display = 'block';
                    setTimeout(() => {
                        landing.classList.remove('hidden-view');
                        landing.classList.add('visible-view');
                        refreshIcons();
                    }, 50);
                }, 800);
            }, 1000);
        }
        bar.style.width = `${progress}%`;
        
        // Cycle text
        if (progress > (textIdx + 1) * (100 / statusTexts.length) && textIdx < statusTexts.length - 1) {
            textIdx++;
            text.style.opacity = '0';
            setTimeout(() => {
                text.textContent = statusTexts[textIdx];
                text.style.opacity = '1';
            }, 200);
        }
    }, 60);
});

// Scroll animations for Landing Page
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

document.querySelectorAll('section > div').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});
