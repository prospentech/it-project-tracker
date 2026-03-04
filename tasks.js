// tasks.js
import auth from './auth.js';
import firebaseService from './firebase-service.js';

let tasks = [];
let users = [];
let projects = {};
let duties = []; // Add this line to store duties
let currentPage = 1;
let tasksUnsubscribe = null; // Track real-time subscription to prevent duplicates
let tasksInitialized = false; // Guard against double-init
const itemsPerPage = 15;
let currentFilters = {
    status: 'all',
    priority: 'all',
    type: 'all',
    project: 'all',
    dateRange: 'all' // New date range filter: 'all', 'today', 'week', 'month', 'year'
};

// Load tasks from Firebase
async function loadTasks() {
    try {
        tasks = await firebaseService.getTasks();
        //console.log('Tasks loaded from Firebase:', tasks.length);
        return tasks;
    } catch (error) {
        //console.error('Error loading tasks:', error);
        tasks = [];
        return [];
    }
}

// Load users from Firebase
async function loadUsers() {
    try {
        users = await firebaseService.getAllUsers();
        return users;
    } catch (error) {
        //console.error('Error loading users:', error);
        users = [];
        return [];
    }
}

// Load projects from Firebase
async function loadProjects() {
    try {
        projects = await firebaseService.getProjects();
        return projects;
    } catch (error) {
        //console.error('Error loading projects:', error);
        projects = {};
        return {};
    }
}

// Load duties from Firebase
async function loadDuties() {
    try {
        duties = await firebaseService.getDuties();
        //console.log('Duties loaded from Firebase:', duties.length);
        return duties;
    } catch (error) {
        //console.error('Error loading duties:', error);
        duties = [];
        return [];
    }
}

// Check for overdue tasks
function checkOverdueTasks() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let updated = false;
    
    tasks.forEach(task => {
        if (task.status !== 'Completed' && task.status !== 'Cancelled') {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (dueDate < now) {
                task.isOverdue = true;
                updated = true;
            } else {
                task.isOverdue = false;
            }
        }
    });
    
    if (updated) {
        renderTable();
    }
}

// Generate Task ID (01, 02, 03 format)
function generateTaskId() {
    const maxId = tasks.reduce((max, task) => {
        if (!task.taskId) return max;
        // Handle both plain numeric ("01", "02") and prefixed ("TASK-XXXXX") formats
        // Extract any trailing number, or parse the whole thing as a number
        const numMatch = task.taskId.toString().match(/(\d+)$/);
        if (numMatch) {
            const num = parseInt(numMatch[1], 10);
            return num > max ? num : max;
        }
        return max;
    }, 0);
    
    const nextNum = maxId + 1;
    // Pad with leading zeros to ensure at least 2 digits (01, 02, etc.)
    return nextNum.toString().padStart(2, '0');
}

// Helper function to check if a date is within a date range
function isDateInRange(dateStr, range) {
    if (!dateStr) return false;
    
    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(range) {
        case 'today':
            return taskDate.getTime() === today.getTime();
            
        case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return taskDate >= weekAgo;
            
        case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return taskDate >= monthAgo;
            
        case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(today.getFullYear() - 1);
            return taskDate >= yearAgo;
            
        case 'all':
        default:
            return true;
    }
}

