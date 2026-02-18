// tasks.js
import auth from './auth.js';
import firebaseService from './firebase-service.js';

let tasks = [];
let users = [];
let projects = [];

// Initialize tasks
async function initTasks() {
    await loadTasks();
    await loadUsers();
    await loadProjects();
    
    // Subscribe to real-time updates
    firebaseService.subscribeToTasks((updatedTasks) => {
        tasks = updatedTasks;
        checkOverdueTasks();
        renderTasks();
        renderWeeklyTasks();
    });
}

// Load tasks from Firebase
async function loadTasks() {
    tasks = await firebaseService.getTasks();
    return tasks;
}

// Load users from Firebase
async function loadUsers() {
    users = await firebaseService.getAllUsers();
    return users;
}

// Load projects from Firebase
async function loadProjects() {
    projects = await firebaseService.getProjects();
    return projects;
}

// Check for overdue tasks
function checkOverdueTasks() {
    const now = new Date();
    let updated = false;
    
    tasks.forEach(task => {
        if (task.status !== 'Completed' && task.status !== 'Overdue') {
            const dueDate = new Date(task.dueDate);
            if (dueDate < now) {
                task.status = 'Overdue';
                updated = true;
                
                // Save to Firebase
                firebaseService.saveTask(task);
            }
        }
    });
    
    if (updated) {
        localStorage.setItem('prospenTasks', JSON.stringify(tasks));
    }
}

// Calculate working duration between start and completion dates
function calculateWorkingDuration(startDate, completionDate) {
    const start = new Date(startDate);
    const end = new Date(completionDate);
    
    // Working hours: 07:30 to 16:30 (9 hours per day)
    const WORK_START = 7.5; // 7:30 AM
    const WORK_END = 16.5; // 4:30 PM
    const WORK_HOURS_PER_DAY = 9;
    
    let totalMinutes = 0;
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
        // Check if it's a weekday (Monday = 1, Friday = 5)
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            let startTime = WORK_START;
            let endTime = WORK_END;
            
            // If it's the start day, adjust start time
            if (currentDate.toDateString() === start.toDateString()) {
                startTime = start.getHours() + (start.getMinutes() / 60);
                if (startTime < WORK_START) startTime = WORK_START;
                if (startTime > WORK_END) startTime = WORK_END;
            }
            
            // If it's the end day, adjust end time
            if (currentDate.toDateString() === end.toDateString()) {
                endTime = end.getHours() + (end.getMinutes() / 60);
                if (endTime > WORK_END) endTime = WORK_END;
                if (endTime < WORK_START) endTime = WORK_START;
            }
            
            // Add working hours for this day
            if (endTime > startTime) {
                totalMinutes += (endTime - startTime) * 60;
            }
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(WORK_START, 0, 0, 0);
    }
    
    return Math.round(totalMinutes / 60 * 10) / 10; // Return hours with 1 decimal
}

// Generate task ID (TASK-00001 format)
function generateTaskId() {
    const maxId = tasks.reduce((max, task) => {
        if (task.taskId && task.taskId.startsWith('TASK-')) {
            const num = parseInt(task.taskId.split('-')[1]);
            return num > max ? num : max;
        }
        return max;
    }, 0);
    
    const nextNum = maxId + 1;
    return `TASK-${nextNum.toString().padStart(5, '0')}`;
}

// Render weekly tasks on dashboard
function renderWeeklyTasks() {
    const container = document.getElementById('weeklyTasksContainer');
    if (!container) return;
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const isAdmin = currentUser.username === 'admin';
    
    // Get current week range
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Filter tasks for this week
    let weeklyTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate || task.date);
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
    });
    
    // Filter by user if not admin
    if (!isAdmin) {
        weeklyTasks = weeklyTasks.filter(task => task.assignedTo === currentUser.username);
    }
    
    // Update summary cards
    updateTaskSummary(weeklyTasks);
    
    if (weeklyTasks.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-p);">
                <i class="fas fa-check-circle fa-4x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No tasks this week</h3>
                <p>Click "Add New Task" to create your first task.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    weeklyTasks.slice(0, 3).forEach(task => {
        const card = createTaskCard(task, isAdmin);
        container.appendChild(card);
    });
}

