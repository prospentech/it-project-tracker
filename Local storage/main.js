// Core application logic
let projects = {};
let updates = [];
let userProfiles = {};
let enquiries = [];
let currentSlide = 0;
let slideInterval;
let clockingSystem = {
    workingHours: {
        start: 7.5,
        end: 16.5,
        days: [1, 2, 3, 4, 5]
    },
    
    getClockingStatus: function(username) {
        return JSON.parse(localStorage.getItem('clockingStatus_' + username)) || {
            clockedIn: false,
            clockInTime: null,
            clockOutTime: null,
            lastClockDate: null
        };
    },
    
    setClockingStatus: function(username, status) {
        localStorage.setItem('clockingStatus_' + username, JSON.stringify(status));
    },
    
    getClockingHistory: function(username) {
        return JSON.parse(localStorage.getItem('clockingHistory_' + username)) || [];
    },
    
    addToHistory: function(username, entry) {
        let history = this.getClockingHistory(username);
        history.unshift(entry);
        localStorage.setItem('clockingHistory_' + username, JSON.stringify(history.slice(0, 100)));
    },
    
    isWorkingDay: function() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        return this.workingHours.days.includes(dayOfWeek);
    },
    
    isWithinWorkingHours: function() {
        if (!this.isWorkingDay()) return false;
        
        const now = new Date();
        const currentHour = now.getHours() + (now.getMinutes() / 60);
        
        return currentHour >= this.workingHours.start && currentHour <= this.workingHours.end;
    },
    
    getClockInStatus: function(clockInTime) {
        const clockInDate = new Date(clockInTime);
        const clockInHour = clockInDate.getHours() + (clockInDate.getMinutes() / 60);
        const startHour = this.workingHours.start;
        
        if (clockInHour < startHour) {
            const minutesEarly = Math.round((startHour - clockInHour) * 60);
            return { 
                status: 'early', 
                hours: Math.floor(minutesEarly / 60),
                minutes: minutesEarly % 60
            };
        } else if (clockInHour > startHour) {
            const minutesLate = Math.round((clockInHour - startHour) * 60);
            return { 
                status: 'late', 
                hours: Math.floor(minutesLate / 60),
                minutes: minutesLate % 60
            };
        } else {
            return { status: 'on-time', hours: 0, minutes: 0 };
        }
    },
    
    calculateWorkDuration: function(clockInTime, clockOutTime) {
        const start = new Date(clockInTime);
        const end = new Date(clockOutTime);
        const diffMs = end - start;
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return { hours, minutes };
    }
};

// Audio elements for notifications
function playNotificationSound(type) {
    const audio = document.getElementById(type + 'Sound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Initialize the application
function initApp() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        if (!window.location.pathname.includes('index.html') && 
            window.location.pathname !== '/' &&
            !window.location.pathname.endsWith('/')) {
            window.location.href = 'login.html';
        }
        return;
    }

    loadData();
    initHeroSlider();
    updateUserInfo();
    renderProjects();
    // Make sure loadUpdates is called
    if (typeof loadUpdates === 'function') {
        loadUpdates();
    }
    updateClockDisplay();
    updateTopProject();
    
    setInterval(updateUserInfo, 60000);
    
    if (currentUser) {
        auth.recordActivity('view', 'Viewed dashboard');
        playNotificationSound('login');
    }
}

function loadData() {
    // Load projects from localStorage only - NO DEFAULTS
    projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    
    // If empty, just set empty object
    if (Object.keys(projects).length === 0) {
        projects = {};
        localStorage.setItem('prospenProjects', JSON.stringify(projects));
    }
    
    // Load updates from localStorage only - NO DEFAULTS
    updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    
    // If empty, just set empty array
    if (updates.length === 0) {
        updates = [];
        localStorage.setItem('prospenUpdates', JSON.stringify(updates));
    }
    
    // Load user profiles
    userProfiles = JSON.parse(localStorage.getItem('prospenProfiles')) || {
        'admin': {
            fullName: 'Administrator',
            email: 'admin@prospentech.co.za',
            bio: 'System administrator responsible for managing the Prospen Hub platform.',
            avatar: null,
            role: 'System Administrator'
        },
        'Junior': {
            fullName: 'Junior Tladi',
            email: 'junior@prospentech.co.za',
            bio: 'Digital Designer and Content Manager',
            avatar: null,
            role: 'Digital Designer/Content Manager'
        },
        'Buhle': {
            fullName: 'Buhle Khuzwayo',
            email: 'buhle@prospentech.co.za',
            bio: 'Instructional/Web/UI Designer',
            avatar: null,
            role: 'Instructional/Web/UI Designer'
        },
        'AJay': {
            fullName: 'AJay Manganyi',
            email: 'ajay@prospentech.co.za',
            bio: 'Web Developer',
            avatar: null,
            role: 'Web Developer'
        }
    };
    
    // Load enquiries
    enquiries = JSON.parse(localStorage.getItem('prospenEnquiries')) || [];
}