// Update statistics cards
function updateStats() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const isAdmin = currentUser.username === 'admin';
    
    let filteredTasks = tasks;
    if (!isAdmin) {
        filteredTasks = tasks.filter(task => task.assignedTo === currentUser.username);
    }
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const totalTasks = filteredTasks.length;
    const activeTasks = filteredTasks.filter(t => t.status === 'Active').length;
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length;
    const onHoldTasks = filteredTasks.filter(t => t.status === 'On Hold').length;
    const cancelledTasks = filteredTasks.filter(t => t.status === 'Cancelled').length;
    
    const overdueTasks = filteredTasks.filter(t => {
        if (t.status === 'Completed' || t.status === 'Cancelled') return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < now;
    }).length;
    
    // Count tasks by date range
    const todayTasks = filteredTasks.filter(t => isDateInRange(t.createdAt || t.dueDate, 'today')).length;
    const weekTasks = filteredTasks.filter(t => isDateInRange(t.createdAt || t.dueDate, 'week')).length;
    const monthTasks = filteredTasks.filter(t => isDateInRange(t.createdAt || t.dueDate, 'month')).length;
    const yearTasks = filteredTasks.filter(t => isDateInRange(t.createdAt || t.dueDate, 'year')).length;
    
    const statsContainer = document.getElementById('statsCards');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-tasks"></i></div>
            <div class="stat-number">${totalTasks}</div>
            <div class="stat-label">Total Tasks</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-play-circle" style="color: var(--accent);"></i></div>
            <div class="stat-number">${activeTasks}</div>
            <div class="stat-label">Active</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-check-circle" style="color: var(--success);"></i></div>
            <div class="stat-number">${completedTasks}</div>
            <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-pause-circle" style="color: var(--warning);"></i></div>
            <div class="stat-number">${onHoldTasks}</div>
            <div class="stat-label">On Hold</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-stop-circle" style="color: var(--danger);"></i></div>
            <div class="stat-number">${cancelledTasks}</div>
            <div class="stat-label">Cancelled</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i></div>
            <div class="stat-number">${overdueTasks}</div>
            <div class="stat-label">Overdue</div>
        </div>
    `;
}

// Render table with pagination
function renderTable() {
    //console.log('Rendering table. Tasks count:', tasks.length);
    
    const tbody = document.getElementById('tasksTableBody');
    if (!tbody) {
        //console.log('Tasks table body not found');
        return;
    }
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
       // console.log('No current user');
        return;
    }
    
    const isAdmin = currentUser.username === 'admin';
    //console.log('Current user:', currentUser.username, 'Is admin:', isAdmin);
    
    // Start with all tasks
    let filteredTasks = [...tasks];
    //console.log('Total tasks before any filtering:', filteredTasks.length);
    
    // Filter tasks based on user role
    if (!isAdmin) {
        filteredTasks = filteredTasks.filter(task => {
            // Check if task.assignedTo exists and matches current user
            return task.assignedTo === currentUser.username;
        });
        //console.log('After user filter (non-admin):', filteredTasks.length);
    } else {
        //console.log('Admin user - showing all tasks');
    }
    
    // Apply status filter
    if (currentFilters.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === currentFilters.status);
        //console.log(`After status filter (${currentFilters.status}):`, filteredTasks.length);
    }
    
    // Apply priority filter
    if (currentFilters.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === currentFilters.priority);
        //console.log(`After priority filter (${currentFilters.priority}):`, filteredTasks.length);
    }
    
    // Apply type filter
    if (currentFilters.type !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.type === currentFilters.type);
        //console.log(`After type filter (${currentFilters.type}):`, filteredTasks.length);
    }
    
    // Apply project filter
    if (currentFilters.project !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.projectId === currentFilters.project);
        //console.log(`After project filter (${currentFilters.project}):`, filteredTasks.length);
    }
    
    // Apply date range filter
    if (currentFilters.dateRange !== 'all') {
        filteredTasks = filteredTasks.filter(task => {
            // Use createdAt if available, otherwise use dueDate as fallback
            const dateToCheck = task.createdAt || task.dueDate;
            return isDateInRange(dateToCheck, currentFilters.dateRange);
        });
        //console.log(`After date range filter (${currentFilters.dateRange}):`, filteredTasks.length);
    }
    
    //console.log('Final filtered tasks:', filteredTasks.length);
    
    // Update stats after filtering
    updateStats();
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
    
    // Update project filter dropdown
    updateProjectFilter();
    
    if (filteredTasks.length === 0) {
        let message = 'No tasks found. Click "Add Task" to create your first task.';
        if (tasks.length > 0 && !isAdmin) {
            message = 'No tasks assigned to you. Tasks exist but are assigned to other users.';
        } else if (tasks.length > 0) {
            message = 'No tasks match the current filters. Try resetting filters.';
        }
        
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px;">
                    <i class="fas fa-tasks fa-4x" style="color: var(--text-p); margin-bottom: 20px;"></i>
                    <p>${message}</p>
                    ${tasks.length > 0 ? `<p style="color: var(--warning);">Total tasks in system: ${tasks.length}</p>` : ''}
                </td>
            </tr>
        `;
    } else {
        let html = '';
        paginatedTasks.forEach(task => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const isOverdue = dueDate < now && task.status !== 'Completed' && task.status !== 'Cancelled';
            
            const statusClass = {
                'Active': 'active',
                'Completed': 'completed',
                'On Hold': 'on-hold',
                'Cancelled': 'cancelled'
            }[task.status] || 'active';
            
            const priorityClass = {
                'Urgent': 'priority-urgent',
                'High': 'priority-high',
                'Medium': 'priority-medium',
                'Low': 'priority-low'
            }[task.priority] || 'priority-medium';
            
            const projectName = task.projectId && projects[task.projectId] ? projects[task.projectId].name : 'None';
            const dutyName = getDutyName(task.dutyId); // Get duty name from helper function
            
            html += `
                <tr onclick="viewTaskDetails('${task.id}')">
                    <td><strong>${task.taskId || 'N/A'}</strong></td>
                    <td>${task.title || 'N/A'}</td>
                    <td>${task.description ? task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '') : 'N/A'}</td>
                    <td>${getUserFullName(task.assignedTo) || 'Unassigned'}</td>
                    <td><span class="priority-badge ${priorityClass}">${task.priority || 'Medium'}</span></td>
                    <td>
                        <span class="status-badge ${isOverdue ? 'overdue' : statusClass}">
                            ${isOverdue ? 'Overdue' : (task.status || 'Active')}
                        </span>
                    </td>
                    <td>${formatDate(task.dueDate)}</td>
                    <td>${projectName}</td>
                    <td>${dutyName || 'None'}</td>
                    <td>
                        <div class="action-buttons" onclick="event.stopPropagation()">
                            <button class="action-btn" onclick="viewTaskDetails('${task.id}')" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn" onclick="editTask('${task.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteTask('${task.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
    
    renderPagination(filteredTasks.length);
}

// Helper function to get duty name
function getDutyName(dutyId) {
    if (!dutyId) return null;
    const duty = duties.find(d => d.id === dutyId);
    return duty ? (duty.name || duty.role) : null;
}

// Render pagination controls
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span class="pagination-btn" style="cursor: default;">...</span>`;
        }
    }
    
    html += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = html;
}

