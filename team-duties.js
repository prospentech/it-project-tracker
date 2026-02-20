// team-duties.js
import auth from './auth.js';
import firebaseService from './firebase-service.js';

let duties = [];
let currentUser = null;

// Initialize duties
async function initDuties() {
    currentUser = auth.getCurrentUser();
    await loadDuties();
    
    // Subscribe to real-time updates
    firebaseService.subscribeToDuties((updatedDuties) => {
        duties = updatedDuties;
        renderDuties();
    });
}

// Load duties from Firebase
async function loadDuties() {
    duties = await firebaseService.getDuties();
    return duties;
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
    
    let html = '';
    
    if (isAdmin) {
        // Admin view - table format with all users
        html = `
            <div style="overflow-x: auto;">
                <table class="duties-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Role/Key Responsibilities</th>
                            <th>Tasks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        filteredDuties.forEach((duty, index) => {
            const dutyId = (index + 1).toString().padStart(3, '0');
            const tasks = duty.tasks || [];
            
            html += `
                <tr>
                    <td><strong>${dutyId}</strong></td>
                    <td><strong style="color: var(--accent);">${duty.userName || duty.userId}</strong></td>
                    <td>${duty.role || 'N/A'}</td>
                    <td>
                        <ul style="margin: 0; padding-left: 20px;">
                            ${tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </td>
                    <td>
                        <div style="display: flex; gap: 5px;">
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
    } else {
        // Regular user view - cards format
        html = '<div class="duties-grid">';
        
        filteredDuties.forEach(duty => {
            const tasks = duty.tasks || [];
            
            html += `
                <div class="duty-card" style="background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <h3 style="color: var(--accent); margin: 0;">${duty.role || 'Duty'}</h3>
                        <div style="display: flex; gap: 5px;">
                            <button class="small-btn" onclick="editDuty('${duty.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="small-btn" onclick="deleteDuty('${duty.id}')" title="Delete" style="background: var(--danger);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <h4 style="color: var(--text-h); margin: 10px 0;">Tasks:</h4>
                    <ul style="color: var(--text-p); padding-left: 20px;">
                        ${tasks.map(task => `<li style="margin-bottom: 5px;">${task}</li>`).join('')}
                    </ul>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    container.innerHTML = html;
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
    
    if (dutyId) {
        const duty = duties.find(d => d.id === dutyId);
        title.textContent = 'Edit Duty';
        document.getElementById('dutyId').value = dutyId;
        document.getElementById('dutyRole').value = duty.role || '';
        
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
        
        // Clear and add one empty task field
        const tasksContainer = document.getElementById('dutyTasksContainer');
        tasksContainer.innerHTML = '';
        addTaskField();
    }
    
    modal.style.display = 'flex';
}

// Close duty modal
function closeDutyModal() {
    document.getElementById('dutyModal').style.display = 'none';
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
    const role = document.getElementById('dutyRole').value;
    
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
        userId: currentUser.username,
        userName: currentUser.username,
        role: role,
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
        renderDuties();
    } else {
        showCustomModal('Error', 'Failed to save duty: ' + result.error, 'danger');
    }
}

// Delete duty
async function deleteDuty(id, event) {
    if (event) event.stopPropagation();
    
    const duty = duties.find(d => d.id === id);
    const roleName = duty?.role || 'this duty';
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal danger">
            <div class="custom-modal-header">
                <h3>Confirm Delete</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>Are you sure you want to delete "${roleName}"? This action cannot be undone.</p>
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
        renderDuties();
    } else {
        showCustomModal('Error', 'Failed to delete duty: ' + result.error, 'danger');
    }
}

// Edit duty
function editDuty(id, event) {
    if (event) event.stopPropagation();
    openDutyModal(id);
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
window.openDutyModal = openDutyModal;
window.closeDutyModal = closeDutyModal;
window.saveDuty = saveDuty;
window.editDuty = editDuty;
window.deleteDuty = deleteDuty;
window.confirmDeleteDuty = confirmDeleteDuty;
window.addTaskField = addTaskField;

export {
    initDuties,
    renderDuties,
    openDutyModal,
    closeDutyModal,
    saveDuty,
    editDuty,
    deleteDuty,
    confirmDeleteDuty,
    addTaskField
};