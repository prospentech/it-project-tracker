// Authentication and user management
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        const userData = localStorage.getItem('currentUser');
        
        // Get current page
        const currentPage = window.location.pathname;
        const isLoginPage = currentPage.includes('login.html');
        const isRootPage = currentPage === '/' || currentPage.includes('index.html');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
            
            // Update session duration
            setInterval(() => {
                this.updateSessionDuration();
            }, 60000);
            
            // Update last active
            setInterval(() => {
                this.updateUserLastActive();
            }, 30000);
            
            // Record login activity
            this.recordActivity('login', 'User logged in');
            
            // Play login sound
            this.playSound('loginSound');
            
        } else if (!isLoginPage && !isRootPage) {
            // Only redirect if not on login page and not on root/index page
            window.location.href = 'login.html';
        }
    }

    logout() {
        if (this.currentUser) {
            // Record logout activity
            this.recordActivity('logout', 'User logged out');
            
            // Play logout sound
            this.playSound('logoutSound');
            
            // Calculate session duration
            const loginTime = new Date(this.currentUser.loginTime);
            const logoutTime = new Date();
            const duration = Math.round((logoutTime - loginTime) / 1000 / 60);
            
            // Store session duration
            let sessions = JSON.parse(localStorage.getItem('userSessions')) || [];
            sessions.push({
                user: this.currentUser.username,
                loginTime: this.currentUser.loginTime,
                logoutTime: logoutTime.toISOString(),
                duration: duration
            });
            localStorage.setItem('userSessions', JSON.stringify(sessions.slice(0, 50)));
            
            // Update current sessions
            let currentSessions = JSON.parse(localStorage.getItem('currentSessions')) || {};
            if (currentSessions[this.currentUser.username]) {
                currentSessions[this.currentUser.username].online = false;
                currentSessions[this.currentUser.username].logoutTime = logoutTime.toISOString();
                localStorage.setItem('currentSessions', JSON.stringify(currentSessions));
            }
            
            // Auto clock out if needed
            this.autoClockOut();
        }
        
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    playSound(soundId) {
        try {
            const sound = document.getElementById(soundId);
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => console.log("Audio play failed:", e));
            }
        } catch (e) {
            console.log("Sound error:", e);
        }
    }

    autoClockOut() {
        if (!this.currentUser) return;
        
        let clockingStatus = JSON.parse(localStorage.getItem('clockingStatus_' + this.currentUser.username)) || {
            clockedIn: false,
            clockInTime: null,
            clockOutTime: null,
            lastClockDate: null
        };
        
        if (clockingStatus.clockedIn && clockingStatus.clockInTime) {
            clockingStatus.clockedIn = false;
            clockingStatus.clockOutTime = new Date().toISOString();
            
            const clockInTime = new Date(clockingStatus.clockInTime);
            const clockOutTime = new Date(clockingStatus.clockOutTime);
            const diffMs = clockOutTime - clockInTime;
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            let history = JSON.parse(localStorage.getItem('clockingHistory_' + this.currentUser.username)) || [];
            history.unshift({
                date: new Date().toDateString(),
                clockIn: clockInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                clockOut: clockOutTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                duration: `${hours}h ${minutes}m`,
                type: 'Auto clock-out on logout'
            });
            localStorage.setItem('clockingHistory_' + this.currentUser.username, JSON.stringify(history.slice(0, 100)));
            
            localStorage.setItem('clockingStatus_' + this.currentUser.username, JSON.stringify(clockingStatus));
            
            this.recordActivity('clock_out', `Auto clocked out after ${hours}h ${minutes}m`);
        }
    }

    updateSessionDuration() {
        if (this.currentUser && this.currentUser.loginTime) {
            const loginTime = new Date(this.currentUser.loginTime);
            const currentTime = new Date();
            const duration = Math.round((currentTime - loginTime) / 1000 / 60);
            
            let currentSessions = JSON.parse(localStorage.getItem('currentSessions')) || {};
            currentSessions[this.currentUser.username] = {
                ...currentSessions[this.currentUser.username],
                username: this.currentUser.username,
                loginTime: this.currentUser.loginTime,
                currentDuration: duration,
                lastActive: currentTime.toISOString(),
                online: true
            };
            localStorage.setItem('currentSessions', JSON.stringify(currentSessions));
        }
    }

    updateUserLastActive() {
        if (this.currentUser) {
            let currentSessions = JSON.parse(localStorage.getItem('currentSessions')) || {};
            currentSessions[this.currentUser.username] = {
                ...currentSessions[this.currentUser.username],
                username: this.currentUser.username,
                lastActive: new Date().toISOString(),
                online: true
            };
            localStorage.setItem('currentSessions', JSON.stringify(currentSessions));
        }
    }

    recordActivity(action, details, projectId = null) {
        if (!this.currentUser) return;

        const activity = {
            user: this.currentUser.username,
            action: action,
            details: details,
            projectId: projectId,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString()
        };
        
        let activities = JSON.parse(localStorage.getItem('userActivities')) || [];
        activities.unshift(activity);
        
        localStorage.setItem('userActivities', JSON.stringify(activities.slice(0, 500)));
        
        if (window.updateStatsDisplay) {
            window.updateStatsDisplay();
        }
        
        if (projectId) {
            const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
            if (projects[projectId]) {
                projects[projectId].lastUpdated = new Date().toISOString();
                projects[projectId].lastUpdatedBy = this.currentUser.username;
                localStorage.setItem('prospenProjects', JSON.stringify(projects));
            }
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getSessionDuration() {
        if (!this.currentUser || !this.currentUser.loginTime) return 0;
        
        const loginTime = new Date(this.currentUser.loginTime);
        const currentTime = new Date();
        return Math.round((currentTime - loginTime) / 1000 / 60);
    }
    
    getUserProfile(username) {
        const profiles = JSON.parse(localStorage.getItem('prospenProfiles')) || {};
        return profiles[username] || {
            fullName: username.charAt(0).toUpperCase() + username.slice(1),
            email: `${username}@prospentech.co.za`,
            bio: `${username} user`,
            avatar: null,
            role: 'User'
        };
    }
}

const auth = new AuthSystem();

// Update user activity on various events
document.addEventListener('click', () => {
    if (auth && auth.updateUserLastActive) {
        auth.updateUserLastActive();
    }
});

document.addEventListener('keypress', () => {
    if (auth && auth.updateUserLastActive) {
        auth.updateUserLastActive();
    }
});

window.auth = auth;