// Change page
function changePage(page) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const isAdmin = currentUser.username === 'admin';
    let filteredTasks = tasks;
    
    if (!isAdmin) {
        filteredTasks = tasks.filter(task => task.assignedTo === currentUser.username);
    }
    
    if (currentFilters.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === currentFilters.status);
    }
    
    if (currentFilters.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === currentFilters.priority);
    }
    
    if (currentFilters.type !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.type === currentFilters.type);
    }
    
    if (currentFilters.project !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.projectId === currentFilters.project);
    }
    
    // Apply date range filter for pagination
    if (currentFilters.dateRange !== 'all') {
        filteredTasks = filteredTasks.filter(task => {
            const dateToCheck = task.createdAt || task.dueDate;
            return isDateInRange(dateToCheck, currentFilters.dateRange);
        });
    }
    
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
}

// Update project filter dropdown
function updateProjectFilter() {
    const projectFilter = document.getElementById('projectFilter');
    if (!projectFilter) return;
    
    projectFilter.innerHTML = '<option value="all">All Projects</option>';
    
    Object.values(projects).forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        projectFilter.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const typeFilter = document.getElementById('typeFilter');
    const projectFilter = document.getElementById('projectFilter');
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    
    currentFilters.status = statusFilter ? statusFilter.value : 'all';
    currentFilters.priority = priorityFilter ? priorityFilter.value : 'all';
    currentFilters.type = typeFilter ? typeFilter.value : 'all';
    currentFilters.project = projectFilter ? projectFilter.value : 'all';
    currentFilters.dateRange = dateRangeFilter ? dateRangeFilter.value : 'all';
    
    //console.log('Applied filters:', currentFilters);
    
    currentPage = 1;
    renderTable();
}

// Reset filters
function resetFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const typeFilter = document.getElementById('typeFilter');
    const projectFilter = document.getElementById('projectFilter');
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    
    if (statusFilter) statusFilter.value = 'all';
    if (priorityFilter) priorityFilter.value = 'all';
    if (typeFilter) typeFilter.value = 'all';
    if (projectFilter) projectFilter.value = 'all';
    if (dateRangeFilter) dateRangeFilter.value = 'all';
    
    currentFilters = {
        status: 'all',
        priority: 'all',
        type: 'all',
        project: 'all',
        dateRange: 'all'
    };
    
    currentPage = 1;
    renderTable();
}

// Populate users dropdown
function populateUsersDropdown() {
    const select = document.getElementById('taskAssignedTo');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select User</option>';
    
    const allUsers = [
        { username: 'admin', fullName: 'Administrator' },
        { username: 'Junior', fullName: 'Junior' },
        { username: 'Buhle', fullName: 'Buhle' },
        { username: 'AJay', fullName: 'AJay' }
    ];
    
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
    const select = document.getElementById('taskProject');
    if (!select) return;
    
    select.innerHTML = '<option value="">None</option>';
    
    Object.values(projects).forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
}