// Update task summary cards
function updateTaskSummary(tasks) {
    const container = document.getElementById('taskSummaryContainer');
    if (!container) return;
    
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Not Started').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const overdue = tasks.filter(t => t.status === 'Overdue').length;
    
    container.innerHTML = `
        <div style="background: rgba(56, 189, 248, 0.1); padding: 15px; border-radius: 10px; text-align: center; border-left: 4px solid var(--accent);">
            <div style="color: var(--accent); font-size: 0.9rem;">Total</div>
            <div style="font-size: 1.8rem; font-weight: bold;">${total}</div>
        </div>
        <div style="background: rgba(34, 197, 94, 0.1); padding: 15px; border-radius: 10px; text-align: center; border-left: 4px solid var(--success);">
            <div style="color: var(--success); font-size: 0.9rem;">Completed</div>
            <div style="font-size: 1.8rem; font-weight: bold;">${completed}</div>
        </div>
        <div style="background: rgba(245, 158, 11, 0.1); padding: 15px; border-radius: 10px; text-align: center; border-left: 4px solid var(--warning);">
            <div style="color: var(--warning); font-size: 0.9rem;">In Progress</div>
            <div style="font-size: 1.8rem; font-weight: bold;">${inProgress}</div>
        </div>
        <div style="background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 10px; text-align: center; border-left: 4px solid var(--danger);">
            <div style="color: var(--danger); font-size: 0.9rem;">Overdue</div>
            <div style="font-size: 1.8rem; font-weight: bold;">${overdue}</div>
        </div>
    `;
}

// Create task card
function createTaskCard(task, isAdmin) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openTaskDetail(task.id);
    
    const dueDate = new Date(task.dueDate || task.date);
    const now = new Date();
    const diff = dueDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const statusColors = {
        'Not Started': '#94a3b8',
        'In Progress': '#f59e0b',
        'Completed': '#22c55e',
        'Overdue': '#ef4444',
        'On Hold': '#a855f7'
    };
    
    const priorityColors = {
        'Low': '#94a3b8',
        'Medium': '#f59e0b',
        'High': '#ef4444',
        'Critical': '#dc2626'
    };
    
    card.innerHTML = `
        <div class="card-actions">
            <button class="card-btn" onclick="editTask('${task.id}', event)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="card-btn" onclick="deleteTask('${task.id}', event)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="color: var(--text-p); font-size: 0.8rem;">${task.taskId || 'TASK-00000'}</span>
            <span style="background: ${priorityColors[task.priority] || '#94a3b8'}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.7rem;">${task.priority || 'Medium'}</span>
        </div>
        <h3 style="margin: 10px 0;">${task.title}</h3>
        <p>${task.description ? task.description.substring(0, 80) + '...' : 'No description'}</p>
        <div><b>Project:</b> ${getProjectName(task.relatedProjectId)}</div>
        <div><b>Assigned to:</b> ${getUserFullName(task.assignedTo)}</div>
        <div><b>Due:</b> ${formatDate(task.dueDate)}</div>
        <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="background: ${statusColors[task.status] || '#94a3b8'}; color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">${task.status}</span>
            ${days <= 3 && task.status !== 'Completed' ? `<span class="countdown" style="margin:0;">${days > 0 ? days + 'd left' : days === 0 ? 'Due today' : Math.abs(days) + 'd overdue'}</span>` : ''}
        </div>
        ${task.status === 'In Progress' ? `
            <button class="small-btn" onclick="markTaskComplete('${task.id}', event)" style="width:100%; margin-top:10px; background: var(--success);">
                <i class="fas fa-check"></i> Mark Complete
            </button>
        ` : ''}
    `;
    
    return card;
}

