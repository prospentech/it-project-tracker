// team-duties.js
import auth from './auth.js';
import firebaseService from './firebase-service.js';

let duties = [];
let kpis = [];
let currentUser = null;

// Initialize duties and KPIs
async function initDuties() {
    currentUser = auth.getCurrentUser();
    await Promise.all([
        loadDuties(),
        loadKPIs()
    ]);
    
    // Subscribe to real-time updates
    firebaseService.subscribeToDuties((updatedDuties) => {
        duties = updatedDuties;
        renderDuties();
    });
    
    // Subscribe to KPI updates
    firebaseService.subscribeToKPIs((updatedKPIs) => {
        kpis = updatedKPIs;
        renderKPIs();
    });
    
    // Load tasks for performance data
    loadTasksForPerformance();
}

// Load duties from Firebase
async function loadDuties() {
    duties = await firebaseService.getDuties();
    return duties;
}

// Load KPIs from Firebase
async function loadKPIs() {
    kpis = await firebaseService.getKPIs();
    return kpis;
}

// Load tasks for performance calculations
async function loadTasksForPerformance() {
    const tasks = await firebaseService.getTasks();
    renderPerformanceDashboard(tasks);
}

// Render duties based on user role
function renderDuties() {
    const container = document.getElementById('dutiesContainer');
    if (!container) return;
    
    currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const isAdmin = currentUser.username === 'admin';
    
    // Filter duties based on user role
    let filteredDuties = duties;
    if (!isAdmin) {
        filteredDuties = duties.filter(duty => duty.userId === currentUser.username);
    }
    
    if (filteredDuties.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-tasks fa-4x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No duties found</h3>
                <p>Click "Add Duty" to add your duties.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="overflow-x: auto;">
            <table class="duties-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Duty Name</th>
                        <th>Description</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Period</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredDuties.forEach((duty, index) => {
        const dutyId = (index + 1).toString().padStart(3, '0');
        const statusClass = duty.status === 'Active' ? 'active' : 'inactive';
        
        html += `
            <tr onclick="viewDutyDetails('${duty.id}')">
                <td><strong>${dutyId}</strong></td>
                <td><strong style="color: var(--accent);">${duty.name || duty.role || 'Unnamed Duty'}</strong></td>
                <td>${duty.description || duty.role || 'N/A'}</td>
                <td>${duty.userName || duty.userId || 'Unassigned'}</td>
                <td><span class="status-badge ${statusClass}">${duty.status || 'Active'}</span></td>
                <td>${duty.period || 'Ongoing'}</td>
                <td>
                    <div style="display: flex; gap: 5px;" onclick="event.stopPropagation()">
                        <button class="small-btn" onclick="viewDutyDetails('${duty.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="small-btn" onclick="editDuty('${duty.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="small-btn" onclick="deleteDuty('${duty.id}')" title="Delete" style="background: var(--danger);">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Render KPIs table
function renderKPIs() {
    const container = document.getElementById('kpisContainer');
    if (!container) return;
    
    currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const isAdmin = currentUser.username === 'admin';
    
    // Filter KPIs based on user role
    let filteredKPIs = kpis;
    if (!isAdmin) {
        filteredKPIs = kpis.filter(kpi => kpi.userId === currentUser.username);
    }
    
    if (filteredKPIs.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-p);">
                <p>No KPIs found. Click "Add KPI" to create your first KPI.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="overflow-x: auto;">
            <table class="duties-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>KPI Name</th>
                        <th>Description</th>
                        <th>Assigned To</th>
                        <th>Period</th>
                        <th>Target Value</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredKPIs.forEach((kpi, index) => {
        const kpiId = (index + 1).toString().padStart(3, '0');
        const statusClass = kpi.status === 'Active' ? 'active' : 'inactive';
        
        html += `
            <tr onclick="viewKPIDetails('${kpi.id}')">
                <td><strong>${kpiId}</strong></td>
                <td><strong style="color: var(--accent);">${kpi.name}</strong></td>
                <td>${kpi.description || 'N/A'}</td>
                <td>${kpi.userName || kpi.userId || 'Unassigned'}</td>
                <td>${kpi.period || 'Ongoing'}</td>
                <td>${kpi.targetValue || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${kpi.status || 'Active'}</span></td>
                <td>
                    <div style="display: flex; gap: 5px;" onclick="event.stopPropagation()">
                        <button class="small-btn" onclick="viewKPIDetails('${kpi.id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="small-btn" onclick="editKPI('${kpi.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="small-btn" onclick="deleteKPI('${kpi.id}')" title="Delete" style="background: var(--danger);">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Render performance dashboard
async function renderPerformanceDashboard(tasks) {
    const dashboardContainer = document.getElementById('performanceDashboard');
    if (!dashboardContainer) return;
    
    currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const isAdmin = currentUser.username === 'admin';
    
    // Get all users
    const users = await firebaseService.getAllUsers();
    const userList = isAdmin ? users : users.filter(u => u.username === currentUser.username);
    
    // Calculate performance metrics for each user
    const userPerformance = [];
    const dutyStats = {};
    const kpiStats = {};
    
    for (const user of userList) {
        const userTasks = tasks.filter(t => t.assignedTo === user.username);
        const totalTasks = userTasks.length;
        const activeTasks = userTasks.filter(t => t.status === 'Active' || t.status === 'In Progress').length;
        const completedTasks = userTasks.filter(t => t.status === 'Completed').length;
        
        // Calculate overdue tasks
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const overdueTasks = userTasks.filter(t => {
            if (t.status === 'Completed' || t.status === 'Cancelled') return false;
            const dueDate = new Date(t.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate < now;
        }).length;
        
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Get active duties for this user
        const userDuties = duties.filter(d => d.userId === user.username && d.status === 'Active');
        const activeDuties = userDuties.length;
        
        // Store duty stats for duties overview
        userDuties.forEach(duty => {
            const dutyTasks = tasks.filter(t => t.dutyId === duty.id);
            const dutyCompleted = dutyTasks.filter(t => t.status === 'Completed').length;
            dutyStats[duty.id] = {
                name: duty.name || duty.role,
                assignedTo: user.username,
                activeTasks: dutyTasks.filter(t => t.status !== 'Completed').length,
                completedTasks: dutyCompleted
            };
        });
        
        // Get KPIs for this user
        const userKPIs = kpis.filter(k => k.userId === user.username && k.status === 'Active');
        userKPIs.forEach(kpi => {
            let kpiStatus = 'On Target';
            let statusColor = 'var(--success)';
            
            // Parse target value (e.g., "≥ 80%")
            const targetMatch = kpi.targetValue?.match(/([<>]=?)\s*(\d+)/);
            if (targetMatch && kpi.targetValue.includes('%')) {
                const operator = targetMatch[1];
                const targetPercent = parseInt(targetMatch[2]);
                
                if (operator === '≥' && completionRate < targetPercent) {
                    kpiStatus = 'Below Target';
                    statusColor = 'var(--danger)';
                } else if (operator === '>' && completionRate <= targetPercent) {
                    kpiStatus = 'Below Target';
                    statusColor = 'var(--danger)';
                } else if (operator === '<' && completionRate >= targetPercent) {
                    kpiStatus = 'Below Target';
                    statusColor = 'var(--danger)';
                }
            }
            
            kpiStats[user.username] = {
                kpiName: kpi.name,
                targetValue: kpi.targetValue,
                currentRate: completionRate,
                status: kpiStatus,
                statusColor: statusColor
            };
        });
        
        userPerformance.push({
            username: user.username,
            fullName: user.fullName || user.username,
            totalTasks,
            activeTasks,
            completedTasks,
            overdueTasks,
            completionRate,
            activeDuties
        });
    }
    
    // Calculate overall stats
    const totalTasks = tasks.length;
    const totalActive = tasks.filter(t => t.status === 'Active' || t.status === 'In Progress').length;
    const totalCompleted = tasks.filter(t => t.status === 'Completed').length;
    const totalOverdue = tasks.filter(t => {
        if (t.status === 'Completed' || t.status === 'Cancelled') return false;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < now;
    }).length;
    const overallCompletionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
    
    // Build dashboard HTML
    let html = `
        <!-- Top Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-tasks"></i></div>
                <div class="stat-number">${totalTasks}</div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-play-circle" style="color: var(--accent);"></i></div>
                <div class="stat-number">${totalActive}</div>
                <div class="stat-label">Active Tasks</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-check-circle" style="color: var(--success);"></i></div>
                <div class="stat-number">${totalCompleted}</div>
                <div class="stat-label">Completed Tasks</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i></div>
                <div class="stat-number">${totalOverdue}</div>
                <div class="stat-label">Overdue Tasks</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                <div class="stat-number">${overallCompletionRate}%</div>
                <div class="stat-label">Completion Rate</div>
            </div>
        </div>
        
        <!-- User Performance Table -->
        <div class="section-box" style="margin-bottom: 30px;">
            <h3><i class="fas fa-users"></i> User Performance</h3>
            <div style="overflow-x: auto;">
                <table class="duties-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Total Tasks</th>
                            <th>Active</th>
                            <th>Completed</th>
                            <th>Overdue</th>
                            <th>Completion Rate</th>
                            <th>Active Duties</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    userPerformance.forEach(user => {
        const rateColor = user.completionRate >= 80 ? 'var(--success)' : 
                         user.completionRate >= 50 ? 'var(--warning)' : 'var(--danger)';
        
        html += `
            <tr>
                <td><strong style="color: var(--accent);">${user.fullName}</strong></td>
                <td>${user.totalTasks}</td>
                <td>${user.activeTasks}</td>
                <td>${user.completedTasks}</td>
                <td><span style="color: var(--danger);">${user.overdueTasks}</span></td>
                <td><strong style="color: ${rateColor};">${user.completionRate}%</strong></td>
                <td>${user.activeDuties}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Charts Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <!-- Task Status Breakdown -->
            <div class="section-box">
                <h3><i class="fas fa-chart-pie"></i> Task Status Breakdown</h3>
                <div id="taskStatusChart" style="height: 200px; margin-top: 15px;">
    `;
    
    // Simple bar chart representation
    const activeCount = tasks.filter(t => t.status === 'Active' || t.status === 'In Progress').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const onHoldCount = tasks.filter(t => t.status === 'On Hold').length;
    const cancelledCount = tasks.filter(t => t.status === 'Cancelled').length;
    const overdueCount = totalOverdue;
    const maxCount = Math.max(activeCount, completedCount, onHoldCount, cancelledCount, overdueCount, 1);
    
    html += `
                    <div style="display: flex; gap: 10px; align-items: flex-end; height: 150px;">
                        <div style="flex: 1; text-align: center;">
                            <div style="background: var(--accent); height: ${(activeCount / maxCount) * 120}px; border-radius: 4px;"></div>
                            <div style="margin-top: 5px; font-size: 0.8rem;">Active (${activeCount})</div>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <div style="background: var(--success); height: ${(completedCount / maxCount) * 120}px; border-radius: 4px;"></div>
                            <div style="margin-top: 5px; font-size: 0.8rem;">Completed (${completedCount})</div>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <div style="background: var(--warning); height: ${(onHoldCount / maxCount) * 120}px; border-radius: 4px;"></div>
                            <div style="margin-top: 5px; font-size: 0.8rem;">On Hold (${onHoldCount})</div>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <div style="background: #94a3b8; height: ${(cancelledCount / maxCount) * 120}px; border-radius: 4px;"></div>
                            <div style="margin-top: 5px; font-size: 0.8rem;">Cancelled (${cancelledCount})</div>
                        </div>
                        <div style="flex: 1; text-align: center;">
                            <div style="background: var(--danger); height: ${(overdueCount / maxCount) * 120}px; border-radius: 4px;"></div>
                            <div style="margin-top: 5px; font-size: 0.8rem;">Overdue (${overdueCount})</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tasks by Type of Work -->
            <div class="section-box">
                <h3><i class="fas fa-chart-bar"></i> Tasks by Type</h3>
                <div id="taskTypeChart" style="height: 200px; margin-top: 15px;">
    `;
    
    // Group tasks by type
    const taskTypes = {};
    tasks.forEach(t => {
        const type = t.type || 'General';
        taskTypes[type] = (taskTypes[type] || 0) + 1;
    });
    
    const typeNames = Object.keys(taskTypes);
    const typeCounts = Object.values(taskTypes);
    const maxTypeCount = Math.max(...typeCounts, 1);
    
    typeNames.slice(0, 5).forEach((type, index) => {
        const count = taskTypes[type];
        const colors = ['var(--accent)', 'var(--success)', 'var(--warning)', '#a855f7', '#ec4899'];
        const color = colors[index % colors.length];
        
        html += `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 120px; font-size: 0.9rem;">${type}:</div>
                        <div style="flex: 1; height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden;">
                            <div style="background: ${color}; width: ${(count / maxTypeCount) * 100}%; height: 100%;"></div>
                        </div>
                        <div style="min-width: 40px; text-align: right;">${count}</div>
                    </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </div>
        
        <!-- Duties Overview -->
        <div class="section-box" style="margin-bottom: 30px;">
            <h3><i class="fas fa-tasks"></i> Duties Overview</h3>
            <div style="overflow-x: auto;">
                <table class="duties-table">
                    <thead>
                        <tr>
                            <th>Duty</th>
                            <th>Assigned To</th>
                            <th>Active Tasks</th>
                            <th>Completed Tasks</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    const dutyEntries = Object.entries(dutyStats);
    if (dutyEntries.length === 0) {
        html += `<tr><td colspan="4" style="text-align: center;">No duties with linked tasks</td></tr>`;
    } else {
        dutyEntries.forEach(([dutyId, stats]) => {
            html += `
                <tr>
                    <td><strong style="color: var(--accent);">${stats.name}</strong></td>
                    <td>${stats.assignedTo}</td>
                    <td>${stats.activeTasks}</td>
                    <td>${stats.completedTasks}</td>
                </tr>
            `;
        });
    }
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- KPI Performance Section -->
        <div class="section-box" style="margin-bottom: 30px;">
            <h3><i class="fas fa-bullseye"></i> KPI Performance</h3>
            <div style="overflow-x: auto;">
                <table class="duties-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>KPI Target</th>
                            <th>Current Rate</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    const kpiEntries = Object.entries(kpiStats);
    if (kpiEntries.length === 0) {
        html += `<tr><td colspan="4" style="text-align: center;">No active KPIs found</td></tr>`;
    } else {
        kpiEntries.forEach(([username, stats]) => {
            html += `
                <tr>
                    <td><strong style="color: var(--accent);">${username}</strong></td>
                    <td>${stats.kpiName}: ${stats.targetValue}</td>
                    <td>${stats.currentRate}%</td>
                    <td><span style="color: ${stats.statusColor}; font-weight: bold;">${stats.status}</span></td>
                </tr>
            `;
        });
    }
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Alerts Section -->
        <div class="section-box" style="margin-bottom: 30px; border-left: 4px solid var(--danger);">
            <h3><i class="fas fa-exclamation-circle" style="color: var(--danger);"></i> Alerts & Warnings</h3>
    `;
    
    // High priority active tasks
    const highPriorityTasks = tasks.filter(t => 
        (t.priority === 'High' || t.priority === 'Critical' || t.priority === 'Urgent') && 
        t.status !== 'Completed' && t.status !== 'Cancelled'
    );
    
    // Tasks due in 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(0, 0, 0, 0);
    
    const tasksDueSoon = tasks.filter(t => {
        if (t.status === 'Completed' || t.status === 'Cancelled') return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays > 0;
    });
    
    if (highPriorityTasks.length > 0) {
        html += `
            <div style="margin-bottom: 15px;">
                <h4 style="color: var(--danger); margin-bottom: 10px;">🔴 High Priority Active Tasks (${highPriorityTasks.length})</h4>
                <ul style="color: var(--text-p);">
        `;
        highPriorityTasks.slice(0, 5).forEach(task => {
            html += `<li>${task.title} - Assigned to: ${task.assignedTo || 'Unassigned'}</li>`;
        });
        if (highPriorityTasks.length > 5) {
            html += `<li>...and ${highPriorityTasks.length - 5} more</li>`;
        }
        html += `</ul>`;
    }
    
    if (totalOverdue > 0) {
        html += `
            <div style="margin-bottom: 15px;">
                <h4 style="color: var(--danger); margin-bottom: 10px;">🔴 Overdue Tasks (${totalOverdue})</h4>
            </div>
        `;
    }
    
    if (tasksDueSoon.length > 0) {
        html += `
            <div style="margin-bottom: 15px;">
                <h4 style="color: var(--warning); margin-bottom: 10px;">🟡 Tasks Due in 3 Days (${tasksDueSoon.length})</h4>
                <ul style="color: var(--text-p);">
        `;
        tasksDueSoon.slice(0, 5).forEach(task => {
            const dueDate = new Date(task.dueDate).toLocaleDateString();
            html += `<li>${task.title} - Due: ${dueDate} - Assigned to: ${task.assignedTo || 'Unassigned'}</li>`;
        });
        if (tasksDueSoon.length > 5) {
            html += `<li>...and ${tasksDueSoon.length - 5} more</li>`;
        }
        html += `</ul>`;
    }
    
    if (highPriorityTasks.length === 0 && totalOverdue === 0 && tasksDueSoon.length === 0) {
        html += `<p style="color: var(--success);">✅ No alerts at this time. All tasks are on track.</p>`;
    }
    
    html += `</div>`;
    
    dashboardContainer.innerHTML = html;
    
    // Render monthly trend graph
    renderMonthlyTrend(tasks);
}

// Render monthly trend graph
function renderMonthlyTrend(tasks) {
    const container = document.getElementById('monthlyTrendChart');
    if (!container) return;
    
    // Group tasks by month (last 6 months)
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            name: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            start: new Date(month.getFullYear(), month.getMonth(), 1),
            end: new Date(month.getFullYear(), month.getMonth() + 1, 0)
        });
    }
    
    const monthlyData = months.map(month => {
        const monthTasks = tasks.filter(t => {
            const createdDate = new Date(t.createdAt || t.startDate || t.dueDate);
            return createdDate >= month.start && createdDate <= month.end;
        });
        
        const total = monthTasks.length;
        const completed = monthTasks.filter(t => t.status === 'Completed').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
            month: month.name,
            total,
            completed,
            rate: completionRate
        };
    });
    
    const maxRate = Math.max(...monthlyData.map(d => d.rate), 50);
    
    let html = `
        <div style="display: flex; gap: 10px; align-items: flex-end; height: 150px; margin-top: 20px;">
    `;
    
    monthlyData.forEach(data => {
        const height = data.rate > 0 ? (data.rate / maxRate) * 120 : 0;
        html += `
            <div style="flex: 1; text-align: center;">
                <div style="background: var(--accent); height: ${height}px; border-radius: 4px;"></div>
                <div style="margin-top: 5px; font-size: 0.8rem;">${data.month}</div>
                <div style="font-size: 0.8rem; font-weight: bold;">${data.rate}%</div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    container.innerHTML = html;
}

// View duty details
function viewDutyDetails(dutyId) {
    const duty = duties.find(d => d.id === dutyId);
    if (!duty) return;
    
    const detailView = document.getElementById('dutyDetailView');
    const content = document.getElementById('dutyDetailContent');
    
    // Load tasks linked to this duty
    firebaseService.getTasks().then(tasks => {
        const linkedTasks = tasks.filter(t => t.dutyId === dutyId);
        const activeTasks = linkedTasks.filter(t => t.status !== 'Completed').length;
        const completedTasks = linkedTasks.filter(t => t.status === 'Completed').length;
        
        let html = `
            <div class="grid-layout">
                <div class="main-col">
                    <div class="detail-section">
                        <h2><i class="fas fa-info-circle"></i> Duty Information</h2>
                        <div class="detail-row"><span class="detail-label">Duty ID:</span><span class="detail-value">${duty.id?.substring(0, 8) || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Duty Name:</span><span class="detail-value">${duty.name || duty.role || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Description:</span><span class="detail-value">${duty.description || duty.role || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Assigned To:</span><span class="detail-value">${duty.userName || duty.userId || 'Unassigned'}</span></div>
                        <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value"><span class="status-badge ${duty.status === 'Active' ? 'active' : 'inactive'}">${duty.status || 'Active'}</span></span></div>
                        <div class="detail-row"><span class="detail-label">Period:</span><span class="detail-value">${duty.period || 'Ongoing'}</span></div>
                    </div>
                    
                    <div class="detail-section">
                        <h2><i class="fas fa-tasks"></i> Linked Tasks</h2>
                        <div class="detail-row"><span class="detail-label">Total Tasks:</span><span class="detail-value">${linkedTasks.length}</span></div>
                        <div class="detail-row"><span class="detail-label">Active Tasks:</span><span class="detail-value">${activeTasks}</span></div>
                        <div class="detail-row"><span class="detail-label">Completed Tasks:</span><span class="detail-value">${completedTasks}</span></div>
                        <div class="detail-row"><span class="detail-label">Completion Rate:</span><span class="detail-value">${linkedTasks.length > 0 ? Math.round((completedTasks / linkedTasks.length) * 100) : 0}%</span></div>
                    </div>
                    
                    <div class="detail-section">
                        <h2><i class="fas fa-history"></i> Metadata</h2>
                        <div class="detail-row"><span class="detail-label">Created:</span><span class="detail-value">${duty.createdAt ? new Date(duty.createdAt).toLocaleString() : 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Created By:</span><span class="detail-value">${duty.createdBy || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Last Updated:</span><span class="detail-value">${duty.lastUpdated ? new Date(duty.lastUpdated).toLocaleString() : 'N/A'}</span></div>
                    </div>
                </div>
                
                <div class="side-col">
                    <div class="detail-section">
                        <h2><i class="fas fa-cog"></i> Quick Actions</h2>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button class="control-btn" onclick="editDuty('${duty.id}')" style="width: 100%;">
                                <i class="fas fa-edit"></i> Edit Duty
                            </button>
                            <button class="control-btn" onclick="viewTasksForDuty('${duty.id}')" style="width: 100%;">
                                <i class="fas fa-tasks"></i> View Linked Tasks
                            </button>
                            <button class="control-btn" style="background: var(--danger); width: 100%;" onclick="deleteDuty('${duty.id}')">
                                <i class="fas fa-trash"></i> Delete Duty
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        content.innerHTML = html;
        detailView.classList.add('show');
    });
}

// View KPI details
function viewKPIDetails(kpiId) {
    const kpi = kpis.find(k => k.id === kpiId);
    if (!kpi) return;
    
    const detailView = document.getElementById('kpiDetailView');
    const content = document.getElementById('kpiDetailContent');
    
    // Get user's current completion rate
    firebaseService.getTasks().then(tasks => {
        const userTasks = tasks.filter(t => t.assignedTo === kpi.userId);
        const completedTasks = userTasks.filter(t => t.status === 'Completed').length;
        const completionRate = userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0;
        
        // Determine if target is met
        let targetMet = false;
        let targetStatus = 'Unknown';
        let statusColor = 'var(--text-p)';
        
        const targetMatch = kpi.targetValue?.match(/([<>]=?)\s*(\d+)/);
        if (targetMatch && kpi.targetValue.includes('%')) {
            const operator = targetMatch[1];
            const targetPercent = parseInt(targetMatch[2]);
            
            if (operator === '≥' && completionRate >= targetPercent) {
                targetMet = true;
                targetStatus = 'Target Met';
                statusColor = 'var(--success)';
            } else if (operator === '>' && completionRate > targetPercent) {
                targetMet = true;
                targetStatus = 'Target Met';
                statusColor = 'var(--success)';
            } else if (operator === '<' && completionRate < targetPercent) {
                targetMet = true;
                targetStatus = 'Target Met';
                statusColor = 'var(--success)';
            } else {
                targetStatus = 'Below Target';
                statusColor = 'var(--danger)';
            }
        }
        
        let html = `
            <div class="grid-layout">
                <div class="main-col">
                    <div class="detail-section">
                        <h2><i class="fas fa-info-circle"></i> KPI Information</h2>
                        <div class="detail-row"><span class="detail-label">KPI ID:</span><span class="detail-value">${kpi.id?.substring(0, 8) || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">KPI Name:</span><span class="detail-value">${kpi.name}</span></div>
                        <div class="detail-row"><span class="detail-label">Description:</span><span class="detail-value">${kpi.description || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Assigned To:</span><span class="detail-value">${kpi.userName || kpi.userId || 'Unassigned'}</span></div>
                        <div class="detail-row"><span class="detail-label">Period:</span><span class="detail-value">${kpi.period || 'Ongoing'}</span></div>
                        <div class="detail-row"><span class="detail-label">Target Value:</span><span class="detail-value">${kpi.targetValue || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value"><span class="status-badge ${kpi.status === 'Active' ? 'active' : 'inactive'}">${kpi.status || 'Active'}</span></span></div>
                    </div>
                    
                    <div class="detail-section">
                        <h2><i class="fas fa-chart-line"></i> Current Performance</h2>
                        <div class="detail-row"><span class="detail-label">Current Completion Rate:</span><span class="detail-value">${completionRate}%</span></div>
                        <div class="detail-row"><span class="detail-label">KPI Status:</span><span class="detail-value"><span style="color: ${statusColor}; font-weight: bold;">${targetStatus}</span></span></div>
                        <div class="detail-row"><span class="detail-label">Total User Tasks:</span><span class="detail-value">${userTasks.length}</span></div>
                        <div class="detail-row"><span class="detail-label">Completed Tasks:</span><span class="detail-value">${completedTasks}</span></div>
                    </div>
                    
                    <div class="detail-section">
                        <h2><i class="fas fa-history"></i> Metadata</h2>
                        <div class="detail-row"><span class="detail-label">Created:</span><span class="detail-value">${kpi.createdAt ? new Date(kpi.createdAt).toLocaleString() : 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Created By:</span><span class="detail-value">${kpi.createdBy || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Last Updated:</span><span class="detail-value">${kpi.lastUpdated ? new Date(kpi.lastUpdated).toLocaleString() : 'N/A'}</span></div>
                    </div>
                </div>
                
                <div class="side-col">
                    <div class="detail-section">
                        <h2><i class="fas fa-cog"></i> Quick Actions</h2>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button class="control-btn" onclick="editKPI('${kpi.id}')" style="width: 100%;">
                                <i class="fas fa-edit"></i> Edit KPI
                            </button>
                            <button class="control-btn" style="background: var(--danger); width: 100%;" onclick="deleteKPI('${kpi.id}')">
                                <i class="fas fa-trash"></i> Delete KPI
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        content.innerHTML = html;
        detailView.classList.add('show');
    });
}

// View tasks for duty
function viewTasksForDuty(dutyId) {
    // Navigate to tasks page with duty filter
    window.location.href = `tasks.html?duty=${dutyId}`;
}

// Close duty detail view
function closeDutyDetail() {
    document.getElementById('dutyDetailView').classList.remove('show');
}

// Close KPI detail view
function closeKPIDetail() {
    document.getElementById('kpiDetailView').classList.remove('show');
}

// Open duty modal for add/edit
function openDutyModal(dutyId = null) {
    const modal = document.getElementById('dutyModal');
    if (!modal) {
        showCustomModal('Error', 'Duty modal not found', 'danger');
        return;
    }
    
    const title = document.getElementById('dutyModalTitle');
    const form = document.getElementById('dutyForm');
    
    // Populate users dropdown
    populateUsersDropdown('dutyAssignedTo');
    
    if (dutyId) {
        const duty = duties.find(d => d.id === dutyId);
        title.textContent = 'Edit Duty';
        document.getElementById('dutyId').value = dutyId;
        document.getElementById('dutyName').value = duty.name || duty.role || '';
        document.getElementById('dutyDescription').value = duty.description || duty.role || '';
        document.getElementById('dutyAssignedTo').value = duty.userId || '';
        document.getElementById('dutyStatus').value = duty.status || 'Active';
        document.getElementById('dutyPeriod').value = duty.period || '';
        
        // Populate tasks
        const tasksContainer = document.getElementById('dutyTasksContainer');
        tasksContainer.innerHTML = '';
        if (duty.tasks && duty.tasks.length > 0) {
            duty.tasks.forEach((task, index) => {
                addTaskField(task);
            });
        } else {
            addTaskField();
        }
    } else {
        title.textContent = 'Add New Duty';
        form.reset();
        document.getElementById('dutyId').value = '';
        document.getElementById('dutyStatus').value = 'Active';
        document.getElementById('dutyPeriod').value = 'Ongoing';
        
        // Clear and add one empty task field
        const tasksContainer = document.getElementById('dutyTasksContainer');
        tasksContainer.innerHTML = '';
        addTaskField();
    }
    
    modal.style.display = 'flex';
}

// Open KPI modal for add/edit
function openKPIModal(kpiId = null) {
    const modal = document.getElementById('kpiModal');
    if (!modal) {
        showCustomModal('Error', 'KPI modal not found', 'danger');
        return;
    }
    
    const title = document.getElementById('kpiModalTitle');
    const form = document.getElementById('kpiForm');
    
    // Populate users dropdown
    populateUsersDropdown('kpiAssignedTo');
    
    if (kpiId) {
        const kpi = kpis.find(k => k.id === kpiId);
        title.textContent = 'Edit KPI';
        document.getElementById('kpiId').value = kpiId;
        document.getElementById('kpiName').value = kpi.name || '';
        document.getElementById('kpiDescription').value = kpi.description || '';
        document.getElementById('kpiAssignedTo').value = kpi.userId || '';
        document.getElementById('kpiPeriod').value = kpi.period || '';
        document.getElementById('kpiTargetValue').value = kpi.targetValue || '';
        document.getElementById('kpiStatus').value = kpi.status || 'Active';
    } else {
        title.textContent = 'Add New KPI';
        form.reset();
        document.getElementById('kpiId').value = '';
        document.getElementById('kpiStatus').value = 'Active';
        document.getElementById('kpiPeriod').value = 'Ongoing';
        document.getElementById('kpiTargetValue').value = '≥ 80%';
    }
    
    modal.style.display = 'flex';
}

// Close duty modal
function closeDutyModal() {
    document.getElementById('dutyModal').style.display = 'none';
}

// Close KPI modal
function closeKPIModal() {
    document.getElementById('kpiModal').style.display = 'none';
}

// Populate users dropdown
function populateUsersDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    const users = [
        { username: 'admin', fullName: 'admin' },
        { username: 'Junior', fullName: 'Junior' },
        { username: 'Buhle', fullName: 'Buhle' },
        { username: 'AJay', fullName: 'AJay' }
    ];
    
    select.innerHTML = '<option value="">Select User</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = user.fullName;
        select.appendChild(option);
    });
}

// Add task field to modal
function addTaskField(value = '') {
    const container = document.getElementById('dutyTasksContainer');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.style.display = 'flex';
    taskDiv.style.gap = '10px';
    taskDiv.style.marginBottom = '10px';
    
    taskDiv.innerHTML = `
        <input type="text" class="duty-task" value="${value.replace(/"/g, '&quot;')}" placeholder="Enter task" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: var(--text-h);">
        <button type="button" class="small-btn" onclick="this.parentElement.remove()" title="Remove" style="background: var(--danger);">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    container.appendChild(taskDiv);
}

// Save duty
async function saveDuty(event) {
    event.preventDefault();
    
    currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to save duties', 'danger');
        return;
    }
    
    const dutyId = document.getElementById('dutyId').value;
    const name = document.getElementById('dutyName').value;
    const description = document.getElementById('dutyDescription').value;
    const assignedTo = document.getElementById('dutyAssignedTo').value;
    const status = document.getElementById('dutyStatus').value;
    const period = document.getElementById('dutyPeriod').value;
    
    // Collect all tasks
    const taskInputs = document.querySelectorAll('.duty-task');
    const tasks = [];
    taskInputs.forEach(input => {
        if (input.value.trim()) {
            tasks.push(input.value.trim());
        }
    });
    
    if (tasks.length === 0) {
        showCustomModal('Error', 'Please add at least one task', 'danger');
        return;
    }
    
    const duty = {
        id: dutyId || null,
        name: name,
        description: description,
        userId: assignedTo,
        userName: assignedTo ? (assignedTo === 'admin' ? 'admin' : assignedTo) : currentUser.username,
        status: status,
        period: period,
        tasks: tasks,
        createdBy: currentUser.username,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    const result = await firebaseService.saveDuty(duty);
    
    if (result.success) {
        closeDutyModal();
        showCustomModal('Success', 'Duty saved successfully!', 'success');
        await loadDuties();
        loadTasksForPerformance();
    } else {
        showCustomModal('Error', 'Failed to save duty: ' + result.error, 'danger');
    }
}

// Save KPI
async function saveKPI(event) {
    event.preventDefault();
    
    currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to save KPIs', 'danger');
        return;
    }
    
    const kpiId = document.getElementById('kpiId').value;
    const name = document.getElementById('kpiName').value;
    const description = document.getElementById('kpiDescription').value;
    const assignedTo = document.getElementById('kpiAssignedTo').value;
    const period = document.getElementById('kpiPeriod').value;
    const targetValue = document.getElementById('kpiTargetValue').value;
    const status = document.getElementById('kpiStatus').value;
    
    if (!assignedTo) {
        showCustomModal('Error', 'Please select a user', 'danger');
        return;
    }
    
    const kpi = {
        id: kpiId || null,
        name: name,
        description: description,
        userId: assignedTo,
        userName: assignedTo === 'admin' ? 'admin' : assignedTo,
        period: period,
        targetValue: targetValue,
        status: status,
        createdBy: currentUser.username,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    const result = await firebaseService.saveKPI(kpi);
    
    if (result.success) {
        closeKPIModal();
        showCustomModal('Success', 'KPI saved successfully!', 'success');
        await loadKPIs();
        loadTasksForPerformance();
    } else {
        showCustomModal('Error', 'Failed to save KPI: ' + result.error, 'danger');
    }
}

// Delete duty
async function deleteDuty(id, event) {
    if (event) event.stopPropagation();
    
    const duty = duties.find(d => d.id === id);
    const dutyName = duty?.name || duty?.role || 'this duty';
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal danger">
            <div class="custom-modal-header">
                <h3>Confirm Delete</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>Are you sure you want to delete "${dutyName}"? This action cannot be undone.</p>
            </div>
            <div class="custom-modal-footer">
                <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                <button class="btn-primary" style="background: var(--danger);" onclick="confirmDeleteDuty('${id}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function confirmDeleteDuty(id) {
    const result = await firebaseService.deleteDuty(id);
    
    document.querySelector('.custom-modal-overlay').remove();
    
    if (result.success) {
        showCustomModal('Success', 'Duty deleted successfully!', 'success');
        await loadDuties();
        loadTasksForPerformance();
    } else {
        showCustomModal('Error', 'Failed to delete duty: ' + result.error, 'danger');
    }
}

// Delete KPI
async function deleteKPI(id, event) {
    if (event) event.stopPropagation();
    
    const kpi = kpis.find(k => k.id === id);
    const kpiName = kpi?.name || 'this KPI';
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal danger">
            <div class="custom-modal-header">
                <h3>Confirm Delete</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>Are you sure you want to delete KPI "${kpiName}"? This action cannot be undone.</p>
            </div>
            <div class="custom-modal-footer">
                <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                <button class="btn-primary" style="background: var(--danger);" onclick="confirmDeleteKPI('${id}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function confirmDeleteKPI(id) {
    const result = await firebaseService.deleteKPI(id);
    
    document.querySelector('.custom-modal-overlay').remove();
    
    if (result.success) {
        showCustomModal('Success', 'KPI deleted successfully!', 'success');
        await loadKPIs();
        loadTasksForPerformance();
    } else {
        showCustomModal('Error', 'Failed to delete KPI: ' + result.error, 'danger');
    }
}

// Edit duty
function editDuty(id, event) {
    if (event) event.stopPropagation();
    closeDutyDetail();
    openDutyModal(id);
}

// Edit KPI
function editKPI(id, event) {
    if (event) event.stopPropagation();
    closeKPIDetail();
    openKPIModal(id);
}

// Show custom modal
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
window.initDuties = initDuties;
window.renderDuties = renderDuties;
window.renderKPIs = renderKPIs;
window.renderPerformanceDashboard = renderPerformanceDashboard;
window.openDutyModal = openDutyModal;
window.closeDutyModal = closeDutyModal;
window.openKPIModal = openKPIModal;
window.closeKPIModal = closeKPIModal;
window.saveDuty = saveDuty;
window.saveKPI = saveKPI;
window.editDuty = editDuty;
window.editKPI = editKPI;
window.deleteDuty = deleteDuty;
window.deleteKPI = deleteKPI;
window.confirmDeleteDuty = confirmDeleteDuty;
window.confirmDeleteKPI = confirmDeleteKPI;
window.addTaskField = addTaskField;
window.viewDutyDetails = viewDutyDetails;
window.viewKPIDetails = viewKPIDetails;
window.closeDutyDetail = closeDutyDetail;
window.closeKPIDetail = closeKPIDetail;
window.viewTasksForDuty = viewTasksForDuty;

export {
    initDuties,
    renderDuties,
    renderKPIs,
    renderPerformanceDashboard,
    openDutyModal,
    closeDutyModal,
    openKPIModal,
    closeKPIModal,
    saveDuty,
    saveKPI,
    editDuty,
    editKPI,
    deleteDuty,
    deleteKPI,
    confirmDeleteDuty,
    confirmDeleteKPI,
    addTaskField,
    viewDutyDetails,
    viewKPIDetails,
    closeDutyDetail,
    closeKPIDetail,
    viewTasksForDuty
};