// clocking.js - Complete Clock-In/Out System with Leave Management
import auth from './auth.js';
import firebaseService from './firebase-service.js';

// Configuration
const CONFIG = {
  REQUIRED_CLOCK_IN: '07:30',
  REQUIRED_CLOCK_OUT: '16:30',
  REQUIRED_HOURS: 8, // hours
  WORKING_DAYS: [1, 2, 3, 4, 5], // Monday to Friday
  
  // Sandton office coordinates (approximate center point)
  OFFICE_LOCATION: {
    lat: -26.0910296,
    lng: 28.0855317,
    radius: 25000 // 25km radius in meters
  }
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

  // Calculate distance from office (in meters)
  calculateDistanceFromOffice(lat, lng) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = CONFIG.OFFICE_LOCATION.lat * Math.PI / 180;
    const φ2 = lat * Math.PI / 180;
    const Δφ = (lat - CONFIG.OFFICE_LOCATION.lat) * Math.PI / 180;
    const Δλ = (lng - CONFIG.OFFICE_LOCATION.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  },

  // Get user's location
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
        error => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  },

  // Determine work location based on coordinates or user selection
  determineWorkLocation(coordinates, selectedLocation = null) {
    if (selectedLocation) return selectedLocation;

    if (!coordinates) return 'Remote';

    try {
      const distance = this.calculateDistanceFromOffice(coordinates.lat, coordinates.lng);
      return distance <= CONFIG.OFFICE_LOCATION.radius ? 'On-site' : 'Remote';
    } catch (error) {
      console.error('Error determining location:', error);
      return 'Remote';
    }
  },

  // Parse existing session times to calculate total minutes worked
  parseExistingSessions(attendance) {
    if (!attendance || !attendance.sessions || !Array.isArray(attendance.sessions)) {
      return 0;
    }
    
    return attendance.sessions.reduce((total, session) => {
      if (session.clockOutTime) {
        // Parse completed session
        const clockIn = new Date(`${attendance.date}T${session.clockInTime}:00`);
        const clockOut = new Date(`${attendance.date}T${session.clockOutTime}:00`);
        return total + Math.floor((clockOut - clockIn) / 60000);
      }
      return total;
    }, 0);
  },

  // Clock In function
  async clockIn(locationOverride = null) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      showCustomModal('Error', 'Please login to clock in', 'danger');
      return false;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

    // Get today's attendance record
    let attendance = await this.getTodayAttendance(currentUser.uid);
    
    // Check for approved leave
    const hasLeave = await this.hasApprovedLeave(currentUser.uid, today);
    if (hasLeave) {
      showCustomModal('Leave Day', 'You have approved leave for today. Are you sure you want to clock in?', 'warning');
    }

    // Get user location if available
    let coordinates = null;
    try {
      coordinates = await this.getUserLocation();
    } catch (error) {
      console.log('Location not available:', error);
    }

    // Determine work location
    const workLocation = this.determineWorkLocation(coordinates, locationOverride);

    // Calculate late minutes (only on weekdays)
    const isWeekend = !CONFIG.WORKING_DAYS.includes(dayOfWeek);
    let lateMinutes = 0;
    let status = 'Present';

    if (isWeekend) {
      // Weekend work is automatically overtime
      status = 'Overtime';
    } else {
      // Calculate late minutes for weekdays (only if this is the first session of the day)
      if (!attendance || !attendance.sessions || attendance.sessions.length === 0) {
        const requiredTime = new Date(`${today}T${CONFIG.REQUIRED_CLOCK_IN}:00`);
        lateMinutes = Math.max(0, Math.floor((now - requiredTime) / 60000));
        if (lateMinutes > 0) status = 'Late';
      }
    }

    // Create new session
    const newSession = {
      clockInTime: timeStr,
      clockOutTime: null,
      sessionStart: now.toISOString()
    };

    if (attendance) {
      // Update existing attendance record
      if (!attendance.sessions) {
        attendance.sessions = [];
      }
      
      // Add new session
      attendance.sessions.push(newSession);
      
      // Update total minutes worked (including previous sessions)
      attendance.totalMinutesWorked = this.parseExistingSessions(attendance);
      
      // Update late minutes only if this is the first session and it's late
      if (attendance.sessions.length === 1 && lateMinutes > 0) {
        attendance.lateMinutes = lateMinutes;
        attendance.attendanceStatus = 'Late';
      } else if (isWeekend) {
        attendance.attendanceStatus = 'Overtime';
      }
      
      attendance.lastUpdated = now.toISOString();
      attendance.workLocation = workLocation; // Update location for the day
      
    } else {
      // Create new attendance record
      attendance = {
        userId: currentUser.uid,
        userName: currentUser.username,
        date: today,
        sessions: [newSession],
        totalMinutesWorked: 0,
        lateMinutes: lateMinutes,
        earlyLeaveMinutes: 0,
        overtimeMinutes: 0,
        workLocation: workLocation,
        attendanceStatus: hasLeave ? 'On Leave (Working)' : status,
        isWeekend: isWeekend,
        coordinates: coordinates ? JSON.stringify(coordinates) : null,
        createdAt: now.toISOString()
      };
    }

    const result = await firebaseService.saveAttendanceLog(attendance);
    
    if (result.success) {
      // Update UI immediately
      await updateClockDisplay();
      
      const sessionCount = attendance.sessions ? attendance.sessions.length : 1;
      const statusText = isWeekend ? 'Working on weekend (Overtime)' : 
                         (sessionCount > 1 ? `Session #${sessionCount}` : 
                          (lateMinutes > 0 ? `You're ${lateMinutes} minutes late` : 'You\'re on time'));
      
      const locationText = `Location: ${workLocation}`;
      
      showCustomModal('Clocked In', 
        `✅ Clocked in at ${timeStr} (Session #${sessionCount}). ${statusText}. ${locationText}`, 
        isWeekend ? 'warning' : (lateMinutes > 0 ? 'warning' : 'success'));
      
      // Play sound
      playNotificationSound('clockInSound');
      
      // Record activity
      await auth.recordActivity('clock_in', `Clocked in at ${timeStr} (Session #${sessionCount}, ${workLocation})`);
      
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
    const dayOfWeek = now.getDay();
    const isWeekend = !CONFIG.WORKING_DAYS.includes(dayOfWeek);

    // Get today's attendance
    const attendance = await this.getTodayAttendance(currentUser.uid);
    
    if (!attendance || !attendance.sessions || attendance.sessions.length === 0) {
      showCustomModal('Error', 'You haven\'t clocked in today', 'danger');
      return false;
    }

    // Find the current open session (last session with no clockOutTime)
    const currentSession = attendance.sessions.find(s => !s.clockOutTime);
    
    if (!currentSession) {
      showCustomModal('Already Clocked Out', 'You have already clocked out from all sessions today', 'warning');
      return false;
    }

    // Update the current session
    currentSession.clockOutTime = timeStr;
    currentSession.sessionEnd = now.toISOString();

    // Calculate total minutes worked including all sessions
    const totalMinutes = this.parseExistingSessions(attendance);
    
    // Also add the current session's time
    const clockInTime = new Date(`${today}T${currentSession.clockInTime}:00`);
    const currentSessionMinutes = Math.floor((now - clockInTime) / 60000);
    const newTotalMinutes = totalMinutes + currentSessionMinutes;
    
    const hours = Math.floor(newTotalMinutes / 60);
    const minutes = newTotalMinutes % 60;
    const workedText = `${hours}h ${minutes}m`;

    let earlyLeaveMinutes = 0;
    let overtimeMinutes = attendance.overtimeMinutes || 0;
    let status = attendance.attendanceStatus;

    if (!isWeekend) {
      // Weekday calculations
      const requiredOutTime = new Date(`${today}T${CONFIG.REQUIRED_CLOCK_OUT}:00`);
      earlyLeaveMinutes = Math.max(0, Math.floor((requiredOutTime - now) / 60000));
      
      // Calculate overtime (beyond 8 hours)
      const baseWorkMinutes = Math.min(newTotalMinutes, CONFIG.REQUIRED_HOURS * 60);
      overtimeMinutes = Math.max(0, newTotalMinutes - (CONFIG.REQUIRED_HOURS * 60));
      
      // Update status based on overall day
      if (attendance.lateMinutes > 0) {
        status = 'Late';
      } else if (earlyLeaveMinutes > 15) {
        status = 'Early Leave';
      } else if (overtimeMinutes > 60) {
        status = 'Overtime';
      } else {
        status = 'Present';
      }
    } else {
      // Weekend - all hours are overtime
      overtimeMinutes = newTotalMinutes;
      status = 'Overtime';
    }

    // Check if there are still open sessions
    const hasOpenSessions = attendance.sessions.some(s => !s.clockOutTime);

    // Update attendance record
    attendance.totalMinutesWorked = newTotalMinutes;
    attendance.earlyLeaveMinutes = earlyLeaveMinutes;
    attendance.overtimeMinutes = overtimeMinutes;
    attendance.attendanceStatus = status;
    attendance.lastUpdated = now.toISOString();

    const result = await firebaseService.saveAttendanceLog(attendance);
    
    if (result.success) {
      // Update UI immediately
      await updateClockDisplay();
      
      let message = '';
      if (hasOpenSessions) {
        message = `✅ Clocked out from session at ${timeStr}. Total worked today: ${workedText}. You still have open sessions.`;
      } else {
        message = `✅ Clocked out from final session at ${timeStr}. Total worked today: ${workedText}.`;
      }
      message += ` Location: ${attendance.workLocation}.`;
      
      if (isWeekend) {
        message += ` Weekend work: ${workedText} overtime.`;
      } else {
        if (earlyLeaveMinutes > 0) message += ` Left ${earlyLeaveMinutes} minutes early.`;
        if (overtimeMinutes > 0) message += ` Overtime: ${Math.floor(overtimeMinutes / 60)}h ${overtimeMinutes % 60}m.`;
      }
      
      showCustomModal('Clocked Out', message, 'info');
      
      // Play sound
      playNotificationSound('clockOutSound');
      
      // Record activity
      await auth.recordActivity('clock_out', `Clocked out from session at ${timeStr}. Total: ${workedText} (${attendance.workLocation})`);
      
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
        sessions: [],
        totalMinutesWorked: 0,
        lateMinutes: 0,
        earlyLeaveMinutes: 0,
        overtimeMinutes: 0,
        workLocation: 'Remote',
        attendanceStatus: hasLeave ? 'On Leave' : 'Absent',
        createdAt: new Date().toISOString(),
        isAutoGenerated: true
      };
      
      await firebaseService.saveAttendanceLog(absentRecord);
    }
  }
};

