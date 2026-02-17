// Projects management

function initProjects() {
    // Only load from localStorage, no default projects
    let projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    
    // If empty, just set empty object
    if (Object.keys(projects).length === 0) {
        projects = {};
        localStorage.setItem('prospenProjects', JSON.stringify(projects));
    }
}

function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    
    if (Object.keys(projects).length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-p);">
                <i class="fas fa-folder-open fa-4x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No projects added</h3>
                <p>Click the button below to add your first project</p>
                <button class="control-btn" onclick="openProjectModal()" style="margin-top: 20px;">
                    <i class="fas fa-plus"></i> Add First Project
                </button>
            </div>
        `;
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

function renderAllProjects() {
    const container = document.getElementById('allProjectsContainer');
    if (!container) return;
    
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    
    if (Object.keys(projects).length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-p);">
                <i class="fas fa-folder-open fa-4x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No projects found</h3>
                <p>Click the "New Project" button to create your first project.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    Object.values(projects).forEach(project => {
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
        container.appendChild(card);
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
    
    localStorage.setItem('currentProjectView', id);
    showProjectView(id);
}

function showProjectView(id) {
    const projectView = document.getElementById('project-view');
    const landing = document.getElementById('landing');
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    const p = projects[id];
    
    if (!projectView || !p) return;
    
    if (landing) landing.style.display = 'none';
    
    // FIXED: Calculate budget using the helper functions
    const totalBudget = calculateTotalBudget(p);
    const spentBudget = calculateSpentBudget(p);
    const remainingBudget = totalBudget - spentBudget;
    
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

                <!-- Budget Section -->
                <div class="section-box">
                    <h2>4. Budget & Resources</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                        <div style="background: rgba(56, 189, 248, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="color: var(--accent); font-size: 0.9rem;">Total Budget</div>
                            <div style="font-size: 1.5rem; font-weight: bold;">R${totalBudget.toFixed(2)}</div>
                        </div>
                        <div style="background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="color: var(--danger); font-size: 0.9rem;">Spent</div>
                            <div style="font-size: 1.5rem; font-weight: bold;">R${spentBudget.toFixed(2)}</div>
                        </div>
                        <div style="background: rgba(34, 197, 94, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="color: var(--success); font-size: 0.9rem;">Remaining</div>
                            <div style="font-size: 1.5rem; font-weight: bold;">R${remainingBudget.toFixed(2)}</div>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Spent</th>
                                <th>Purchase Date</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${p.budget && p.budget.items && p.budget.items.length > 0 ? p.budget.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.type || 'One-time'}</td>
                                    <td>R${(item.amount || 0).toFixed(2)}</td>
                                    <td>R${(item.spent || 0).toFixed(2)}</td>
                                    <td>${item.purchaseDate ? formatDate(item.purchaseDate) : '-'}</td>
                                    <td>
                                        ${item.receipt ? `<a href="${item.receipt}" target="_blank" class="small-btn" style="text-decoration: none;"><i class="fas fa-file"></i> View</a>` : '-'}
                                    </td>
                                </tr>
                            `).join('') : '<tr><td colspan="6" style="text-align: center;">No budget items added yet</td></tr>'}
                        </tbody>
                    </table>
                    <div style="text-align: right; margin-top: 15px;">
                        <button class="small-btn" onclick="openBudgetModal('${p.id}')" style="padding: 8px 16px;">
                            <i class="fas fa-plus"></i> Add Budget Item
                        </button>
                    </div>
                </div>
            </div>

            <div class="side-col">
                <div class="section-box">
                    <h2>5. Team Roles</h2>
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
                    <h2>6. Notes</h2>
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

function openProjectModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    if (!modal) {
        showCustomModal('Error', 'Project modal not found', 'danger');
        return;
    }
    
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('projectForm');
    
    if (projectId) {
        const project = projects[projectId];
        title.textContent = 'Edit Project';
        document.getElementById('projectId').value = projectId;
        document.getElementById('projectName').value = project.name || '';
        document.getElementById('projectIcon').value = project.icon || 'fas fa-project-diagram';
        document.getElementById('projectLead').value = project.lead || '';
        document.getElementById('projectStatus').value = project.status || 'In Progress';
        document.getElementById('projectDesc').value = project.desc || '';
        document.getElementById('projectStart').value = project.start || '';
        document.getElementById('projectDue').value = project.due || '';
        document.getElementById('projectType').value = project.type || 'Design';
        document.getElementById('projectNotes').value = project.notes || '';
        
        const teamContainer = document.getElementById('teamMembersContainer');
        teamContainer.innerHTML = '';
        if (project.members && project.members.length > 0) {
            project.members.forEach((member, index) => {
                teamContainer.innerHTML += `
                    <div class="task-item">
                        <div>
                            <strong>${member.name}</strong><br>
                            <small>${member.role}</small>
                        </div>
                        <div class="task-actions">
                            <button type="button" class="small-btn" onclick="editTeamMember('${projectId}', ${index})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="small-btn" onclick="removeTeamMember('${projectId}', ${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        const tasksContainer = document.getElementById('tasksContainer');
        tasksContainer.innerHTML = '';
        if (project.tasks && project.tasks.length > 0) {
            project.tasks.forEach((task, index) => {
                tasksContainer.innerHTML += `
                    <div class="task-item">
                        <div>
                            <strong>${task.name}</strong><br>
                            <small>Assigned to: ${task.who} | Due: ${formatDate(task.due)}</small>
                        </div>
                        <div class="task-actions">
                            <button type="button" class="small-btn" onclick="editTask('${projectId}', ${index})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="small-btn" onclick="removeTask('${projectId}', ${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
    } else {
        title.textContent = 'Add New Project';
        form.reset();
        document.getElementById('projectId').value = '';
        document.getElementById('teamMembersContainer').innerHTML = '';
        document.getElementById('tasksContainer').innerHTML = '';
    }
    
    modal.style.display = 'flex';
}

function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
}

function saveProject(event) {
    event.preventDefault();
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to save projects', 'danger');
        return;
    }
    
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    const projectId = document.getElementById('projectId').value || generateId();
    
    const existingProject = projects[projectId] || {};
    
    projects[projectId] = {
        id: projectId,
        name: document.getElementById('projectName').value,
        icon: document.getElementById('projectIcon').value,
        lead: document.getElementById('projectLead').value,
        status: document.getElementById('projectStatus').value,
        desc: document.getElementById('projectDesc').value,
        start: document.getElementById('projectStart').value,
        due: document.getElementById('projectDue').value,
        type: document.getElementById('projectType').value,
        notes: document.getElementById('projectNotes').value,
        members: existingProject.members || [],
        tasks: existingProject.tasks || [],
        timeline: existingProject.timeline || [],
        budget: existingProject.budget || { items: [] },
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: currentUser.username
    };
    
    localStorage.setItem('prospenProjects', JSON.stringify(projects));
    closeProjectModal();
    
    const action = document.getElementById('projectId').value ? 'update' : 'create';
    auth.recordActivity(action, `Project "${projects[projectId].name}" ${action}d`, projectId);
    
    renderProjects();
    updateTopProject();
    
    playNotificationSound('notification');
    showCustomModal('Success', 'Project saved successfully!', 'success');
}

function generateId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function editProject(id, event) {
    if (event) event.stopPropagation();
    openProjectModal(id);
}

function deleteProject(id, event) {
    if (event) event.stopPropagation();
    
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    const projectName = projects[id]?.name;
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal danger">
            <div class="custom-modal-header">
                <h3>Confirm Delete</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>Are you sure you want to delete project "${projectName}"? This action cannot be undone.</p>
            </div>
            <div class="custom-modal-footer">
                <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                <button class="btn-primary" style="background: var(--danger);" onclick="confirmDeleteProject('${id}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmDeleteProject(id) {
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    const projectName = projects[id]?.name;
    delete projects[id];
    localStorage.setItem('prospenProjects', JSON.stringify(projects));
    
    auth.recordActivity('delete', `Project "${projectName}" deleted`, id);
    
    document.querySelector('.custom-modal-overlay').remove();
    
    renderProjects();
    updateTopProject();
    
    playNotificationSound('notification');
    showCustomModal('Success', 'Project deleted successfully!', 'success');
}

function addTeamMember() {
    showCustomModal('Info', 'Team member will be added after saving the project.', 'info');
}

function editTeamMember(projectId, index) {
    showCustomModal('Info', 'Team member will be updated after saving the project.', 'info');
}

function removeTeamMember(projectId, index) {
    showCustomModal('Info', 'Team member will be removed after saving the project.', 'info');
}

function addTask() {
    showCustomModal('Info', 'Task will be added after saving the project.', 'info');
}

function editTask(projectId, index) {
    showCustomModal('Info', 'Task will be updated after saving the project.', 'info');
}

function removeTask(projectId, index) {
    showCustomModal('Info', 'Task will be removed after saving the project.', 'info');
}

function openBudgetModal(projectId) {
    // FIXED: Create styled modal instead of JavaScript alert
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal" style="max-width: 500px;">
            <div class="custom-modal-header">
                <h3>Add Budget Item</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <form id="budgetForm" onsubmit="saveBudgetItem(event, '${projectId}')">
                    <div class="form-group">
                        <label for="budgetName">Item Name *</label>
                        <input type="text" id="budgetName" placeholder="e.g., SEO Plugin, Hosting, Design Software" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="budgetType">Payment Type *</label>
                        <select id="budgetType" required>
                            <option value="One-time">One-time Purchase</option>
                            <option value="Monthly">Monthly Subscription</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Annual">Annual</option>
                            <option value="Hourly">Hourly Rate</option>
                            <option value="Project">Project Based</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="budgetAmount">Total Amount (R) *</label>
                            <input type="number" id="budgetAmount" placeholder="0.00" min="0" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="budgetSpent">Amount Spent (R) *</label>
                            <input type="number" id="budgetSpent" placeholder="0.00" min="0" step="0.01" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="budgetDate">Purchase Date *</label>
                        <input type="date" id="budgetDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="budgetReceipt">Receipt URL (optional)</label>
                        <input type="url" id="budgetReceipt" placeholder="https://drive.google.com/...">
                        <small style="color: var(--text-p); display: block; margin-top: 5px;">Link to receipt in Google Drive, Dropbox, etc.</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="budgetNotes">Notes (optional)</label>
                        <textarea id="budgetNotes" placeholder="Additional details about this expense..." rows="2"></textarea>
                    </div>
                    
                    <div class="btn-group">
                        <button type="button" class="btn-secondary" onclick="this.closest('.custom-modal-overlay').remove()">Cancel</button>
                        <button type="submit" class="btn-primary">Add Budget Item</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveBudgetItem(event, projectId) {
    event.preventDefault();
    
    const name = document.getElementById('budgetName').value;
    const type = document.getElementById('budgetType').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    const spent = parseFloat(document.getElementById('budgetSpent').value);
    const purchaseDate = document.getElementById('budgetDate').value;
    const receipt = document.getElementById('budgetReceipt').value;
    const notes = document.getElementById('budgetNotes').value;
    
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    const project = projects[projectId];
    
    if (!project.budget) {
        project.budget = { items: [] };
    }
    
    project.budget.items.push({
        name: name,
        type: type,
        amount: amount,
        spent: spent,
        purchaseDate: purchaseDate,
        receipt: receipt || null,
        notes: notes || null
    });
    
    localStorage.setItem('prospenProjects', JSON.stringify(projects));
    
    // Close the modal
    document.querySelector('.custom-modal-overlay').remove();
    
    // Refresh the project view
    showProjectView(projectId);
    showCustomModal('Success', 'Budget item added successfully!', 'success');
}

function calculateTotalBudget(project) {
    if (!project.budget || !project.budget.items) return 0;
    return project.budget.items.reduce((total, item) => total + (item.amount || 0), 0);
}

function calculateSpentBudget(project) {
    if (!project.budget || !project.budget.items) return 0;
    return project.budget.items.reduce((total, item) => total + (item.spent || 0), 0);
}

function updateTopProject() {
    const projects = JSON.parse(localStorage.getItem('prospenProjects')) || {};
    let bestProject = null;
    let maxProgress = 0;
    
    Object.values(projects).forEach(project => {
        const totalTasks = project.tasks ? project.tasks.length : 0;
        const completedTasks = project.tasks ? project.tasks.filter(t => t.status === 'Completed').length : 0;
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

// Make functions available globally
window.initProjects = initProjects;
window.renderProjects = renderProjects;
window.renderAllProjects = renderAllProjects;
window.openProject = openProject;
window.showProjectView = showProjectView;
window.closeProject = closeProject;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.saveProject = saveProject;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.confirmDeleteProject = confirmDeleteProject;
window.addTeamMember = addTeamMember;
window.editTeamMember = editTeamMember;
window.removeTeamMember = removeTeamMember;
window.addTask = addTask;
window.editTask = editTask;
window.removeTask = removeTask;
window.openBudgetModal = openBudgetModal;
window.saveBudgetItem = saveBudgetItem;
window.formatDate = formatDate;
window.updateTopProject = updateTopProject;
window.calculateTotalBudget = calculateTotalBudget;
window.calculateSpentBudget = calculateSpentBudget;