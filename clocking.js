// Clocking system functions
function confirmClockAction() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        showCustomModal('Error', 'Please login to use clocking system', 'danger');
        return;
    }
    
    const status = clockingSystem.getClockingStatus(currentUser.username);
    const action = status.clockedIn ? 'out' : 'in';
    
    // Check if already clocked in today
    const today = new Date().toDateString();
    if (status.clockedIn && status.lastClockDate === today) {
        // Already clocked in today, proceed to clock out
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay confirmation-modal';
        modal.innerHTML = `
            <div class="custom-modal warning">
                <div class="custom-modal-header">
                    <h3>Confirm Clock OUT</h3>
                    <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="custom-modal-body">
                    <p>Are you sure you want to clock out at ${time}?</p>
                    <div class="btn-group">
                        <button class="btn-cancel" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                        <button class="btn-confirm" onclick="performClockOut()">Confirm Clock OUT</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else if (!status.clockedIn) {
        // Clock in
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay confirmation-modal';
        modal.innerHTML = `
            <div class="custom-modal info">
                <div class="custom-modal-header">
                    <h3>Confirm Clock IN</h3>
                    <button class="custom-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="custom-modal-body">
                    <p>Are you sure you want to clock in at ${time}?</p>
                    <div class="btn-group">
                        <button class="btn-cancel" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                        <button class="btn-confirm" onclick="performClockIn()">Confirm Clock IN</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

function performClockIn() {
    const currentUser = auth.getCurrentUser();
    document.querySelector('.custom-modal-overlay').remove();
    
    const status = clockingSystem.getClockingStatus(currentUser.username);
    const now = new Date();
    
    status.clockedIn = true;
    status.clockInTime = now.toISOString();
    status.lastClockDate = now.toDateString();
    
    const clockStatus = clockingSystem.getClockInStatus(status.clockInTime);
    let message = `Clocked in at ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. `;
    
    if (clockStatus.status === 'early') {
        if (clockStatus.hours > 0) {
            message += `You're ${clockStatus.hours} hour${clockStatus.hours > 1 ? 's' : ''} and ${clockStatus.minutes} minute${clockStatus.minutes !== 1 ? 's' : ''} early.`;
        } else {
            message += `You're ${clockStatus.minutes} minute${clockStatus.minutes !== 1 ? 's' : ''} early.`;
        }
        document.getElementById('clockStatus').className = 'clock-status on-time';
        document.getElementById('clockStatus').textContent = 'Early';
    } else if (clockStatus.status === 'late') {
        if (clockStatus.hours > 0) {
            message += `You're ${clockStatus.hours} hour${clockStatus.hours > 1 ? 's' : ''} and ${clockStatus.minutes} minute${clockStatus.minutes !== 1 ? 's' : ''} late.`;
        } else {
            message += `You're ${clockStatus.minutes} minute${clockStatus.minutes !== 1 ? 's' : ''} late.`;
        }
        document.getElementById('clockStatus').className = 'clock-status late';
        document.getElementById('clockStatus').textContent = 'Late';
    } else {
        message += 'You\'re right on time!';
        document.getElementById('clockStatus').className = 'clock-status on-time';
        document.getElementById('clockStatus').textContent = 'On Time';
    }
    
    if (!clockingSystem.isWorkingDay()) {
        message += ' (Note: Today is not a regular working day)';
    }
    
    showCustomModal('Clocked In', message, clockStatus.status === 'late' ? 'warning' : 'success');
    auth.playSound('clockInSound');
    
    document.getElementById('clockBtn').textContent = 'CLOCK OUT';
    document.getElementById('clockBtn').className = 'clock-btn clocked-in';
    
    clockingSystem.setClockingStatus(currentUser.username, status);
    auth.recordActivity('clock_in', `Clocked in at ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
}

function performClockOut() {
    const currentUser = auth.getCurrentUser();
    document.querySelector('.custom-modal-overlay').remove();
    
    const status = clockingSystem.getClockingStatus(currentUser.username);
    const now = new Date();
    
    status.clockedIn = false;
    status.clockOutTime = now.toISOString();
    
    const duration = clockingSystem.calculateWorkDuration(status.clockInTime, status.clockOutTime);
    const clockOutTime = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    clockingSystem.addToHistory(currentUser.username, {
        date: now.toDateString(),
        clockIn: new Date(status.clockInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        clockOut: clockOutTime,
        duration: `${duration.hours}h ${duration.minutes}m`,
        type: clockingSystem.isWorkingDay() ? 'Regular' : 'Non-working day'
    });
    
    let durationText = '';
    if (duration.hours > 0) {
        durationText += `${duration.hours} hour${duration.hours > 1 ? 's' : ''}`;
        if (duration.minutes > 0) {
            durationText += ` and ${duration.minutes} minute${duration.minutes !== 1 ? 's' : ''}`;
        }
    } else {
        durationText = `${duration.minutes} minute${duration.minutes !== 1 ? 's' : ''}`;
    }
    
    const message = `Clocked out at ${clockOutTime}. You worked for ${durationText} today.`;
    showCustomModal('Clocked Out', message, 'info');
    auth.playSound('clockOutSound');
    
    document.getElementById('clockBtn').textContent = 'CLOCK IN';
    document.getElementById('clockBtn').className = 'clock-btn';
    document.getElementById('clockStatus').textContent = '';
    document.getElementById('clockStatus').className = 'clock-status';
    
    clockingSystem.setClockingStatus(currentUser.username, status);
    auth.recordActivity('clock_out', `Clocked out after working ${durationText}`);
}

function updateClockDisplay() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const status = clockingSystem.getClockingStatus(currentUser.username);
    const btn = document.getElementById('clockBtn');
    const statusSpan = document.getElementById('clockStatus');
    
    if (btn && statusSpan) {
        if (status.clockedIn) {
            btn.textContent = 'CLOCK OUT';
            btn.className = 'clock-btn clocked-in';
            
            if (status.clockInTime) {
                const clockStatus = clockingSystem.getClockInStatus(status.clockInTime);
                let statusText = '';
                if (clockStatus.status === 'late') {
                    if (clockStatus.hours > 0) {
                        statusText = `${clockStatus.hours}h ${clockStatus.minutes}m late`;
                    } else {
                        statusText = `${clockStatus.minutes}m late`;
                    }
                } else if (clockStatus.status === 'early') {
                    if (clockStatus.hours > 0) {
                        statusText = `${clockStatus.hours}h ${clockStatus.minutes}m early`;
                    } else {
                        statusText = `${clockStatus.minutes}m early`;
                    }
                } else {
                    statusText = 'On Time';
                }
                
                statusSpan.textContent = statusText;
                statusSpan.className = 'clock-status ' + 
                    (clockStatus.status === 'late' ? 'late' : 'on-time');
            }
        } else {
            btn.textContent = 'CLOCK IN';
            btn.className = 'clock-btn';
            statusSpan.textContent = '';
            statusSpan.className = 'clock-status';
        }
    }
}

// Make functions available globally
window.confirmClockAction = confirmClockAction;
window.performClockIn = performClockIn;
window.performClockOut = performClockOut;
window.updateClockDisplay = updateClockDisplay;