// Authentication and user management
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            
            // Update session duration
            setInterval(() => {
                this.updateSessionDuration();
            }, 60000); // Every minute
            
            // Update last active
            setInterval(() => {
                this.updateUserLastActive();
            }, 30000); // Every 30 seconds
        } else if (!window.location.pathname.includes('login.html')) {
            // Redirect to login if not on login page
            window.location.href = 'login.html';
        }
    }

    logout() {
        if (this.currentUser) {
            // Record logout activity
            this.recordActivity('logout', 'User logged out');
            
            // Calculate session duration
            const loginTime = new Date(this.currentUser.loginTime);
            const logoutTime = new Date();
            const duration = Math.round((logoutTime - loginTime) / 1000 / 60); // in minutes
            
            // Store session duration
            let sessions = JSON.parse(localStorage.getItem('userSessions')) || [];
            sessions.push({
                user: this.currentUser.username,
                loginTime: this.currentUser.loginTime,
                logoutTime: logoutTime.toISOString(),
                duration: duration
            });
            localStorage.setItem('userSessions', JSON.stringify(sessions.slice(0, 50))); // Keep last 50
            
            // Remove from current sessions
            let currentSessions = JSON.parse(localStorage.getItem('currentSessions')) || {};
            delete currentSessions[this.currentUser.username];
            localStorage.setItem('currentSessions', JSON.stringify(currentSessions));
        }
        
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    updateSessionDuration() {
        if (this.currentUser && this.currentUser.loginTime) {
            const loginTime = new Date(this.currentUser.loginTime);
            const currentTime = new Date();
            const duration = Math.round((currentTime - loginTime) / 1000 / 60); // in minutes
            
            // Update current session duration in localStorage
            let currentSessions = JSON.parse(localStorage.getItem('currentSessions')) || {};
            currentSessions[this.currentUser.username] = {
                ...currentSessions[this.currentUser.username],
                loginTime: this.currentUser.loginTime,
                currentDuration: duration,
                lastActive: currentTime.toISOString()
            };
            localStorage.setItem('currentSessions', JSON.stringify(currentSessions));
        }
    }

    updateUserLastActive() {
        if (this.currentUser) {
            let currentSessions = JSON.parse(localStorage.getItem('currentSessions')) || {};
            currentSessions[this.currentUser.username] = {
                ...currentSessions[this.currentUser.username],
                lastActive: new Date().toISOString()
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
        activities.unshift(activity); // Add to beginning
        
        // Keep only last 500 activities
        localStorage.setItem('userActivities', JSON.stringify(activities.slice(0, 500)));
        
        // Trigger real-time update for stats page
        if (window.updateStatsDisplay) {
            window.updateStatsDisplay();
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getSessionDuration() {
        if (!this.currentUser || !this.currentUser.loginTime) return 0;
        
        const loginTime = new Date(this.currentUser.loginTime);
        const currentTime = new Date();
        return Math.round((currentTime - loginTime) / 1000 / 60); // in minutes
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

// Initialize auth system
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