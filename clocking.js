// clocking.js - Complete Clock-In/Out System with Leave Management
import auth from './auth.js';
import firebaseService from './firebase-service.js';

// Configuration
const CONFIG = {
  REQUIRED_CLOCK_IN: '08:00',
  REQUIRED_CLOCK_OUT: '17:00',
  REQUIRED_HOURS: 8, // hours
  WORKING_DAYS: [1, 2, 3, 4, 5] // Monday to Friday
};

// Clocking System Object
const clockingSystem = {
  // Get today's attendance record for a user
  async getTodayAttendance(userId) {
    const today = new Date().toISOString().split('T')[0];
    const logs = await firebaseService.getAttendanceLogs(userId);
    return logs.find(log => log.date === today);
  },

  // Get all attendance for a user in current month
  async getMonthlyAttendance(userId) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return await firebaseService.getAttendanceLogs(userId, month, year);
  },

  // Calculate working days in a month (excluding weekends and public holidays)
  async calculateWorkingDays(year, month) {
    const date = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      date.setDate(day);
      const dayOfWeek = date.getDay();
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Skip weekends
      if (!CONFIG.WORKING_DAYS.includes(dayOfWeek)) continue;
      
      // Skip public holidays
      const holiday = firebaseService.isPublicHoliday(dateStr);
      if (holiday) continue;
      
      workingDays++;
    }
    
    return workingDays;
  },

  // Check if user has approved leave for a date
  async hasApprovedLeave(userId, date) {
    const requests = await firebaseService.getLeaveRequests(userId);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return requests.some(request => {
      if (request.status !== 'Approved') return false;
      
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      return targetDate >= startDate && targetDate <= endDate;
    });
  },

  // Clock In function
  async clockIn() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      showCustomModal('Error', 'Please login to clock in', 'danger');
      return false;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Check if already clocked in today
    const existing = await this.getTodayAttendance(currentUser.uid);
    if (existing && existing.clockInTime) {
      showCustomModal('Already Clocked In', `You clocked in today at ${existing.clockInTime}`, 'warning');
      return false;
    }

    // Check for approved leave
    const hasLeave = await this.hasApprovedLeave(currentUser.uid, today);
    if (hasLeave) {
      showCustomModal('Leave Day', 'You have approved leave for today. Are you sure you want to clock in?', 'warning');
    }

    // Calculate late minutes
    const requiredTime = new Date(`${today}T${CONFIG.REQUIRED_CLOCK_IN}:00`);
    const lateMinutes = Math.max(0, Math.floor((now - requiredTime) / 60000));

    // Create attendance record
    const attendance = {
      userId: currentUser.uid,
      userName: currentUser.username,
      date: today,
      clockInTime: timeStr,
      clockOutTime: null,
      totalMinutesWorked: 0,
      lateMinutes: lateMinutes,
      earlyLeaveMinutes: 0,
      overtimeMinutes: 0,
      attendanceStatus: hasLeave ? 'On Leave (Working)' : (lateMinutes > 0 ? 'Late' : 'Present'),
      createdAt: now.toISOString()
    };

    const result = await firebaseService.saveAttendanceLog(attendance);
    
    if (result.success) {
      // Update UI
      updateClockButton('in');
      
      const statusText = lateMinutes > 0 ? `You're ${lateMinutes} minutes late` : 'You\'re on time';
      showCustomModal('Clocked In', `✅ Clocked in at ${timeStr}. ${statusText}`, lateMinutes > 0 ? 'warning' : 'success');
      
      // Play sound
      playNotificationSound('clockInSound');
      
      // Record activity
      await auth.recordActivity('clock_in', `Clocked in at ${timeStr}`);
      
      return true;
    } else {
      showCustomModal('Error', 'Failed to clock in: ' + result.error, 'danger');
      return false;
    }
  },

  // Clock Out function
  async clockOut() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      showCustomModal('Error', 'Please login to clock out', 'danger');
      return false;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    // Get today's attendance
    const attendance = await this.getTodayAttendance(currentUser.uid);
    
    if (!attendance || !attendance.clockInTime) {
      showCustomModal('Error', 'You haven\'t clocked in today', 'danger');
      return false;
    }

    if (attendance.clockOutTime) {
      showCustomModal('Already Clocked Out', `You clocked out today at ${attendance.clockOutTime}`, 'warning');
      return false;
    }

    // Parse times for calculations
    const clockInTime = new Date(`${today}T${attendance.clockInTime}:00`);
    const requiredOutTime = new Date(`${today}T${CONFIG.REQUIRED_CLOCK_OUT}:00`);
    
    // Calculate minutes
    const totalMinutes = Math.floor((now - clockInTime) / 60000);
    const earlyLeaveMinutes = Math.max(0, Math.floor((requiredOutTime - now) / 60000));
    const overtimeMinutes = Math.max(0, totalMinutes - (CONFIG.REQUIRED_HOURS * 60));
    
    // Format hours worked
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const workedText = `${hours}h ${minutes}m`;

    // Determine status
    let status = 'Present';
    if (earlyLeaveMinutes > 15) status = 'Early Leave';
    if (overtimeMinutes > 60) status = 'Overtime';
    if (attendance.attendanceStatus.includes('Late')) status = 'Late';

    // Update attendance record
    const updatedAttendance = {
      ...attendance,
      clockOutTime: timeStr,
      totalMinutesWorked: totalMinutes,
      earlyLeaveMinutes: earlyLeaveMinutes,
      overtimeMinutes: overtimeMinutes,
      attendanceStatus: status,
      lastUpdated: now.toISOString()
    };

    const result = await firebaseService.saveAttendanceLog(updatedAttendance);
    
    if (result.success) {
      // Update UI
      updateClockButton('out');
      
      let message = `✅ Clocked out at ${timeStr}. Worked: ${workedText}.`;
      if (earlyLeaveMinutes > 0) message += ` Left ${earlyLeaveMinutes} minutes early.`;
      if (overtimeMinutes > 0) message += ` Overtime: ${Math.floor(overtimeMinutes / 60)}h ${overtimeMinutes % 60}m.`;
      
      showCustomModal('Clocked Out', message, 'info');
      
      // Play sound
      playNotificationSound('clockOutSound');
      
      // Record activity
      await auth.recordActivity('clock_out', `Clocked out after ${workedText}`);
      
      return true;
    } else {
      showCustomModal('Error', 'Failed to clock out: ' + result.error, 'danger');
      return false;
    }
  },

  // Request Leave
  async requestLeave(leaveData) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      showCustomModal('Error', 'Please login to request leave', 'danger');
      return false;
    }

    const request = {
      userId: currentUser.uid,
      userName: currentUser.username,
      leaveTypeId: leaveData.type,
      leaveTypeName: leaveData.typeName,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      totalDays: leaveData.totalDays,
      isHalfDay: leaveData.isHalfDay || false,
      reason: leaveData.reason,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const result = await firebaseService.saveLeaveRequest(request);
    
    if (result.success) {
      showCustomModal('Leave Requested', 'Your leave request has been submitted for approval.', 'success');
      return true;
    } else {
      showCustomModal('Error', 'Failed to submit leave request: ' + result.error, 'danger');
      return false;
    }
  },

  // Auto-generate attendance for absent days (run daily)
  async generateAbsentRecords() {
    const users = await firebaseService.getAllUsers();
    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().getDay();
    
    // Skip weekends
    if (!CONFIG.WORKING_DAYS.includes(dayOfWeek)) return;
    
    // Skip public holidays
    if (firebaseService.isPublicHoliday(today)) return;
    
    for (const user of users) {
      // Check if user already has a record for today
      const existing = await this.getTodayAttendance(user.uid);
      if (existing) continue;
      
      // Check if user has approved leave
      const hasLeave = await this.hasApprovedLeave(user.uid, today);
      
      const absentRecord = {
        userId: user.uid,
        userName: user.username,
        date: today,
        clockInTime: null,
        clockOutTime: null,
        totalMinutesWorked: 0,
        lateMinutes: 0,
        earlyLeaveMinutes: 0,
        overtimeMinutes: 0,
        attendanceStatus: hasLeave ? 'On Leave' : 'Absent',
        createdAt: new Date().toISOString(),
        isAutoGenerated: true
      };
      
      await firebaseService.saveAttendanceLog(absentRecord);
    }
  }
};