function updateUserInfo() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const userNameElement = document.getElementById('currentUserName');
    const sessionDurationElement = document.getElementById('sessionDuration');
    
    if (userNameElement) {
        userNameElement.textContent = currentUser.username;
    }
    
    if (sessionDurationElement) {
        const duration = auth.getSessionDuration();
        sessionDurationElement.textContent = duration + ' min';
    }
}

function updateTopProject() {
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    let bestProject = null;
    let maxProgress = 0;
    
    Object.values(projects).forEach(project => {
        const totalTasks = project.tasks?.length || 0;
        const completedTasks = project.tasks?.filter(t => t.status === 'Completed')?.length || 0;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        if (progress > maxProgress) {
            maxProgress = progress;
            bestProject = project;
        }
    });
    
    const topProjectElement = document.getElementById('topProjectText');
    if (bestProject && topProjectElement) {
        topProjectElement.textContent = 
            `${bestProject.name} - ${Math.round(maxProgress)}% Complete`;
    } else if (topProjectElement) {
        topProjectElement.textContent = 'No projects available';
    }
}

function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) {
        console.error('Project grid element not found');
        return;
    }
    
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    
    if (Object.keys(projects).length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-p); padding: 20px;">No projects found. Click "ADD PROJECT" to create your first project.</p>';
        return;
    }
    
    grid.innerHTML = '';
    
    const sortedProjects = Object.values(projects).sort((a, b) => {
        const timeA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(a.start);
        const timeB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(b.start);
        return timeB - timeA;
    });
    
    sortedProjects.slice(0, 3).forEach(project => {
        const dueDate = new Date(project.due);
        const now = new Date();
        const diff = dueDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        let countdownText = "No due date";
        if (!isNaN(days)) {
            if (days > 0) {
                countdownText = `${days} Days Remaining`;
            } else if (days === 0) {
                countdownText = "Due Today!";
            } else {
                countdownText = `${Math.abs(days)} Days Overdue`;
            }
        }
        
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = (e) => {
            if (!e.target.closest('.card-btn')) {
                openProject(project.id);
            }
        };
        card.innerHTML = `
            <div class="card-actions">
                <button class="card-btn" onclick="editProject('${project.id}', event)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="card-btn" onclick="deleteProject('${project.id}', event)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div style="display:flex; justify-content:space-between">
                <i class="${project.icon || 'fas fa-project-diagram'} fa-2x" style="color:var(--accent)"></i>
                <span class="status-badge">${project.status}</span>
            </div>
            <h3>${project.name}</h3>
            <p>${project.desc.substring(0, 100)}${project.desc.length > 100 ? '...' : ''}</p>
            <div><b>Lead:</b> ${project.lead}</div>
            <div><b>Due:</b> ${formatDate(project.due)}</div>
            <div><b>Last Updated:</b> ${project.lastUpdatedBy ? `By ${project.lastUpdatedBy}` : 'Never'}</div>
            <div class="countdown">${countdownText}</div>
        `;
        grid.appendChild(card);
    });
}

function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (e) {
        return 'Invalid date';
    }
}

function openProject(id) {
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        auth.recordActivity('view', `Viewed project "${projects[id].name}"`, id);
    }
    
    // Check if we're on the all-projects page
    if (window.location.pathname.includes('all-projects.html')) {
        // Store project ID and redirect to dashboard with hash
        localStorage.setItem('currentProjectView', id);
        window.location.href = '../index.html#project-view';
    } else {
        // On dashboard, show project view directly
        localStorage.setItem('currentProjectView', id);
        showProjectView(id);
    }
}

