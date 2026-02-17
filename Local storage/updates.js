// Updates management

function initUpdates() {
    // Only load from localStorage, no default updates
    let updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    
    // If empty, just set empty array
    if (updates.length === 0) {
        updates = [];
        localStorage.setItem('prospenUpdates', JSON.stringify(updates));
    }
}

function loadUpdates() {
    const container = document.getElementById('updatesContainer');
    if (!container) return;
    
    let updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    
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
    
    const recentUpdates = updates.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, 5);
    
    recentUpdates.forEach(update => {
        const updateElement = createUpdateListItem(update);
        container.appendChild(updateElement);
    });
}

function loadAllUpdates() {
    const container = document.getElementById('allUpdatesContainer');
    if (!container) return;
    
    let updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    
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
    
    const sortedUpdates = updates.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    sortedUpdates.forEach(update => {
        const updateElement = createUpdateListItem(update);
        container.appendChild(updateElement);
    });
}

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
            ${update.user === auth.getCurrentUser()?.username ? `
                <button class="small-btn" onclick="event.stopPropagation(); deleteUpdate('${update.id}')" title="Delete" style="background: var(--danger);">
                    <i class="fas fa-trash"></i>
                </button>
            ` : ''}
        </div>
    `;
    
    return updateDiv;
}

function showUpdateDetails(updateId) {
    const updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
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

function openUpdateModal() {
    const modal = document.getElementById('updateModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeUpdateModal() {
    const modal = document.getElementById('updateModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('updateForm').reset();
    }
}

function postUpdate(event) {
    event.preventDefault();
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to post updates', 'danger');
        return;
    }
    
    let updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    
    const update = {
        id: 'update_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        title: document.getElementById('updateTitle').value,
        message: document.getElementById('updateMessage').value,
        priority: document.getElementById('updatePriority').value,
        user: currentUser.username,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    
    updates.unshift(update);
    localStorage.setItem('prospenUpdates', JSON.stringify(updates.slice(0, 500)));
    
    auth.recordActivity('post_update', `Posted update: ${update.title}`);
    
    closeUpdateModal();
    
    if (window.location.pathname.includes('all-updates.html')) {
        loadAllUpdates();
    } else {
        loadUpdates();
    }
    
    playNotificationSound('notification');
    showCustomModal('Success', 'Update posted successfully!', 'success');
}

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

function confirmDeleteUpdate(id) {
    let updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    updates = updates.filter(u => u.id !== id);
    localStorage.setItem('prospenUpdates', JSON.stringify(updates));
    
    document.querySelector('.custom-modal-overlay').remove();
    
    auth.recordActivity('delete_update', 'Deleted an update');
    
    if (window.location.pathname.includes('all-updates.html')) {
        loadAllUpdates();
    } else {
        loadUpdates();
    }
    
    playNotificationSound('notification');
    showCustomModal('Success', 'Update deleted successfully!', 'success');
}

function likeUpdate(id) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to like updates', 'danger');
        return;
    }
    
    let updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    const index = updates.findIndex(u => u.id === id);
    
    if (index !== -1) {
        if (!updates[index].likes) updates[index].likes = 0;
        updates[index].likes++;
        localStorage.setItem('prospenUpdates', JSON.stringify(updates));
        
        if (window.location.pathname.includes('all-updates.html')) {
            loadAllUpdates();
        } else {
            loadUpdates();
        }
        
        playNotificationSound('notification');
    }
}

function openCommentModal(updateId) {
    document.getElementById('commentUpdateId').value = updateId;
    document.getElementById('commentModal').style.display = 'flex';
}

function closeCommentModal() {
    document.getElementById('commentModal').style.display = 'none';
    document.getElementById('commentMessage').value = '';
}

function submitComment(event) {
    event.preventDefault();
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to comment', 'danger');
        return;
    }
    
    const updateId = document.getElementById('commentUpdateId').value;
    const commentText = document.getElementById('commentMessage').value;
    
    if (!commentText) return;
    
    let updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    const index = updates.findIndex(u => u.id === updateId);
    
    if (index !== -1) {
        if (!updates[index].comments) updates[index].comments = [];
        
        updates[index].comments.push({
            user: currentUser.username,
            text: commentText,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('prospenUpdates', JSON.stringify(updates));
        
        auth.recordActivity('comment', `Commented on update: ${updates[index].title}`);
        
        closeCommentModal();
        
        if (window.location.pathname.includes('all-updates.html')) {
            loadAllUpdates();
        } else {
            loadUpdates();
        }
        
        playNotificationSound('notification');
        showCustomModal('Success', 'Comment added successfully!', 'success');
    }
}

function showAllComments(updateId) {
    const updates = JSON.parse(localStorage.getItem('prospenUpdates')) || [];
    const update = updates.find(u => u.id === updateId);
    
    if (!update || !update.comments) return;
    
    const profiles = JSON.parse(localStorage.getItem('prospenProfiles')) || {};
    
    let commentsHtml = '<div style="max-height: 400px; overflow-y: auto;">';
    update.comments.forEach(comment => {
        const date = new Date(comment.timestamp);
        commentsHtml += `
            <div style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong style="color: var(--accent);">${profiles[comment.user]?.fullName || comment.user}</strong>
                    <small style="color: var(--text-p);">${getTimeAgo(date)}</small>
                </div>
                <p style="margin: 0;">${comment.text}</p>
            </div>
        `;
    });
    commentsHtml += '</div>';
    
    showCustomModal(`Comments (${update.comments.length})`, commentsHtml, 'info');
}

// Make functions available globally
window.initUpdates = initUpdates;
window.loadUpdates = loadUpdates;
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
window.showAllComments = showAllComments;
window.showUpdateDetails = showUpdateDetails;
window.getTimeAgo = getTimeAgo;