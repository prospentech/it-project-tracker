// Statistics and history module
class StatsSystem {
    constructor() {
        this.statsInterval = null;
        this.init();
    }

    init() {
        // Update stats display every 30 seconds
        this.statsInterval = setInterval(() => {
            this.updateRealTimeStats();
        }, 30000);
    }

    getActivities() {
        return JSON.parse(localStorage.getItem('userActivities')) || [];
    }

    getSessions() {
        return JSON.parse(localStorage.getItem('userSessions')) || [];
    }

    getCurrentSessions() {
        return JSON.parse(localStorage.getItem('currentSessions')) || {};
    }

    getStatsByUser(user) {
        const activities = this.getActivities();
        const userActivities = activities.filter(a => a.user === user);
        
        // Get user sessions
        const sessions = this.getSessions().filter(s => s.user === user);
        const currentSession = this.getCurrentSessions()[user];
        
        // Calculate active session duration
        let currentDuration = 0;
        if (currentSession && currentSession.loginTime) {
            const loginTime = new Date(currentSession.loginTime);
            const currentTime = new Date();
            currentDuration = Math.round((currentTime - loginTime) / 1000 / 60);
        }
        
        // Calculate total session time
        let totalSessionTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
        if (currentDuration > 0) {
            totalSessionTime += currentDuration;
        }
        
        return {
            totalActions: userActivities.length,
            lastLogin: this.getLastLogin(user),
            todayActions: this.getTodayActions(user),
            favoriteAction: this.getMostCommonAction(user),
            sessionCount: sessions.length + (currentSession ? 1 : 0),
            avgSessionDuration: sessions.length > 0 ? Math.round(totalSessionTime / (sessions.length + (currentSession ? 1 : 0))) : 0,
            currentSessionDuration: currentDuration,
            isOnline: currentSession ? currentSession.online : false
        };
    }

    getLastLogin(user) {
        const activities = this.getActivities();
        const logins = activities.filter(a => a.user === user && a.action === 'login');
        return logins.length > 0 ? this.formatDate(new Date(logins[0].timestamp)) : 'Never';
    }

    formatDate(date) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    getTodayActions(user) {
        const activities = this.getActivities();
        const today = new Date().toLocaleDateString();
        return activities.filter(a => a.user === user && a.date === today).length;
    }

    getMostCommonAction(user) {
        const activities = this.getActivities();
        const userActivities = activities.filter(a => a.user === user);
        
        const actionCounts = {};
        userActivities.forEach(a => {
            actionCounts[a.action] = (actionCounts[a.action] || 0) + 1;
        });
        
        let maxAction = '';
        let maxCount = 0;
        Object.entries(actionCounts).forEach(([action, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxAction = action;
            }
        });
        
        return maxAction.charAt(0).toUpperCase() + maxAction.slice(1);
    }

    updateRealTimeStats() {
        if (window.updateStatsDisplay) {
            window.updateStatsDisplay();
        }
    }

    getRecentUpdates() {
        const activities = this.getActivities();
        return activities
            .filter(a => a.action.includes('update') || a.action.includes('edit') || 
                     a.action === 'login' || a.action === 'logout' || 
                     a.action === 'create' || a.action === 'delete' || 
                     a.action === 'view' || a.action.includes('post') ||
                     a.action.includes('profile') || a.action.includes('avatar') ||
                     a.action === 'comment')
            .slice(0, 20); // Last 20 updates
    }

    getUserOnlineStatus() {
        const currentSessions = this.getCurrentSessions();
        const users = ['admin', 'Junior', 'Buhle', 'AJay'];
        const status = {};
        
        users.forEach(user => {
            if (currentSessions[user]) {
                const lastActive = new Date(currentSessions[user].lastActive);
                const now = new Date();
                const minutesSinceActive = Math.round((now - lastActive) / 1000 / 60);
                
                status[user] = {
                    online: currentSessions[user].online && minutesSinceActive < 5, // Consider online if active in last 5 minutes
                    lastActive: this.formatDate(new Date(currentSessions[user].lastActive)),
                    duration: currentSessions[user].currentDuration || 0,
                    sessionStart: this.formatDate(new Date(currentSessions[user].loginTime || currentSessions[user].lastActive))
                };
            } else {
                // Check if user has any recent activity
                const activities = this.getActivities();
                const userActivities = activities.filter(a => a.user === user);
                const lastActivity = userActivities[0];
                
                status[user] = { 
                    online: false, 
                    lastActive: lastActivity ? this.formatDate(new Date(lastActivity.timestamp)) : 'Never',
                    duration: 0, 
                    sessionStart: null 
                };
            }
        });
        
        return status;
    }
    