function showProjectView(id) {
    const projectView = document.getElementById('project-view');
    const landing = document.getElementById('landing');
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    const p = projects[id];
    
    if (!projectView || !p) return;
    
    if (landing) landing.style.display = 'none';
    
    let html = `
        <button class="back-btn" onclick="closeProject()"><i class="fas fa-chevron-left"></i> RETURN TO HUB</button>
        <div class="grid-layout">
            <div class="main-col">
                <div class="section-box">
                    <h2>1. Project Overview: ${p.name}</h2>
                    <p>${p.desc}</p>
                    <table>
                        <tr><th>Lead</th><td>${p.lead}</td><th>Type</th><td>${p.type}</td></tr>
                        <tr><th>Start</th><td>${formatDate(p.start)}</td><th>Status</th><td>${p.status}</td></tr>
                        <tr><th>Last Updated</th><td colspan="3">${p.lastUpdated ? formatDate(p.lastUpdated) + ' by ' + p.lastUpdatedBy : 'Never'}</td></tr>
                    </table>
                </div>

                <div class="section-box">
                    <h2>2. Task Allocation</h2>
                    <table>
                        <thead><tr><th>ID</th><th>Task</th><th>Assignee</th><th>Priority</th><th>Due Date</th><th>Status</th></tr></thead>
                        <tbody>
                            ${p.tasks && p.tasks.length > 0 ? p.tasks.map(t => `
                                <tr>
                                    <td>${t.id}</td>
                                    <td>${t.name}</td>
                                    <td>${t.who}</td>
                                    <td class="priority-high">${t.prio}</td>
                                    <td>${formatDate(t.due)}</td>
                                    <td>${t.status}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="6" style="text-align: center;">No tasks added yet</td></tr>'}
                        </tbody>
                    </table>
                </div>

                ${p.timeline && p.timeline.length > 0 ? `
                <div class="section-box">
                    <h2>3. Weekly Timeline & Progress</h2>
                    <table>
                        <thead><tr><th>Week</th><th>Range</th><th>Tasks Planned</th><th>Tasks Completed</th><th>Delays/Risks</th><th>Next Focus</th><th>Updated By</th></tr></thead>
                        <tbody>
                            ${p.timeline.map(t => `
                                <tr>
                                    <td>${t.wk}</td>
                                    <td>${t.range}</td>
                                    <td>${t.planned}</td>
                                    <td>${t.comp}</td>
                                    <td>${t.risk}</td>
                                    <td>${t.next}</td>
                                    <td><strong>${t.by || 'Unknown'}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : ''}
            </div>

            <div class="side-col">
                <div class="section-box">
                    <h2>4. Team Roles</h2>
                    ${p.members && p.members.length > 0 ? p.members.map(m => `
                        <div class="team-member">
                            <b>${m.name}</b>
                            <i>${m.role}</i>
                            <div style="font-size:0.8rem; margin-top:5px;">${m.resp}</div>
                            <div style="color:var(--accent); font-size:0.8rem;">${m.contact}</div>
                        </div>
                    `).join('') : '<p>No team members added yet</p>'}
                </div>
                <div class="section-box">
                    <h2>5. Notes</h2>
                    <p>${p.notes || 'No notes available.'}</p>
                </div>
            </div>
        </div>
    `;
    
    const projectContent = document.getElementById('project-content');
    if (projectContent) {
        projectContent.innerHTML = html;
    }
    
    projectView.style.display = 'block';
}

function closeProject() {
    document.getElementById('project-view').style.display = 'none';
    document.getElementById('landing').style.display = 'block';
    localStorage.removeItem('currentProjectView');
    window.location.hash = '';
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    if (slides.length === 0 || dots.length === 0) return;
    
    // Reset all slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (dots[index]) dots[index].classList.remove('active');
    });
    
    // Set first slide as active
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    
    updateWelcomeMessage();
    updateTopProject();
    
    // Clear existing interval
    clearInterval(window.slideInterval);
    
    // Set up new interval
    window.slideInterval = setInterval(() => {
        if (slides.length > 0) {
            if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            
            currentSlide = (currentSlide + 1) % slides.length;
            
            if (slides[currentSlide]) slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }
    }, 5000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    if (slides.length === 0) return;
    
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + 1) % slides.length;
    
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    
    clearInterval(window.slideInterval);
    window.slideInterval = setInterval(nextSlide, 5000);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    if (slides.length === 0 || index >= slides.length) return;
    
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    
    clearInterval(window.slideInterval);
    window.slideInterval = setInterval(nextSlide, 5000);
}

function updateWelcomeMessage() {
    const currentUser = auth.getCurrentUser();
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (currentUser && welcomeMessage) {
        const pendingTasks = getPendingTaskCount();
        welcomeMessage.textContent = `Welcome ${currentUser.username}, you have ${pendingTasks} tasks pending.`;
    }
}

function getPendingTaskCount() {
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    let total = 0;
    Object.values(projects).forEach(project => {
        if (project.tasks) {
            project.tasks.forEach(task => {
                if (task.status !== 'Completed') {
                    total++;
                }
            });
        }
    });
    return total;
}

// Helper function to show custom modal
function showCustomModal(title, message, type = 'info') {
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal ${type}">
            <div class="custom-modal-header">
                <h3>${title}</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>${message}</p>
            </div>
            <div class="custom-modal-footer">
                <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Make functions available globally
window.clockingSystem = clockingSystem;
window.showCustomModal = showCustomModal;
window.updateUserInfo = updateUserInfo;
window.updateTopProject = updateTopProject;
window.renderProjects = renderProjects;
window.openProject = openProject;
window.closeProject = closeProject;
window.showProjectView = showProjectView;
window.initHeroSlider = initHeroSlider;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;
window.updateWelcomeMessage = updateWelcomeMessage;
window.getPendingTaskCount = getPendingTaskCount;
window.formatDate = formatDate;
window.playNotificationSound = playNotificationSound;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/')) {
        setTimeout(initApp, 500);
    }
});