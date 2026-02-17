// tasks.js
import auth from './auth.js';
import firebaseService from './firebase-service.js';

let tasks = [];
let users = [];

// Initialize tasks
async function initTasks() {
    await loadTasks();
    await loadUsers();
    
    // Subscribe to real-time updates
    firebaseService.subscribeToTasks((updatedTasks) => {
        tasks = updatedTasks;
        renderTasks();
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

// Render tasks on the tasks page
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
    
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-p);">
                <i class="fas fa-tasks fa-4x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No tasks found</h3>
                <p>Click the "Add Task" button to create a new task.</p>
            </div>
        `;
        return;
    }
    
    // Calculate monthly stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
    });
    
    const completedMonthlyTasks = monthlyTasks.filter(task => task.status === 'Completed');
    const completionPercentage = monthlyTasks.length > 0 
        ? Math.round((completedMonthlyTasks.length / monthlyTasks.length) * 100) 
        : 0;
    
    container.innerHTML = `
        <div class="stats-header" style="margin-bottom: 20px;">
            <div>
                <h3>Monthly Progress</h3>
                <p>Tasks this month: ${monthlyTasks.length} | Completed: ${completedMonthlyTasks.length} | ${completionPercentage}% Complete</p>
            </div>
            <div class="stats-controls">
                <button class="control-btn" onclick="openTaskModal()">
                    <i class="fas fa-plus"></i> Add Task
                </button>
            </div>
        </div>
        <div class="project-grid">
            ${filteredTasks.map(task => renderTaskCard(task, isAdmin)).join('')}
        </div>
    `;
}

// Render a single task card
function renderTaskCard(task, isAdmin) {
    const dueDate = new Date(task.dueDate || task.date);
    const now = new Date();
    const diff = dueDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    let statusClass = '';
    let statusText = task.status;
    
    switch(task.status) {
        case 'Not Started':
            statusClass = 'status-badge';
            break;
        case 'In Progress':
            statusClass = 'status-badge' + (task.status === 'In Progress' ? ' in-progress' : '');
            break;
        case 'Completed':
            statusClass = 'status-badge' + (task.status === 'Completed' ? ' completed' : '');
            break;
        case 'Delayed':
            statusClass = 'status-badge' + (task.status === 'Delayed' ? ' delayed' : '');
            break;
    }
    
    return `
        <div class="card" onclick="openTaskDetail('${task.id}')">
            <div class="card-actions">
                <button class="card-btn" onclick="editTask('${task.id}', event)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="card-btn" onclick="deleteTask('${task.id}', event)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div style="display:flex; justify-content:space-between">
                <i class="fas fa-tasks fa-2x" style="color:var(--accent)"></i>
                <span class="${statusClass}">${task.status}</span>
            </div>
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
            <div><b>Assigned to:</b> ${getUserFullName(task.assignedTo)}</div>
            <div><b>Date:</b> ${formatDate(task.date)}</div>
            <div><b>Time:</b> ${task.startTime || 'Not set'} - ${task.expectedEndTime || 'Not set'}</div>
            ${days <= 3 ? `<div class="countdown">${days > 0 ? days + ' Days Left' : days === 0 ? 'Due Today' : Math.abs(days) + ' Days Overdue'}</div>` : ''}
        </div>
    `;
}

// Open task detail view
function openTaskDetail(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal" style="max-width: 600px;">
            <div class="custom-modal-header">
                <h3>Task Details</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <h2 style="color: var(--accent);">${task.title}</h2>
                <p style="color: var(--text-p);">${task.description || 'No description'}</p>
                
                <table style="margin-top: 20px;">
                    <tr><th>Assigned To</th><td>${getUserFullName(task.assignedTo)}</td></tr>
                    <tr><th>Date</th><td>${formatDate(task.date)}</td></tr>
                    <tr><th>Start Time</th><td>${task.startTime || 'Not set'}</td></tr>
                    <tr><th>Expected End Time</th><td>${task.expectedEndTime || 'Not set'}</td></tr>
                    <tr><th>Actual End Time</th><td>${task.actualEndTime || 'Not set'}</td></tr>
                    <tr><th>Status</th><td><span class="status-badge">${task.status}</span></td></tr>
                    <tr><th>Notes</th><td>${task.notes || 'No notes'}</td></tr>
                </table>
            </div>
            <div class="custom-modal-footer">
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
    const assignedToSelect = document.getElementById('taskAssignedTo');
    
    // Populate users dropdown
    populateUsersDropdown(assignedToSelect);
    
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        title.textContent = 'Edit Task';
        document.getElementById('taskIdField').value = taskId;
        document.getElementById('taskTitle').value = task.title || '';
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskAssignedTo').value = task.assignedTo || '';
        document.getElementById('taskDate').value = task.date || new Date().toISOString().split('T')[0];
        document.getElementById('taskStartTime').value = task.startTime || '';
        document.getElementById('taskExpectedEndTime').value = task.expectedEndTime || '';
        document.getElementById('taskActualEndTime').value = task.actualEndTime || '';
        document.getElementById('taskStatus').value = task.status || 'Not Started';
        document.getElementById('taskNotes').value = task.notes || '';
    } else {
        title.textContent = 'Add New Task';
        form.reset();
        document.getElementById('taskIdField').value = '';
        document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'flex';
}

// Populate users dropdown
function populateUsersDropdown(selectElement) {
    selectElement.innerHTML = '<option value="">Select User</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = `${user.fullName} (${user.username})`;
        selectElement.appendChild(option);
    });
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
    const task = {
        id: taskId || null,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        assignedTo: document.getElementById('taskAssignedTo').value,
        date: document.getElementById('taskDate').value,
        startTime: document.getElementById('taskStartTime').value,
        expectedEndTime: document.getElementById('taskExpectedEndTime').value,
        actualEndTime: document.getElementById('taskActualEndTime').value,
        status: document.getElementById('taskStatus').value,
        notes: document.getElementById('taskNotes').value,
        createdBy: currentUser.username,
        lastUpdatedBy: currentUser.username
    };
    
    const result = await firebaseService.saveTask(task);
    
    if (result.success) {
        closeTaskModal();
        showCustomModal('Success', 'Task saved successfully!', 'success');
        await loadTasks();
        renderTasks();
    } else {
        showCustomModal('Error', 'Failed to save task: ' + result.error, 'danger');
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
    } else {
        showCustomModal('Error', 'Failed to delete task: ' + result.error, 'danger');
    }
}

// Get user full name by username
function getUserFullName(username) {
    const user = users.find(u => u.username === username);
    return user ? user.fullName : username;
}

// Format date
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
window.initTasks = initTasks;
window.renderTasks = renderTasks;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.saveTask = saveTask;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.confirmDeleteTask = confirmDeleteTask;
window.openTaskDetail = openTaskDetail;
window.formatDate = formatDate;

export {
    initTasks,
    renderTasks,
    openTaskModal,
    closeTaskModal,
    saveTask,
    editTask,
    deleteTask,
    confirmDeleteTask,
    openTaskDetail,
    formatDate
};