// UI Update Functions
function updateClockButton(action) {
  const clockBtn = document.getElementById('clockBtn');
  const clockStatus = document.getElementById('clockStatus');
  
  if (!clockBtn) return;
  
  if (action === 'in') {
    clockBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> CLOCK OUT';
    clockBtn.classList.add('clocked-in');
    if (clockStatus) {
      clockStatus.innerHTML = '<i class="fas fa-circle" style="color: var(--success); font-size: 0.6rem;"></i> Clocked In';
      clockStatus.classList.add('active');
    }
  } else {
    clockBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> CLOCK IN';
    clockBtn.classList.remove('clocked-in');
    if (clockStatus) {
      clockStatus.innerHTML = '';
      clockStatus.classList.remove('active');
    }
  }
}

async function updateClockDisplay() {
  const currentUser = auth.getCurrentUser();
  if (!currentUser) return;
  
  const attendance = await clockingSystem.getTodayAttendance(currentUser.uid);
  const clockBtn = document.getElementById('clockBtn');
  
  if (clockBtn) {
    if (attendance && attendance.clockInTime && !attendance.clockOutTime) {
      clockBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> CLOCK OUT';
      clockBtn.classList.add('clocked-in');
    } else {
      clockBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> CLOCK IN';
      clockBtn.classList.remove('clocked-in');
    }
  }
}