    getProjectStats() {
        const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
        const projectList = Object.values(projects);
        
        const now = new Date();
        
        return {
            totalProjects: projectList.length,
            activeProjects: projectList.filter(p => p.status === 'In Progress').length,
            completedProjects: projectList.filter(p => p.status === 'Completed').length,
            overdueProjects: projectList.filter(p => {
                if (!p.due) return false;
                const dueDate = new Date(p.due);
                return dueDate < now && p.status !== 'Completed';
            }).length,
            recentProjects: projectList.filter(p => {
                if (!p.lastUpdated) return false;
                const lastUpdated = new Date(p.lastUpdated);
                const daysDiff = Math.round((now - lastUpdated) / (1000 * 60 * 60 * 24));
                return daysDiff <= 7; // Projects updated in last 7 days
            }).length
        };
    }
    
    getTopContributors() {
        const activities = this.getActivities();
        const userCounts = {};
        
        activities.forEach(activity => {
            userCounts[activity.user] = (userCounts[activity.user] || 0) + 1;
        });
        
        // Convert to array and sort
        return Object.entries(userCounts)
            .map(([user, count]) => ({ user, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4); // Top 4 contributors
    }
}

// Initialize stats system
const statsSystem = new StatsSystem();

// Global function to update stats display
window.updateStatsDisplay = function() {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;

    const activities = statsSystem.getActivities();
    const recentUpdates = statsSystem.getRecentUpdates();
    const onlineStatus = statsSystem.getUserOnlineStatus();
    const projectStats = statsSystem.getProjectStats();
    const topContributors = statsSystem.getTopContributors();

    let html = `
        <div class="section-box">
            <h2><i class="fas fa-tachometer-alt"></i> System Overview</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                <div style="background: rgba(56, 189, 248, 0.1); padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid var(--accent);">
                    <h3 style="margin: 0 0 10px 0; color: var(--accent);">Total Projects</h3>
                    <div style="font-size: 2rem; font-weight: bold;">${projectStats.totalProjects}</div>
                </div>
                <div style="background: rgba(34, 197, 94, 0.1); padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid var(--success);">
                    <h3 style="margin: 0 0 10px 0; color: var(--success);">Active</h3>
                    <div style="font-size: 2rem; font-weight: bold;">${projectStats.activeProjects}</div>
                </div>
                <div style="background: rgba(239, 68, 68, 0.1); padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid var(--danger);">
                    <h3 style="margin: 0 0 10px 0; color: var(--danger);">Overdue</h3>
                    <div style="font-size: 2rem; font-weight: bold;">${projectStats.overdueProjects}</div>
                </div>
                <div style="background: rgba(168, 85, 247, 0.1); padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #a855f7;">
                    <h3 style="margin: 0 0 10px 0; color: #a855f7;">Completed</h3>
                    <div style="font-size: 2rem; font-weight: bold;">${projectStats.completedProjects}</div>
                </div>
            </div>
        </div>

        <div class="section-box">
            <h2><i class="fas fa-users"></i> User Online Status</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
    `;

    // Online status cards
    Object.entries(onlineStatus).forEach(([user, data]) => {
        html += `
            <div class="user-status-card" style="background: ${data.online ? 'rgba(34, 197, 94, 0.1)' : 'rgba(148, 163, 184, 0.1)'}; padding: 15px; border-radius: 10px; border-left: 4px solid ${data.online ? '#22c55e' : '#94a3b8'}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: var(--accent);">${user}</strong>
                    <span style="color: ${data.online ? '#22c55e' : '#94a3b8'}; font-size: 0.8rem;">
                        <i class="fas fa-circle" style="font-size: 0.6rem;"></i>
                        ${data.online ? 'Online' : 'Offline'}
                    </span>
                </div>
                ${data.online ? `
                    <div style="font-size: 0.8rem; color: var(--text-p); margin-top: 8px;">
                        <i class="fas fa-clock"></i> Current Session: ${data.duration} min
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-p); margin-top: 4px;">
                        <i class="fas fa-play-circle"></i> Started: ${data.sessionStart}
                    </div>
                ` : `
                    <div style="font-size: 0.8rem; color: var(--text-p); margin-top: 8px;">
                        <i class="fas fa-clock"></i> Last active: ${data.lastActive}
                    </div>
                `}
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <div class="section-box">
            <h2><i class="fas fa-trophy"></i> Top Contributors</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
    `;

    topContributors.forEach((contributor, index) => {
        const colors = ['#38bdf8', '#22c55e', '#f59e0b', '#a855f7'];
        const color = colors[index] || '#6b7280';
        html += `
            <div style="background: ${color}20; padding: 15px; border-radius: 10px; border-left: 4px solid ${color};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: ${color};">${index + 1}. ${contributor.user}</strong>
                    <span style="background: ${color}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">${contributor.count} actions</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-p); margin-top: 8px;">
                    <i class="fas fa-chart-line"></i> Active contributor
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <div class="section-box">
            <h2><i class="fas fa-history"></i> Recent Activity Timeline</h2>
            <div style="margin-top: 15px;">
    `;

    if (recentUpdates.length > 0) {
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>Project</th>
                    </tr>
                </thead>
                <tbody>
        `;

        recentUpdates.forEach(activity => {
            html += `
                <tr>
                    <td>${activity.time}</td>
                    <td><strong>${activity.user}</strong></td>
                    <td><span class="status-badge" style="background: ${getActionColor(activity.action)}">${activity.action.replace('_', ' ')}</span></td>
                    <td>${activity.details}</td>
                    <td>${activity.projectId || '-'}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;
    } else {
        html += `<p style="text-align: center; color: var(--text-p);">No recent activity</p>`;
    }

    html += `
            </div>
        </div>

        <div class="section-box">
            <h2><i class="fas fa-chart-bar"></i> User Statistics</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 15px;">
    `;

    const users = ['admin', 'Junior', 'Buhle', 'AJay'];
    users.forEach(user => {
        const userStats = statsSystem.getStatsByUser(user);
        html += `
            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="color: var(--accent); margin: 0;">${user}</h3>
                    <span style="color: ${userStats.isOnline ? '#22c55e' : '#94a3b8'}; font-size: 0.8rem;">
                        <i class="fas fa-circle" style="font-size: 0.6rem;"></i>
                        ${userStats.isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>
                <div style="font-size: 0.9rem;">
                    <div style="margin-bottom: 8px;">
                        <i class="fas fa-tasks"></i> Total Actions: <strong>${userStats.totalActions}</strong>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <i class="fas fa-calendar-day"></i> Today's Actions: <strong>${userStats.todayActions}</strong>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <i class="fas fa-star"></i> Most Common: <strong>${userStats.favoriteAction || 'None'}</strong>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <i class="fas fa-sign-in-alt"></i> Sessions: <strong>${userStats.sessionCount}</strong>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <i class="fas fa-clock"></i> Avg Session: <strong>${userStats.avgSessionDuration} min</strong>
                    </div>
                    ${userStats.isOnline ? `
                        <div style="margin-bottom: 8px;">
                            <i class="fas fa-play-circle"></i> Current: <strong>${userStats.currentSessionDuration} min</strong>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
        
        <div class="section-box">
            <h2><i class="fas fa-info-circle"></i> Statistics Information</h2>
            <p style="color: var(--text-p); font-size: 0.9rem;">
                <i class="fas fa-sync-alt"></i> Statistics update every 30 seconds<br>
                <i class="fas fa-database"></i> Tracking all user activities across the system<br>
                <i class="fas fa-user-check"></i> Online status based on activity within last 5 minutes<br>
                <i class="fas fa-project-diagram"></i> Project stats include all team members' contributions
            </p>
        </div>
    `;

    statsContainer.innerHTML = html;
};

// Helper function for action colors
function getActionColor(action) {
    const colors = {
        'login': '#22c55e',
        'logout': '#ef4444',
        'update': '#3b82f6',
        'edit': '#8b5cf6',
        'create': '#10b981',
        'delete': '#dc2626',
        'view': '#6b7280',
        'update_post': '#f59e0b',
        'profile_update': '#ec4899',
        'avatar_update': '#8b5cf6',
        'comment': '#0ea5e9'
    };
    return colors[action] || '#6b7280';
}

// Make it available globally
window.getActionColor = getActionColor;