// UI Update Functions
async function updateClockButton(action) {
  const clockBtn = document.getElementById('clockBtn');
  const clockStatus = document.getElementById('clockStatus');
  
  if (!clockBtn) return;
  
  if (action === 'in') {
    clockBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> CLOCK OUT';
    clockBtn.classList.add('clocked-in');
    if (clockStatus) {
      const attendance = await clockingSystem.getTodayAttendance(auth.getCurrentUser()?.uid);
      const sessionCount = attendance?.sessions?.filter(s => !s.clockOutTime).length || 0;
      clockStatus.innerHTML = `<i class="fas fa-circle" style="color: var(--success); font-size: 0.6rem;"></i> Clocked In (${sessionCount} active session${sessionCount !== 1 ? 's' : ''})`;
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
  const clockStatus = document.getElementById('clockStatus');
  
  if (clockBtn) {
    if (attendance && attendance.sessions && attendance.sessions.some(s => !s.clockOutTime)) {
      const activeSessions = attendance.sessions.filter(s => !s.clockOutTime).length;
      clockBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> CLOCK OUT';
      clockBtn.classList.add('clocked-in');
      if (clockStatus) {
        clockStatus.innerHTML = `<i class="fas fa-circle" style="color: var(--success); font-size: 0.6rem;"></i> Clocked In (${activeSessions} active session${activeSessions !== 1 ? 's' : ''})`;
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
}

// Confirmation Dialog with Location Options
function confirmClockAction() {
  const currentUser = auth.getCurrentUser();
  if (!currentUser) {
    showCustomModal('Error', 'Please login first', 'danger');
    return;
  }
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dayOfWeek = now.getDay();
  const isWeekend = !CONFIG.WORKING_DAYS.includes(dayOfWeek);
  
  clockingSystem.getTodayAttendance(currentUser.uid).then(attendance => {
    const hasOpenSessions = attendance && attendance.sessions && attendance.sessions.some(s => !s.clockOutTime);
    
    if (hasOpenSessions) {
      // Clock out confirmation
      showClockOutModal(timeStr, attendance);
    } else {
      // Clock in with location options
      showClockInModal(timeStr, isWeekend, attendance);
    }
  });
}

function showClockInModal(timeStr, isWeekend, existingAttendance) {
  const sessionCount = existingAttendance?.sessions?.length || 0;
  const nextSessionNum = sessionCount + 1;
  
  const modal = document.createElement('div');
  modal.className = 'custom-modal-overlay';
  modal.innerHTML = `
    <div class="custom-modal info" style="max-width: 450px;">
      <div class="custom-modal-header">
        <h3>Clock In Confirmation</h3>
        <button class="custom-modal-close" onclick="this.closest('.custom-modal-overlay').remove()">&times;</button>
      </div>
      <div class="custom-modal-body">
        <p style="text-align: center; margin-bottom: 20px;">
          Clocking in at <strong>${timeStr}</strong><br>
          ${sessionCount > 0 ? `<small>This will be session #${nextSessionNum} today</small>` : ''}
        </p>
        
        <p style="margin-bottom: 10px;"><i class="fas fa-map-marker-alt"></i> Select your work location:</p>
        
        <div style="display: grid; gap: 10px; margin-bottom: 20px;">
          <label style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer;">
            <input type="radio" name="workLocation" value="On-site" id="locOnsite" checked>
            <i class="fas fa-building" style="color: var(--accent);"></i>
            <span>On-site (at office)</span>
          </label>
          
          <label style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer;">
            <input type="radio" name="workLocation" value="Remote" id="locRemote">
            <i class="fas fa-home" style="color: var(--accent);"></i>
            <span>Remote (working from home)</span>
          </label>
          
          <label style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer;">
            <input type="radio" name="workLocation" value="Client Site" id="locClient">
            <i class="fas fa-briefcase" style="color: var(--accent);"></i>
            <span>Client Site</span>
          </label>
        </div>
        
        <div style="background: rgba(56, 189, 248, 0.1); padding: 10px; border-radius: 8px; margin-bottom: 20px;">
          <i class="fas fa-info-circle" style="color: var(--accent);"></i>
          <small> ${isWeekend ? '⚠️ Weekend work will be recorded as Overtime.' : ''}</small>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.custom-modal-overlay').remove()">Cancel</button>
          <button class="btn-primary" style="flex: 1; background: var(--success);" 
                  onclick="performClockInWithLocation()">Confirm Clock In</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function showClockOutModal(timeStr, attendance) {
  const activeSessions = attendance.sessions.filter(s => !s.clockOutTime).length;
  const totalWorkedMinutes = clockingSystem.parseExistingSessions(attendance);
  const hours = Math.floor(totalWorkedMinutes / 60);
  const minutes = totalWorkedMinutes % 60;
  
  const modal = document.createElement('div');
  modal.className = 'custom-modal-overlay';
  modal.innerHTML = `
    <div class="custom-modal info" style="max-width: 450px;">
      <div class="custom-modal-header">
        <h3>Clock Out Confirmation</h3>
        <button class="custom-modal-close" onclick="this.closest('.custom-modal-overlay').remove()">&times;</button>
      </div>
      <div class="custom-modal-body">
        <p style="text-align: center; margin-bottom: 20px;">
          Clocking out at <strong>${timeStr}</strong><br>
          <small>You have ${activeSessions} active session${activeSessions !== 1 ? 's' : ''}</small><br>
          <small>Total worked so far today: ${hours}h ${minutes}m</small>
        </p>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.custom-modal-overlay').remove()">Cancel</button>
          <button class="btn-primary" style="flex: 1; background: var(--danger);" 
                  onclick="performClockAction('out')">Confirm Clock Out</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

window.performClockInWithLocation = function() {
  const selectedLocation = document.querySelector('input[name="workLocation"]:checked')?.value;
  document.querySelector('.custom-modal-overlay').remove();
  performClockAction('in', selectedLocation);
};

async function performClockAction(action, locationOverride = null) {
  if (action === 'in') {
    await clockingSystem.clockIn(locationOverride);
  } else {
    await clockingSystem.clockOut();
  }
}

// Leave Request Modal (unchanged)
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

// Play notification sound helper
function playNotificationSound(soundId) {
  const audio = document.getElementById(soundId);
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

// Make available globally
window.clockingSystem = clockingSystem;
window.confirmClockAction = confirmClockAction;
window.performClockAction = performClockAction;
window.updateClockDisplay = updateClockDisplay;
window.initClocking = initClocking;
window.openLeaveModal = openLeaveModal;
window.submitLeaveRequest = submitLeaveRequest;
window.showCustomModal = showCustomModal;

// Export
export {
  clockingSystem,
  confirmClockAction,
  performClockAction,
  updateClockDisplay,
  initClocking,
  openLeaveModal
};