// Confirmation Dialog
function confirmClockAction() {
  const currentUser = auth.getCurrentUser();
  if (!currentUser) {
    showCustomModal('Error', 'Please login first', 'danger');
    return;
  }
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  clockingSystem.getTodayAttendance(currentUser.uid).then(attendance => {
    const isClockedIn = attendance && attendance.clockInTime && !attendance.clockOutTime;
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
      <div class="custom-modal info">
        <div class="custom-modal-header">
          <h3>Confirm Clock ${isClockedIn ? 'OUT' : 'IN'}</h3>
          <button class="custom-modal-close" onclick="this.closest('.custom-modal-overlay').remove()">&times;</button>
        </div>
        <div class="custom-modal-body">
          <p style="text-align: center; font-size: 1.2rem;">Are you sure you want to clock ${isClockedIn ? 'out' : 'in'} at <strong>${timeStr}</strong>?</p>
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.custom-modal-overlay').remove()">Cancel</button>
            <button class="btn-primary" style="flex: 1; background: ${isClockedIn ? 'var(--danger)' : 'var(--success)'};" 
                    onclick="performClockAction('${isClockedIn ? 'out' : 'in'}')">Confirm</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  });
}

async function performClockAction(action) {
  document.querySelector('.custom-modal-overlay').remove();
  
  if (action === 'in') {
    await clockingSystem.clockIn();
  } else {
    await clockingSystem.clockOut();
  }
}

