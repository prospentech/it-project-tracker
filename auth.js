// auth.js
import firebaseService from './firebase-service.js';

class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
    
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.includes('login.html');
    const isRootPage = currentPage === '/' || currentPage.includes('index.html');
    
    if (!this.currentUser && !isLoginPage && !isRootPage) {
      window.location.href = 'login.html';
    }
  }

  async login(username, password) {
    const result = await firebaseService.login(username, password);
    
    if (result.success) {
      this.currentUser = {
        uid: result.user.uid,
        username: username,
        email: result.user.email,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      await firebaseService.recordActivity('login', 'User logged in');
      this.playSound('loginSound');
      
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  }

  async logout() {
    if (this.currentUser) {
      await firebaseService.recordActivity('logout', 'User logged out');
      this.playSound('logoutSound');
      
      const loginTime = new Date(this.currentUser.loginTime);
      const logoutTime = new Date();
      const duration = Math.round((logoutTime - loginTime) / 1000 / 60);
      
      let sessions = JSON.parse(localStorage.getItem('userSessions')) || [];
      sessions.push({
        user: this.currentUser.username,
        loginTime: this.currentUser.loginTime,
        logoutTime: logoutTime.toISOString(),
        duration: duration
      });
      localStorage.setItem('userSessions', JSON.stringify(sessions.slice(0, 50)));
      
      await this.autoClockOut();
    }
    
    await firebaseService.logout();
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    window.location.href = 'login.html';
  }

  playSound(soundId) {
    try {
      const sound = document.getElementById(soundId);
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play failed:", e));
      }
    } catch (e) {
      console.log("Sound error:", e);
    }
  }

  async autoClockOut() {
    if (!this.currentUser) return;
    
    let clockingStatus = JSON.parse(localStorage.getItem('clockingStatus_' + this.currentUser.username)) || {
      clockedIn: false,
      clockInTime: null,
      clockOutTime: null,
      lastClockDate: null
    };
    
    if (clockingStatus.clockedIn && clockingStatus.clockInTime) {
      clockingStatus.clockedIn = false;
      clockingStatus.clockOutTime = new Date().toISOString();
      
      const clockInTime = new Date(clockingStatus.clockInTime);
      const clockOutTime = new Date(clockingStatus.clockOutTime);
      const diffMs = clockOutTime - clockInTime;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let history = JSON.parse(localStorage.getItem('clockingHistory_' + this.currentUser.username)) || [];
      history.unshift({
        date: new Date().toDateString(),
        clockIn: clockInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        clockOut: clockOutTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        duration: `${hours}h ${minutes}m`,
        type: 'Auto clock-out on logout'
      });
      localStorage.setItem('clockingHistory_' + this.currentUser.username, JSON.stringify(history.slice(0, 100)));
      
      localStorage.setItem('clockingStatus_' + this.currentUser.username, JSON.stringify(clockingStatus));
      
      await firebaseService.recordActivity('clock_out', `Auto clocked out after ${hours}h ${minutes}m`);
    }
  }

  async recordActivity(action, details, projectId = null) {
    await firebaseService.recordActivity(action, details, projectId);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getSessionDuration() {
    if (!this.currentUser || !this.currentUser.loginTime) return 0;
    
    const loginTime = new Date(this.currentUser.loginTime);
    const currentTime = new Date();
    return Math.round((currentTime - loginTime) / 1000 / 60);
  }
  
  async getUserProfile(username) {
    return await firebaseService.getUserProfile(username);
  }
}

const auth = new AuthSystem();
export default auth;
window.auth = auth;