// Populate users dropdown with full names
function populateUsersDropdown() {
    const select = document.getElementById('taskAssignedTo');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select User</option>';
    
    // Get all users from the system
    const allUsers = [
        { username: 'admin', fullName: 'Administrator' },
        { username: 'Junior', fullName: 'Junior' },
        { username: 'Buhle', fullName: 'Buhle' },
        { username: 'AJay', fullName: 'AJay' }
    ];
    
    // Try to get from firebase if available
    if (users && users.length > 0) {
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.fullName || user.username;
            select.appendChild(option);
        });
    } else {
        allUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.fullName;
            select.appendChild(option);
        });
    }
}

// Populate projects dropdown
function populateProjectsDropdown() {
    const select = document.getElementById('taskRelatedProject');
    if (!select) return;
    
    select.innerHTML = '<option value="">None</option>';
    
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    Object.values(projects).forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
}

// Render tasks on tasks page with pagination and filters
let currentPage = 1;
const tasksPerPage = 20;
let currentFilter = 'all';
let filterValue = '';

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    if (!container) return;
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const isAdmin = currentUser.username === 'admin';
    
    // Filter tasks based on user role
    let filteredTasks = tasks;
    if (!isAdmin) {
        filteredTasks = tasks.filter(task => task.assignedTo === currentUser.username);
    }
    
    // Apply date filters
    const now = new Date();
    const today = now.toDateString();
    
    if (currentFilter === 'today') {
        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.dueDate || task.date);
            return taskDate.toDateString() === today;
        });
    } else if (currentFilter === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.dueDate || task.date);
            return taskDate >= sevenDaysAgo;
        });
    } else if (currentFilter === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.dueDate || task.date);
            return taskDate >= thirtyDaysAgo;
        });
    }
    
    // Apply category filter
    if (currentFilter === 'category' && filterValue) {
        filteredTasks = filteredTasks.filter(task => task.category === filterValue);
    }
    
    // Apply priority filter
    if (currentFilter === 'priority' && filterValue) {
        filteredTasks = filteredTasks.filter(task => task.priority === filterValue);
    }
    
    // Apply status filter
    if (currentFilter === 'status' && filterValue) {
        filteredTasks = filteredTasks.filter(task => task.status === filterValue);
    }
    
    // Apply project filter
    if (currentFilter === 'project' && filterValue) {
        filteredTasks = filteredTasks.filter(task => task.relatedProjectId === filterValue);
    }
    
    // Apply user filter (admin only)
    if (currentFilter === 'user' && filterValue && isAdmin) {
        filteredTasks = filteredTasks.filter(task => task.assignedTo === filterValue);
    }
    
    // Calculate statistics
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Compare with previous month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.dueDate || task.date);
        return taskDate.getMonth() === lastMonth.getMonth() && 
               taskDate.getFullYear() === lastMonth.getFullYear();
    });
    const lastMonthCompleted = lastMonthTasks.filter(t => t.status === 'Completed').length;
    const lastMonthRate = lastMonthTasks.length > 0 ? Math.round((lastMonthCompleted / lastMonthTasks.length) * 100) : 0;
    
    // Pagination
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const startIndex = (currentPage - 1) * tasksPerPage;
    const paginatedTasks = filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).slice(startIndex, startIndex + tasksPerPage);
    
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-tasks fa-4x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No tasks found</h3>
                <button class="control-btn" onclick="openTaskModal()" style="margin-top: 20px;">
                    <i class="fas fa-plus"></i> Add Task
                </button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="stats-header" style="margin-bottom: 20px; flex-wrap: wrap;">
            <div>
                <h3>Task Overview</h3>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <span style="background: rgba(56, 189, 248, 0.1); padding: 5px 10px; border-radius: 5px;">
                        Completion Rate: <strong>${completionRate}%</strong>
                    </span>
                    <span style="background: rgba(56, 189, 248, 0.1); padding: 5px 10px; border-radius: 5px;">
                        vs Last Month: <strong style="color: ${completionRate >= lastMonthRate ? 'var(--success)' : 'var(--danger)'}">
                            ${completionRate >= lastMonthRate ? '+' : ''}${completionRate - lastMonthRate}%
                        </strong>
                    </span>
                </div>
            </div>
            <div class="stats-controls" style="flex-wrap: wrap;">
                <select class="control-btn" onchange="applyFilter('date', this.value)" style="min-width: 120px;">
                    <option value="all">All Tasks</option>
                    <option value="today">Today's Tasks</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                </select>
                
                <select class="control-btn" onchange="applyFilter('category', this.value)" style="min-width: 120px;">
                    <option value="">All Categories</option>
                    <option value="Design">Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Web">Web</option>
                    <option value="IT">IT</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="General">General</option>
                </select>
                
                <select class="control-btn" onchange="applyFilter('priority', this.value)" style="min-width: 120px;">
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
                
                <select class="control-btn" onchange="applyFilter('status', this.value)" style="min-width: 120px;">
                    <option value="">All Status</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Overdue">Overdue</option>
                </select>
                
                <select class="control-btn" onchange="applyFilter('project', this.value)" style="min-width: 120px;" id="projectFilter">
                    <option value="">All Projects</option>
    `;
    
    // Add project options
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    Object.values(projects).forEach(project => {
        html += `<option value="${project.id}">${project.name}</option>`;
    });
    
    if (isAdmin) {
        html += `
                </select>
                
                <select class="control-btn" onchange="applyFilter('user', this.value)" style="min-width: 120px;">
                    <option value="">All Users</option>
        `;
        
        // Add user options
        const allUsers = [
            { username: 'admin', fullName: 'Administrator' },
            { username: 'Junior', fullName: 'Junior' },
            { username: 'Buhle', fullName: 'Buhle' },
            { username: 'AJay', fullName: 'AJay' }
        ];
        
        allUsers.forEach(user => {
            html += `<option value="${user.username}">${user.fullName}</option>`;
        });
    }
    
    html += `
                </select>
                
                <button class="control-btn" onclick="openTaskModal()">
                    <i class="fas fa-plus"></i> Add Task
                </button>
            </div>
        </div>
        
        <!-- Task Summary -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-bottom: 30px;">
            <div style="background: rgba(56, 189, 248, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="color: var(--accent); font-size: 0.9rem;">Total</div>
                <div style="font-size: 1.8rem; font-weight: bold;">${filteredTasks.length}</div>
            </div>
            <div style="background: rgba(34, 197, 94, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="color: var(--success); font-size: 0.9rem;">Completed</div>
                <div style="font-size: 1.8rem; font-weight: bold;">${completedTasks}</div>
            </div>
            <div style="background: rgba(245, 158, 11, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="color: var(--warning); font-size: 0.9rem;">In Progress</div>
                <div style="font-size: 1.8rem; font-weight: bold;">${filteredTasks.filter(t => t.status === 'In Progress').length}</div>
            </div>
            <div style="background: rgba(148, 163, 184, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="color: #94a3b8; font-size: 0.9rem;">Not Started</div>
                <div style="font-size: 1.8rem; font-weight: bold;">${filteredTasks.filter(t => t.status === 'Not Started').length}</div>
            </div>
            <div style="background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="color: var(--danger); font-size: 0.9rem;">Overdue</div>
                <div style="font-size: 1.8rem; font-weight: bold;">${filteredTasks.filter(t => t.status === 'Overdue').length}</div>
            </div>
        </div>
        
        <!-- Tasks Table -->
        <table>
            <thead>
                <tr>
                    <th>Task ID</th>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Project</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    paginatedTasks.forEach(task => {
        const statusColors = {
            'Not Started': '#94a3b8',
            'In Progress': '#f59e0b',
            'Completed': '#22c55e',
            'Overdue': '#ef4444',
            'On Hold': '#a855f7'
        };
        
        const priorityColors = {
            'Low': '#94a3b8',
            'Medium': '#f59e0b',
            'High': '#ef4444',
            'Critical': '#dc2626'
        };
        
        html += `
            <tr onclick="openTaskDetail('${task.id}')" style="cursor: pointer;">
                <td><strong>${task.taskId || 'TASK-00000'}</strong></td>
                <td>${task.title}</td>
                <td>${formatDate(task.dueDate)}</td>
                <td><span style="background: ${statusColors[task.status] || '#94a3b8'}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.7rem;">${task.status}</span></td>
                <td><span style="color: ${priorityColors[task.priority] || '#94a3b8'}; font-weight: bold;">${task.priority || 'Medium'}</span></td>
                <td>${getProjectName(task.relatedProjectId)}</td>
                <td>${getUserFullName(task.assignedTo)}</td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        <button class="small-btn" onclick="editTask('${task.id}', event)" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${task.status !== 'Completed' ? `
                            <button class="small-btn" onclick="markTaskComplete('${task.id}', event)" title="Mark Complete" style="background: var(--success);">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        <button class="small-btn" onclick="deleteTask('${task.id}', event)" title="Delete" style="background: var(--danger);">
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
        
        <!-- Pagination -->
        <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
            <button class="small-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Previous
            </button>
            <span style="padding: 5px 10px;">Page ${currentPage} of ${totalPages}</span>
            <button class="small-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

function applyFilter(type, value) {
    currentFilter = type;
    filterValue = value;
    currentPage = 1;
    renderTasks();
}

function changePage(page) {
    if (page < 1) return;
    const filteredTasks = getFilteredTasks();
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    if (page > totalPages) return;
    currentPage = page;
    renderTasks();
}

function getFilteredTasks() {
    const currentUser = auth.getCurrentUser();
    const isAdmin = currentUser.username === 'admin';
    let filteredTasks = tasks;
    
    if (!isAdmin) {
        filteredTasks = tasks.filter(task => task.assignedTo === currentUser.username);
    }
    
    const now = new Date();
    const today = now.toDateString();
    
    if (currentFilter === 'today') {
        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.dueDate || task.date);
            return taskDate.toDateString() === today;
        });
    } else if (currentFilter === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.dueDate || task.date);
            return taskDate >= sevenDaysAgo;
        });
    } else if (currentFilter === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.dueDate || task.date);
            return taskDate >= thirtyDaysAgo;
        });
    }
    
    if (currentFilter === 'category' && filterValue) {
        filteredTasks = filteredTasks.filter(task => task.category === filterValue);
    }
    
    if (currentFilter === 'priority' && filterValue) {
        filteredTasks = filteredTasks.filter(task => task.priority === filterValue);
    }
    
    if (currentFilter === 'status' && filterValue) {
        filteredTasks = filteredTasks.filter(task => task.status === filterValue);
    }
    
    if (currentFilter === 'project' && filterValue) {
        filteredTasks = filteredTasks.filter(task => task.relatedProjectId === filterValue);
    }
    
    if (currentFilter === 'user' && filterValue && isAdmin) {
        filteredTasks = filteredTasks.filter(task => task.assignedTo === filterValue);
    }
    
    return filteredTasks;
}

