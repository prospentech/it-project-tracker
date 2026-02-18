// updates.js
import auth from './auth.js';
import firebaseService from './firebase-service.js';

let updates = [];

// Initialize updates
async function initUpdates() {
    await loadUpdates();
    
    // Subscribe to real-time updates
    firebaseService.subscribeToUpdates((updatedUpdates) => {
        updates = updatedUpdates;
        if (document.getElementById('updatesContainer')) {
            loadUpdates();
        }
        if (document.getElementById('allUpdatesContainer')) {
            loadAllUpdates();
        }
    });
}

// Load updates from Firebase
async function loadUpdates() {
    updates = await firebaseService.getUpdates();
    renderUpdates();
    return updates;
}

// Render updates on main page
function renderUpdates() {
    const container = document.getElementById('updatesContainer');
    if (!container) return;
    
    if (updates.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-p);">
                <i class="fas fa-bullhorn fa-4x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No updates yet</h3>
                <p>Click the "Post Update" button to share an update.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    const recentUpdates = updates.slice(0, 5);
    
    recentUpdates.forEach(update => {
        const updateElement = createUpdateListItem(update);
        container.appendChild(updateElement);
    });
}

// Load all updates for all-updates page
async function loadAllUpdates() {
    const container = document.getElementById('allUpdatesContainer');
    if (!container) return;
    
    if (updates.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-p);">
                <i class="fas fa-bullhorn fa-4x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No updates yet</h3>
                <p>Click the "New Update" button to share an update.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    updates.forEach(update => {
        const updateElement = createUpdateListItem(update);
        container.appendChild(updateElement);
    });
}