// Leave Request Modal
function openLeaveModal() {
  const currentUser = auth.getCurrentUser();
  if (!currentUser) {
    showCustomModal('Error', 'Please login to request leave', 'danger');
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  const modal = document.createElement('div');
  modal.className = 'custom-modal-overlay';
  modal.innerHTML = `
    <div class="custom-modal" style="max-width: 500px;">
      <div class="custom-modal-header">
        <h3>Request Leave</h3>
        <button class="custom-modal-close" onclick="this.closest('.custom-modal-overlay').remove()">&times;</button>
      </div>
      <div class="custom-modal-body">
        <form id="leaveRequestForm" onsubmit="submitLeaveRequest(event)">
          <div class="form-group">
            <label>Leave Type *</label>
            <select id="leaveType" required>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="study">Study Leave</option>
              <option value="family">Family Responsibility</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Start Date *</label>
              <input type="date" id="leaveStartDate" min="${today}" required>
            </div>
            <div class="form-group">
              <label>End Date *</label>
              <input type="date" id="leaveEndDate" min="${today}" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>
              <input type="checkbox" id="halfDayLeave"> Half Day
            </label>
          </div>
          
          <div class="form-group">
            <label>Reason *</label>
            <textarea id="leaveReason" rows="3" required></textarea>
          </div>
          
          <div class="btn-group">
            <button type="button" class="btn-secondary" onclick="this.closest('.custom-modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn-primary">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Auto-calculate days
  const startInput = document.getElementById('leaveStartDate');
  const endInput = document.getElementById('leaveEndDate');
  
  startInput.addEventListener('change', calculateLeaveDays);
  endInput.addEventListener('change', calculateLeaveDays);
}

function calculateLeaveDays() {
  const start = document.getElementById('leaveStartDate').value;
  const end = document.getElementById('leaveEndDate').value;
  const halfDay = document.getElementById('halfDayLeave');
  
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    let daysText = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    if (halfDay.checked) {
      const halfDays = (diffDays - 0.5).toFixed(1);
      daysText = `${halfDays} days (including half day)`;
    }
    
    // Show calculation
    let calcElement = document.getElementById('leaveDaysCalc');
    if (!calcElement) {
      calcElement = document.createElement('div');
      calcElement.id = 'leaveDaysCalc';
      calcElement.style.marginTop = '10px';
      calcElement.style.padding = '10px';
      calcElement.style.background = 'rgba(56, 189, 248, 0.1)';
      calcElement.style.borderRadius = '8px';
      document.getElementById('leaveReason').parentNode.insertBefore(calcElement, document.getElementById('leaveReason'));
    }
    calcElement.innerHTML = `<i class="fas fa-calculator"></i> Total: <strong>${daysText}</strong>`;
  }
}

async function submitLeaveRequest(event) {
  event.preventDefault();
  
  const leaveType = document.getElementById('leaveType');
  const leaveData = {
    type: leaveType.value,
    typeName: leaveType.options[leaveType.selectedIndex].text,
    startDate: document.getElementById('leaveStartDate').value,
    endDate: document.getElementById('leaveEndDate').value,
    isHalfDay: document.getElementById('halfDayLeave').checked,
    reason: document.getElementById('leaveReason').value,
    totalDays: calculateTotalDays()
  };
  
  const success = await clockingSystem.requestLeave(leaveData);
  if (success) {
    document.querySelector('.custom-modal-overlay').remove();
  }
}

function calculateTotalDays() {
  const start = document.getElementById('leaveStartDate').value;
  const end = document.getElementById('leaveEndDate').value;
  const halfDay = document.getElementById('halfDayLeave').checked;
  
  if (!start || !end) return 0;
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return halfDay ? diffDays - 0.5 : diffDays;
}

// Initialize
async function initClocking() {
  const currentUser = auth.getCurrentUser();
  if (currentUser) {
    await updateClockDisplay();
  }
  
  // Auto-generate absent records at midnight
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 5, 0
  );
  const msToMidnight = night.getTime() - now.getTime();
  
  setTimeout(() => {
    clockingSystem.generateAbsentRecords();
    setInterval(clockingSystem.generateAbsentRecords, 24 * 60 * 60 * 1000);
  }, msToMidnight);
}

// Make available globally
window.clockingSystem = clockingSystem;
window.confirmClockAction = confirmClockAction;
window.performClockAction = performClockAction;
window.updateClockDisplay = updateClockDisplay;
window.initClocking = initClocking;
window.openLeaveModal = openLeaveModal;
window.submitLeaveRequest = submitLeaveRequest;

// Export
export {
  clockingSystem,
  confirmClockAction,
  performClockAction,
  updateClockDisplay,
  initClocking,
  openLeaveModal
};