// Open task detail view
function openTaskDetail(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const profiles = JSON.parse(localStorage.getItem('prospenProfiles')) || {};
    const assignedUser = users.find(u => u.username === task.assignedTo);
    const createdByUser = users.find(u => u.username === task.createdBy);
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal" style="max-width: 700px;">
            <div class="custom-modal-header">
                <h3>Task Details - ${task.taskId || 'TASK-00000'}</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body" style="max-height: 70vh; overflow-y: auto;">
                <h2 style="color: var(--accent); margin-top: 0;">${task.title}</h2>
                <p style="color: var(--text-p); white-space: pre-wrap;">${task.description || 'No description'}</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                    <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                        <div style="color: var(--accent); font-size: 0.8rem;">Category</div>
                        <div style="font-weight: bold;">${task.category || 'General'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                        <div style="color: var(--accent); font-size: 0.8rem;">Priority</div>
                        <div style="font-weight: bold; color: ${task.priority === 'High' || task.priority === 'Critical' ? 'var(--danger)' : 'var(--text-h)'}">${task.priority || 'Medium'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                        <div style="color: var(--accent); font-size: 0.8rem;">Status</div>
                        <div style="font-weight: bold;">${task.status}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                        <div style="color: var(--accent); font-size: 0.8rem;">Project</div>
                        <div style="font-weight: bold;">${getProjectName(task.relatedProjectId)}</div>
                    </div>
                </div>
                
                <table style="margin-top: 20px;">
                    <tr>
                        <th style="width: 150px;">Created Date</th>
                        <td>${formatDateTime(task.createdDate)}</td>
                    </tr>
                    <tr>
                        <th>Start Date</th>
                        <td>${formatDateTime(task.startDate)}</td>
                    </tr>
                    <tr>
                        <th>Due Date</th>
                        <td>${formatDateTime(task.dueDate)}</td>
                    </tr>
                    ${task.completionDate ? `
                    <tr>
                        <th>Completion Date</th>
                        <td>${formatDateTime(task.completionDate)}</td>
                    </tr>
                    ` : ''}
                    ${task.workingDurationHours ? `
                    <tr>
                        <th>Working Duration</th>
                        <td>${task.workingDurationHours} hours</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <th>Assigned To</th>
                        <td>${assignedUser ? assignedUser.fullName : task.assignedTo} (${task.assignedTo})</td>
                    </tr>
                    <tr>
                        <th>Created By</th>
                        <td>${createdByUser ? createdByUser.fullName : task.createdBy} (${task.createdBy})</td>
                    </tr>
                </table>
                
                ${task.activityLog && task.activityLog.length > 0 ? `
                <div style="margin-top: 20px;">
                    <h3 style="color: var(--accent);">Activity Log</h3>
                    <div style="max-height: 200px; overflow-y: auto;">
                        ${task.activityLog.map(log => `
                            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 5px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <strong style="color: var(--accent);">${log.user}</strong>
                                    <small style="color: var(--text-p);">${new Date(log.timestamp).toLocaleString()}</small>
                                </div>
                                <div style="margin-top: 5px;">${log.changeType}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            <div class="custom-modal-footer">
                ${task.status !== 'Completed' ? `
                    <button class="btn-primary" style="background: var(--success);" onclick="markTaskComplete('${task.id}'); this.closest('.custom-modal-overlay').remove();">
                        <i class="fas fa-check"></i> Mark as Complete
                    </button>
                ` : ''}
                <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Open task modal for add/edit
function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    if (!modal) {
        showCustomModal('Error', 'Task modal not found', 'danger');
        return;
    }
    
    const title = document.getElementById('taskModalTitle');
    const form = document.getElementById('taskForm');
    
    // Populate users dropdown
    populateUsersDropdown();
    
    // Populate projects dropdown
    populateProjectsDropdown();
    
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        title.textContent = 'Edit Task';
        document.getElementById('taskIdField').value = taskId;
        document.getElementById('taskTitle').value = task.title || '';
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskCategory').value = task.category || 'General';
        document.getElementById('taskPriority').value = task.priority || 'Medium';
        document.getElementById('taskAssignedTo').value = task.assignedTo || '';
        document.getElementById('taskRelatedProject').value = task.relatedProjectId || '';
        document.getElementById('taskStartDate').value = task.startDate ? task.startDate.split('T')[0] : new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
        document.getElementById('taskStatus').value = task.status || 'Not Started';
        document.getElementById('taskNotes').value = task.notes || '';
    } else {
        title.textContent = 'Add New Task';
        form.reset();
        document.getElementById('taskIdField').value = '';
        document.getElementById('taskStartDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'flex';
}

// Close task modal
function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

// Save task
async function saveTask(event) {
    event.preventDefault();
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to save tasks', 'danger');
        return;
    }
    
    const taskId = document.getElementById('taskIdField').value;
    const existingTask = tasks.find(t => t.id === taskId);
    
    const task = {
        id: taskId || null,
        taskId: existingTask?.taskId || (taskId ? null : generateTaskId()),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        assignedTo: document.getElementById('taskAssignedTo').value,
        relatedProjectId: document.getElementById('taskRelatedProject').value || null,
        startDate: document.getElementById('taskStartDate').value,
        dueDate: document.getElementById('taskDueDate').value,
        status: document.getElementById('taskStatus').value,
        notes: document.getElementById('taskNotes').value,
        createdBy: existingTask?.createdBy || currentUser.username,
        createdDate: existingTask?.createdDate || new Date().toISOString(),
        lastUpdatedBy: currentUser.username,
        updatedAt: new Date().toISOString()
    };
    
    // If marked as completed, calculate working duration
    if (task.status === 'Completed' && (!existingTask || existingTask.status !== 'Completed')) {
        task.completionDate = new Date().toISOString();
        task.workingDurationHours = calculateWorkingDuration(task.startDate, task.completionDate);
        task.isCompleted = true;
    }
    
    const result = await firebaseService.saveTask(task);
    
    if (result.success) {
        closeTaskModal();
        showCustomModal('Success', 'Task saved successfully!', 'success');
        await loadTasks();
        renderTasks();
        renderWeeklyTasks();
    } else {
        showCustomModal('Error', 'Failed to save task: ' + result.error, 'danger');
    }
}

// Mark task as complete
async function markTaskComplete(taskId, event) {
    if (event) event.stopPropagation();
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    task.status = 'Completed';
    task.completionDate = new Date().toISOString();
    task.workingDurationHours = calculateWorkingDuration(task.startDate, task.completionDate);
    task.isCompleted = true;
    
    const result = await firebaseService.saveTask(task);
    
    if (result.success) {
        showCustomModal('Success', 'Task marked as complete!', 'success');
        await loadTasks();
        renderTasks();
        renderWeeklyTasks();
    } else {
        showCustomModal('Error', 'Failed to update task: ' + result.error, 'danger');
    }
}

// Edit task
function editTask(id, event) {
    if (event) event.stopPropagation();
    openTaskModal(id);
}

// Delete task
async function deleteTask(id, event) {
    if (event) event.stopPropagation();
    
    const task = tasks.find(t => t.id === id);
    const taskName = task?.title;
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal danger">
            <div class="custom-modal-header">
                <h3>Confirm Delete</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>Are you sure you want to delete task "${taskName}"? This action cannot be undone.</p>
            </div>
            <div class="custom-modal-footer">
                <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                <button class="btn-primary" style="background: var(--danger);" onclick="confirmDeleteTask('${id}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function confirmDeleteTask(id) {
    const result = await firebaseService.deleteTask(id);
    
    document.querySelector('.custom-modal-overlay').remove();
    
    if (result.success) {
        showCustomModal('Success', 'Task deleted successfully!', 'success');
        await loadTasks();
        renderTasks();
        renderWeeklyTasks();
    } else {
        showCustomModal('Error', 'Failed to delete task: ' + result.error, 'danger');
    }
}

// Helper functions
function getProjectName(projectId) {
    if (!projectId) return 'None';
    const project = projects[projectId];
    return project ? project.name : 'Unknown';
}

function getUserFullName(username) {
    const user = users.find(u => u.username === username);
    return user ? user.fullName : username;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
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

function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid date';
    }
}

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
window.initTasks = initTasks;
window.renderTasks = renderTasks;
window.renderWeeklyTasks = renderWeeklyTasks;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.saveTask = saveTask;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.confirmDeleteTask = confirmDeleteTask;
window.openTaskDetail = openTaskDetail;
window.markTaskComplete = markTaskComplete;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.getProjectName = getProjectName;
window.getUserFullName = getUserFullName;
window.applyFilter = applyFilter;
window.changePage = changePage;

export {
    initTasks,
    renderTasks,
    renderWeeklyTasks,
    openTaskModal,
    closeTaskModal,
    saveTask,
    editTask,
    deleteTask,
    confirmDeleteTask,
    openTaskDetail,
    markTaskComplete,
    formatDate,
    formatDateTime,
    getProjectName,
    getUserFullName
};