// Populate duties dropdown
function populateDutiesDropdown() {
    const select = document.getElementById('taskDuty');
    if (!select) return;
    
    select.innerHTML = '<option value="">None</option>';
    
    const currentUser = auth.getCurrentUser();
    const isAdmin = currentUser?.username === 'admin';
    
    // Filter duties based on user role
    let filteredDuties = duties;
    if (!isAdmin) {
        filteredDuties = duties.filter(d => d.userId === currentUser.username);
    }
    
    filteredDuties.forEach(duty => {
        const option = document.createElement('option');
        option.value = duty.id;
        option.textContent = duty.name || duty.role || 'Unnamed Duty';
        select.appendChild(option);
    });
}

// Close task modal
function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

// Open task modal
function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    if (!modal) {
        showCustomModal('Error', 'Task modal not found', 'danger');
        return;
    }
    
    const title = document.getElementById('taskModalTitle');
    const form = document.getElementById('taskForm');
    
    populateUsersDropdown();
    populateProjectsDropdown();
    populateDutiesDropdown();
    
    const today = new Date().toISOString().split('T')[0];
    
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        title.textContent = 'Edit Task';
        
        document.getElementById('taskIdField').value = taskId;
        document.getElementById('taskTitle').value = task.title || '';
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskAssignedTo').value = task.assignedTo || '';
        document.getElementById('taskProject').value = task.projectId || '';
        document.getElementById('taskDuty').value = task.dutyId || '';
        document.getElementById('taskType').value = task.type || '';
        document.getElementById('taskPriority').value = task.priority || '';
        document.getElementById('taskStartDate').value = task.startDate || today;
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskCompletedDate').value = task.completedDate || '';
        document.getElementById('taskStatus').value = task.status || 'Active';
        document.getElementById('taskNotes').value = task.notes || '';
        
    } else {
        title.textContent = 'Add New Task';
        form.reset();
        document.getElementById('taskIdField').value = '';
        document.getElementById('taskStartDate').value = today;
        
        const defaultDue = new Date();
        defaultDue.setDate(defaultDue.getDate() + 7);
        document.getElementById('taskDueDate').value = defaultDue.toISOString().split('T')[0];
    }
    
    modal.style.display = 'flex';
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
        assignedTo: document.getElementById('taskAssignedTo').value,
        projectId: document.getElementById('taskProject').value || null,
        dutyId: document.getElementById('taskDuty').value || null,
        type: document.getElementById('taskType').value,
        priority: document.getElementById('taskPriority').value,
        startDate: document.getElementById('taskStartDate').value,
        dueDate: document.getElementById('taskDueDate').value,
        completedDate: document.getElementById('taskCompletedDate').value || null,
        status: document.getElementById('taskStatus').value,
        notes: document.getElementById('taskNotes').value,
        createdBy: existingTask?.createdBy || currentUser.username,
        createdAt: existingTask?.createdAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: currentUser.username
    };
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    try {
        const result = await firebaseService.saveTask(task);
        
        if (result.success) {
            if (task.projectId && projects[task.projectId]) {
                const project = projects[task.projectId];
                if (!project.tasks) project.tasks = [];
                
                const existingProjectTask = project.tasks.find(t => t.id === task.id);
                if (!existingProjectTask) {
                    project.tasks.push({
                        id: task.id,
                        name: task.title,
                        who: task.assignedTo,
                        prio: task.priority,
                        due: task.dueDate,
                        status: task.status
                    });
                    
                    await firebaseService.saveProject(project);
                }
            }
            
            closeTaskModal();
            await loadTasks();
            await loadProjects();
            await loadDuties(); // Reload duties
            renderTable();
            
            showCustomModal('Success', 'Task saved successfully!', 'success');
        } else {
            showCustomModal('Error', 'Failed to save task: ' + result.error, 'danger');
        }
    } catch (error) {
        console.error('Error saving task:', error);
        showCustomModal('Error', 'Failed to save task: ' + error.message, 'danger');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// View task details
function viewTaskDetails(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const detailView = document.getElementById('taskDetailView');
    const content = document.getElementById('taskDetailContent');
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const isOverdue = dueDate < now && task.status !== 'Completed' && task.status !== 'Cancelled';
    
    const statusClass = {
        'Active': 'active',
        'Completed': 'completed',
        'On Hold': 'on-hold',
        'Cancelled': 'cancelled'
    }[task.status] || 'active';
    
    const priorityClass = {
        'Urgent': 'priority-urgent',
        'High': 'priority-high',
        'Medium': 'priority-medium',
        'Low': 'priority-low'
    }[task.priority] || 'priority-medium';
    
    const projectName = task.projectId && projects[task.projectId] ? projects[task.projectId].name : 'None';
    const dutyName = getDutyName(task.dutyId) || 'None';
    
    let html = `
        <div class="grid-layout">
            <div class="main-col">
                <div class="detail-section">
                    <h2><i class="fas fa-info-circle"></i> Task Details</h2>
                    <div class="detail-row"><span class="detail-label">Task ID:</span><span class="detail-value"><strong>${task.taskId || 'N/A'}</strong></span></div>
                    <div class="detail-row"><span class="detail-label">Task Title:</span><span class="detail-value">${task.title || 'N/A'}</span></div>
                    <div class="detail-row"><span class="detail-label">Description:</span><span class="detail-value">${task.description || 'No description'}</span></div>
                    <div class="detail-row"><span class="detail-label">Assigned To:</span><span class="detail-value">${getUserFullName(task.assignedTo) || 'Unassigned'}</span></div>
                    <div class="detail-row"><span class="detail-label">Project Linked:</span><span class="detail-value">${projectName}</span></div>
                    <div class="detail-row"><span class="detail-label">Duty Linked:</span><span class="detail-value">${dutyName}</span></div>
                </div>
                
                <div class="detail-section">
                    <h2><i class="fas fa-tag"></i> Classification</h2>
                    <div class="detail-row"><span class="detail-label">Type of Work:</span><span class="detail-value">${task.type || 'N/A'}</span></div>
                    <div class="detail-row"><span class="detail-label">Priority:</span>
                        <span class="detail-value">
                            <span class="priority-badge ${priorityClass}">${task.priority || 'Medium'}</span>
                        </span>
                    </div>
                    <div class="detail-row"><span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="status-badge ${isOverdue ? 'overdue' : statusClass}">
                                ${isOverdue ? 'Overdue' : (task.status || 'Active')}
                            </span>
                        </span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h2><i class="fas fa-calendar-alt"></i> Dates</h2>
                    <div class="detail-row"><span class="detail-label">Start Date:</span><span class="detail-value">${formatDate(task.startDate)}</span></div>
                    <div class="detail-row"><span class="detail-label">Due Date:</span><span class="detail-value">${formatDate(task.dueDate)}</span></div>
                    ${task.completedDate ? `
                        <div class="detail-row"><span class="detail-label">Completed Date:</span><span class="detail-value">${formatDate(task.completedDate)}</span></div>
                    ` : ''}
                </div>
                
                ${task.notes ? `
                <div class="detail-section">
                    <h2><i class="fas fa-sticky-note"></i> Notes</h2>
                    <p class="detail-value">${task.notes}</p>
                </div>
                ` : ''}
                
                <div class="detail-section">
                    <h2><i class="fas fa-history"></i> Metadata</h2>
                    <div class="detail-row"><span class="detail-label">Created:</span><span class="detail-value">${formatDateTime(task.createdAt)}</span></div>
                    <div class="detail-row"><span class="detail-label">Created By:</span><span class="detail-value">${task.createdBy || 'N/A'}</span></div>
                    <div class="detail-row"><span class="detail-label">Last Updated:</span><span class="detail-value">${formatDateTime(task.lastUpdated)}</span></div>
                    <div class="detail-row"><span class="detail-label">Last Updated By:</span><span class="detail-value">${task.lastUpdatedBy || 'N/A'}</span></div>
                </div>
            </div>
            
            <div class="side-col">
                <div class="detail-section">
                    <h2><i class="fas fa-tasks"></i> Quick Actions</h2>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="control-btn" onclick="editTask('${task.id}')" style="width: 100%;">
                            <i class="fas fa-edit"></i> Edit Task
                        </button>
                        ${task.status !== 'Completed' ? `
                            <button class="control-btn" style="background: var(--success); width: 100%;" onclick="markTaskComplete('${task.id}')">
                                <i class="fas fa-check"></i> Mark Complete
                            </button>
                        ` : ''}
                        <button class="control-btn" style="background: var(--danger); width: 100%;" onclick="deleteTask('${task.id}')">
                            <i class="fas fa-trash"></i> Delete Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    detailView.classList.add('show');
}

// Close task detail view
function closeTaskDetail() {
    document.getElementById('taskDetailView').classList.remove('show');
}

// Edit task
function editTask(taskId) {
    closeTaskDetail();
    openTaskModal(taskId);
}

// Mark task as complete
async function markTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    task.status = 'Completed';
    task.completedDate = new Date().toISOString().split('T')[0];
    task.lastUpdated = new Date().toISOString();
    
    if (task.projectId && projects[task.projectId]) {
        const project = projects[task.projectId];
        if (project.tasks) {
            const projectTask = project.tasks.find(t => t.id === task.id);
            if (projectTask) {
                projectTask.status = 'Completed';
                await firebaseService.saveProject(project);
            }
        }
    }
    
    const result = await firebaseService.saveTask(task);
    
    if (result.success) {
        closeTaskDetail();
        await loadTasks();
        renderTable();
        showCustomModal('Success', 'Task marked as complete!', 'success');
    } else {
        showCustomModal('Error', 'Failed to update task: ' + result.error, 'danger');
    }
}

// Delete task
function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal danger">
            <div class="custom-modal-header">
                <h3>Confirm Delete</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>Are you sure you want to delete task <strong>${task?.title || taskId}</strong>? This action cannot be undone.</p>
            </div>
            <div class="custom-modal-footer">
                <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                <button class="btn-primary" style="background: var(--danger);" onclick="confirmDeleteTask('${taskId}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Confirm delete task
async function confirmDeleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    
    // Remove the confirmation modal first
    const overlay = document.querySelector('.custom-modal-overlay');
    if (overlay) overlay.remove();
    
    if (task && task.projectId && projects[task.projectId]) {
        const project = projects[task.projectId];
        if (project.tasks) {
            project.tasks = project.tasks.filter(t => t.id !== taskId);
            await firebaseService.saveProject(project);
        }
    }
    
    const result = await firebaseService.deleteTask(taskId);
    
    // Close detail view if open
    const detailView = document.getElementById('taskDetailView');
    if (detailView) detailView.classList.remove('show');
    
    if (result.success) {
        // Remove from local array immediately so generateTaskId works correctly
        tasks = tasks.filter(t => t.id !== taskId);
        await loadTasks();
        await loadProjects();
        await loadDuties();
        renderTable();
        showCustomModal('Success', 'Task deleted successfully!', 'success');
    } else {
        showCustomModal('Error', 'Failed to delete task: ' + result.error, 'danger');
    }
}

// Helper functions
function getUserFullName(username) {
    if (!username) return 'Unassigned';
    const user = users.find(u => u.username === username);
    return user ? (user.fullName || username) : username;
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

// Initialize tasks
async function initTasks() {
    // Prevent duplicate initialization
    if (tasksInitialized) return;
    tasksInitialized = true;
    
    try {
        // Unsubscribe from any previous real-time listener before creating a new one
        if (tasksUnsubscribe) {
            tasksUnsubscribe();
            tasksUnsubscribe = null;
        }
        
        // Load all required data
        await Promise.all([
            loadTasks(),
            loadUsers(),
            loadProjects(),
            loadDuties()
        ]);
        
        // Subscribe to real-time updates (store unsubscribe fn to avoid duplicates)
        tasksUnsubscribe = firebaseService.subscribeToTasks((updatedTasks) => {
            tasks = updatedTasks;
            checkOverdueTasks();
            updateStats();
            renderTable();
        });
        
        // Force an immediate render
        renderTable();
        
    } catch (error) {
        tasksInitialized = false; // Reset on error so retry is possible
        showCustomModal('Error', 'Failed to initialize tasks: ' + error.message, 'danger');
    }
}

// Make all functions available globally
window.initTasks = initTasks;
window.loadTasks = loadTasks;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.saveTask = saveTask;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.confirmDeleteTask = confirmDeleteTask;
window.viewTaskDetails = viewTaskDetails;
window.closeTaskDetail = closeTaskDetail;
window.markTaskComplete = markTaskComplete;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.changePage = changePage;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.getUserFullName = getUserFullName;
window.renderTasks = renderTable;

// NOTE: initTasks() is called by the page (tasks.html).
// Do NOT add a DOMContentLoaded listener here — it would cause double-init and task duplication.

// Export for module usage
export {
    initTasks,
    loadTasks,
    renderTable as renderTasks,
    openTaskModal,
    closeTaskModal,
    saveTask,
    editTask,
    deleteTask,
    confirmDeleteTask,
    viewTaskDetails,
    closeTaskDetail,
    markTaskComplete,
    applyFilters,
    resetFilters,
    changePage,
    formatDate,
    formatDateTime,
    getUserFullName
};