// Create update list item
function createUpdateListItem(update) {
    const profiles = JSON.parse(localStorage.getItem('prospenProfiles')) || {};
    const profile = profiles[update.user] || { fullName: update.user, avatar: null };
    
    const date = new Date(update.timestamp);
    const timeAgo = getTimeAgo(date);
    
    const priorityColor = {
        'urgent': '#ef4444',
        'important': '#f59e0b',
        'normal': '#38bdf8'
    }[update.priority] || '#38bdf8';
    
    const currentUser = auth.getCurrentUser();
    
    const updateDiv = document.createElement('div');
    updateDiv.className = 'enquiry-card';
    updateDiv.style.cursor = 'pointer';
    updateDiv.onclick = (e) => {
        if (!e.target.closest('.small-btn')) {
            showUpdateDetails(update.id);
        }
    };
    
    updateDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
            <div style="display: flex; gap: 15px; flex: 1;">
                <div class="user-avatar" style="width: 40px; height: 40px;">
                    ${profile.avatar ? 
                        `<img src="${profile.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : 
                        (profile.fullName ? profile.fullName.charAt(0) : update.user.charAt(0))
                    }
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <div>
                            <strong style="color: var(--accent);">${profile.fullName || update.user}</strong>
                            <span style="color: var(--text-p); font-size: 0.8rem; margin-left: 10px;">${timeAgo}</span>
                        </div>
                        <span style="background: ${priorityColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.7rem;">
                            ${update.priority || 'normal'}
                        </span>
                    </div>
                    <h3 style="margin: 5px 0; color: var(--text-h);">${update.title}</h3>
                    <p style="margin: 5px 0 0 0; color: var(--text-p);">${update.message.substring(0, 150)}${update.message.length > 150 ? '...' : ''}</p>
                </div>
            </div>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
            <button class="small-btn" onclick="event.stopPropagation(); likeUpdate('${update.id}')" title="Like">
                <i class="fas fa-heart"></i>
                ${update.likes ? `<span style="margin-left: 3px;">${update.likes}</span>` : ''}
            </button>
            <button class="small-btn" onclick="event.stopPropagation(); openCommentModal('${update.id}')" title="Comment">
                <i class="fas fa-comment"></i>
                ${update.comments ? `<span style="margin-left: 3px;">${update.comments.length}</span>` : ''}
            </button>
            ${currentUser && (update.user === currentUser.username || currentUser.username === 'admin') ? `
                <button class="small-btn" onclick="event.stopPropagation(); deleteUpdate('${update.id}')" title="Delete" style="background: var(--danger);">
                    <i class="fas fa-trash"></i>
                </button>
            ` : ''}
        </div>
    `;
    
    return updateDiv;
}

// Show update details
function showUpdateDetails(updateId) {
    const update = updates.find(u => u.id === updateId);
    if (!update) return;
    
    const profiles = JSON.parse(localStorage.getItem('prospenProfiles')) || {};
    const profile = profiles[update.user] || { fullName: update.user, avatar: null };
    const date = new Date(update.timestamp);
    
    const priorityColor = {
        'urgent': '#ef4444',
        'important': '#f59e0b',
        'normal': '#38bdf8'
    }[update.priority] || '#38bdf8';
    
    let commentsHtml = '';
    if (update.comments && update.comments.length > 0) {
        commentsHtml = '<div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;"><h4 style="color: var(--accent);">Comments</h4>';
        update.comments.forEach(comment => {
            const commentDate = new Date(comment.timestamp);
            const commentProfile = profiles[comment.user] || { fullName: comment.user };
            commentsHtml += `
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong style="color: var(--accent);">${commentProfile.fullName || comment.user}</strong>
                        <small style="color: var(--text-p);">${getTimeAgo(commentDate)}</small>
                    </div>
                    <p style="margin: 0;">${comment.text}</p>
                </div>
            `;
        });
        commentsHtml += '</div>';
    }
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal" style="max-width: 600px;">
            <div class="custom-modal-header">
                <h3>Update Details</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body" style="max-height: 70vh; overflow-y: auto;">
                <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                    <div class="user-avatar" style="width: 50px; height: 50px;">
                        ${profile.avatar ? 
                            `<img src="${profile.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : 
                            (profile.fullName ? profile.fullName.charAt(0) : update.user.charAt(0))
                        }
                    </div>
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong style="color: var(--accent); font-size: 1.1rem;">${profile.fullName || update.user}</strong>
                            <span style="background: ${priorityColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.7rem;">
                                ${update.priority || 'normal'}
                            </span>
                        </div>
                        <small style="color: var(--text-p);">${date.toLocaleString()}</small>
                    </div>
                </div>
                
                <h2 style="color: var(--text-h); margin: 0 0 15px 0;">${update.title}</h2>
                <p style="color: var(--text-p); line-height: 1.8; white-space: pre-wrap;">${update.message}</p>
                
                ${commentsHtml}
            </div>
            <div class="custom-modal-footer">
                <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'just now';
}

// Open update modal
function openUpdateModal() {
    const modal = document.getElementById('updateModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('updateId')?.remove();
        document.getElementById('updateForm').reset();
    }
}

// Close update modal
function closeUpdateModal() {
    const modal = document.getElementById('updateModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('updateForm').reset();
    }
}

// Post update
async function postUpdate(event) {
    event.preventDefault();
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to post updates', 'danger');
        return;
    }
    
    const update = {
        id: document.getElementById('updateId')?.value || null,
        title: document.getElementById('updateTitle').value,
        message: document.getElementById('updateMessage').value,
        priority: document.getElementById('updatePriority').value,
        user: currentUser.username,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    
    // Save to Firebase
    const result = await firebaseService.saveUpdate(update);
    
    if (result.success) {
        closeUpdateModal();
        
        // Refresh updates
        await loadUpdates();
        
        playNotificationSound('notification');
        showCustomModal('Success', 'Update posted successfully!', 'success');
    } else {
        showCustomModal('Error', 'Failed to save update: ' + result.error, 'danger');
    }
}

// Delete update
function deleteUpdate(id) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal danger">
            <div class="custom-modal-header">
                <h3>Confirm Delete</h3>
                <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p>Are you sure you want to delete this update? This action cannot be undone.</p>
            </div>
            <div class="custom-modal-footer">
                <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                <button class="btn-primary" style="background: var(--danger);" onclick="confirmDeleteUpdate('${id}')">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Confirm delete update
async function confirmDeleteUpdate(id) {
    const result = await firebaseService.deleteUpdate(id);
    
    document.querySelector('.custom-modal-overlay').remove();
    
    if (result.success) {
        await loadUpdates();
        playNotificationSound('notification');
        showCustomModal('Success', 'Update deleted successfully!', 'success');
    } else {
        showCustomModal('Error', 'Failed to delete update: ' + result.error, 'danger');
    }
}

// Like update
async function likeUpdate(id) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to like updates', 'danger');
        return;
    }
    
    const update = updates.find(u => u.id === id);
    if (!update) return;
    
    update.likes = (update.likes || 0) + 1;
    
    const result = await firebaseService.saveUpdate(update);
    
    if (result.success) {
        await loadUpdates();
    }
}

// Open comment modal
function openCommentModal(updateId) {
    document.getElementById('commentUpdateId').value = updateId;
    document.getElementById('commentModal').style.display = 'flex';
}

// Close comment modal
function closeCommentModal() {
    document.getElementById('commentModal').style.display = 'none';
    document.getElementById('commentMessage').value = '';
}

// Submit comment
async function submitComment(event) {
    event.preventDefault();
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to comment', 'danger');
        return;
    }
    
    const updateId = document.getElementById('commentUpdateId').value;
    const commentText = document.getElementById('commentMessage').value;
    
    if (!commentText) return;
    
    const update = updates.find(u => u.id === updateId);
    if (!update) return;
    
    if (!update.comments) update.comments = [];
    
    update.comments.push({
        user: currentUser.username,
        text: commentText,
        timestamp: new Date().toISOString()
    });
    
    const result = await firebaseService.saveUpdate(update);
    
    if (result.success) {
        closeCommentModal();
        await loadUpdates();
        playNotificationSound('notification');
        showCustomModal('Success', 'Comment added successfully!', 'success');
    } else {
        showCustomModal('Error', 'Failed to add comment: ' + result.error, 'danger');
    }
}

// Play notification sound
function playNotificationSound(type) {
    const audio = document.getElementById(type + 'Sound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play failed:", e));
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
window.initUpdates = initUpdates;
window.loadUpdates = renderUpdates;
window.loadAllUpdates = loadAllUpdates;
window.openUpdateModal = openUpdateModal;
window.closeUpdateModal = closeUpdateModal;
window.postUpdate = postUpdate;
window.deleteUpdate = deleteUpdate;
window.confirmDeleteUpdate = confirmDeleteUpdate;
window.likeUpdate = likeUpdate;
window.openCommentModal = openCommentModal;
window.closeCommentModal = closeCommentModal;
window.submitComment = submitComment;
window.showUpdateDetails = showUpdateDetails;
window.getTimeAgo = getTimeAgo;
window.playNotificationSound = playNotificationSound;
window.showCustomModal = showCustomModal;

export {
    initUpdates,
    renderUpdates as loadUpdates,
    loadAllUpdates,
    openUpdateModal,
    closeUpdateModal,
    postUpdate,
    deleteUpdate,
    confirmDeleteUpdate,
    likeUpdate,
    openCommentModal,
    closeCommentModal,
    submitComment,
    showUpdateDetails,
    getTimeAgo
};