// main.js
import auth from './auth.js';
import firebaseService from './firebase-service.js';

let projects = {};
let updates = [];
let currentSlide = 0;
let slideInterval;

const clockingSystem = {
  workingHours: {
    start: 7.5,
    end: 16.5,
    days: [1, 2, 3, 4, 5]
  },
  
  getClockingStatus: function(username) {
    return JSON.parse(localStorage.getItem('clockingStatus_' + username)) || {
      clockedIn: false,
      clockInTime: null,
      clockOutTime: null,
      lastClockDate: null
    };
  },
  
  setClockingStatus: function(username, status) {
    localStorage.setItem('clockingStatus_' + username, JSON.stringify(status));
    firebaseService.saveClockingStatus(username, status);
  },
  
  getClockingHistory: function(username) {
    return JSON.parse(localStorage.getItem('clockingHistory_' + username)) || [];
  },
  
  addToHistory: function(username, entry) {
    let history = this.getClockingHistory(username);
    history.unshift(entry);
    localStorage.setItem('clockingHistory_' + username, JSON.stringify(history.slice(0, 100)));
    firebaseService.addClockingHistory(username, entry);
  },
  
  isWorkingDay: function() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return this.workingHours.days.includes(dayOfWeek);
  },
  
  getClockInStatus: function(clockInTime) {
    const clockInDate = new Date(clockInTime);
    const clockInHour = clockInDate.getHours() + (clockInDate.getMinutes() / 60);
    const startHour = this.workingHours.start;
    
    if (clockInHour < startHour) {
      const minutesEarly = Math.round((startHour - clockInHour) * 60);
      return { 
        status: 'early', 
        hours: Math.floor(minutesEarly / 60),
        minutes: minutesEarly % 60
      };
    } else if (clockInHour > startHour) {
      const minutesLate = Math.round((clockInHour - startHour) * 60);
      return { 
        status: 'late', 
        hours: Math.floor(minutesLate / 60),
        minutes: minutesLate % 60
      };
    } else {
      return { status: 'on-time', hours: 0, minutes: 0 };
    }
  },
  
  calculateWorkDuration: function(clockInTime, clockOutTime) {
    const start = new Date(clockInTime);
    const end = new Date(clockOutTime);
    const diffMs = end - start;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  }
};

function playNotificationSound(type) {
  const audio = document.getElementById(type + 'Sound');
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
  }
}

async function initApp() {
  const currentUser = auth.getCurrentUser();
  if (!currentUser && !window.location.pathname.includes('login.html')) {
    if (!window.location.pathname.includes('index.html') && 
        window.location.pathname !== '/' &&
        !window.location.pathname.endsWith('/')) {
      window.location.href = 'login.html';
    }
    return;
  }

  await loadData();
  initHeroSlider();
  updateUserInfo();
  renderProjects();
  if (typeof loadUpdates === 'function') {
    loadUpdates();
  }
  updateClockDisplay();
  updateTopProject();
  
  setInterval(updateUserInfo, 60000);
  
  if (currentUser) {
    auth.recordActivity('view', 'Viewed dashboard');
    //playNotificationSound('login');
  }
}

async function loadData() {
  projects = await firebaseService.getProjects();
  updates = await firebaseService.getUpdates();
  
  localStorage.setItem('prospenProjects', JSON.stringify(projects));
  localStorage.setItem('prospenUpdates', JSON.stringify(updates));
}

function updateUserInfo() {
  const currentUser = auth.getCurrentUser();
  if (!currentUser) return;
  
  const userNameElement = document.getElementById('currentUserName');
  const sessionDurationElement = document.getElementById('sessionDuration');
  
  if (userNameElement) {
    userNameElement.textContent = currentUser.username;
  }
  
  if (sessionDurationElement) {
    const duration = auth.getSessionDuration();
    sessionDurationElement.textContent = duration + ' min';
  }
}

function updateTopProject() {
  let bestProject = null;
  let maxProgress = 0;
  
  Object.values(projects).forEach(project => {
    const totalTasks = project.tasks?.length || 0;
    const completedTasks = project.tasks?.filter(t => t.status === 'Completed')?.length || 0;
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

function renderProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  
  if (Object.keys(projects).length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: var(--text-p); padding: 20px;">No projects found. Click "ADD PROJECT" to create your first project.</p>';
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
  const currentUser = auth.getCurrentUser();
  if (currentUser) {
    auth.recordActivity('view', `Viewed project "${projects[id]?.name}"`, id);
  }
  
  localStorage.setItem('currentProjectView', id);
  showProjectView(id);
}

function showProjectView(id) {
  const projectView = document.getElementById('project-view');
  const landing = document.getElementById('landing');
  const p = projects[id];
  
  if (!projectView || !p) return;
  
  if (landing) landing.style.display = 'none';
  
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

function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  
  if (slides.length === 0 || dots.length === 0) return;
  
  slides.forEach((slide, index) => {
    slide.classList.remove('active');
    if (dots[index]) dots[index].classList.remove('active');
  });
  
  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  
  updateWelcomeMessage();
  updateTopProject();
  
  clearInterval(window.slideInterval);
  
  window.slideInterval = setInterval(() => {
    if (slides.length > 0) {
      if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      
      currentSlide = (currentSlide + 1) % slides.length;
      
      if (slides[currentSlide]) slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
  }, 5000);
}

function nextSlide() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  
  if (slides.length === 0) return;
  
  if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
  
  currentSlide = (currentSlide + 1) % slides.length;
  
  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  
  clearInterval(window.slideInterval);
  window.slideInterval = setInterval(nextSlide, 5000);
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  
  if (slides.length === 0 || index >= slides.length) return;
  
  if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
  
  currentSlide = index;
  
  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  
  clearInterval(window.slideInterval);
  window.slideInterval = setInterval(nextSlide, 5000);
}

function updateWelcomeMessage() {
  const currentUser = auth.getCurrentUser();
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (currentUser && welcomeMessage) {
    const pendingTasks = getPendingTaskCount();
    welcomeMessage.textContent = `Welcome ${currentUser.username}, you have ${pendingTasks} tasks pending.`;
  }
}

function getPendingTaskCount() {
  let total = 0;
  Object.values(projects).forEach(project => {
    if (project.tasks) {
      project.tasks.forEach(task => {
        if (task.status !== 'Completed') {
          total++;
        }
      });
    }
  });
  return total;
}

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

function calculateTotalBudget(project) {
  if (!project.budget || !project.budget.items) return 0;
  return project.budget.items.reduce((total, item) => total + (item.amount || 0), 0);
}

function calculateSpentBudget(project) {
  if (!project.budget || !project.budget.items) return 0;
  return project.budget.items.reduce((total, item) => total + (item.spent || 0), 0);
}

window.clockingSystem = clockingSystem;
window.showCustomModal = showCustomModal;
window.updateUserInfo = updateUserInfo;
window.updateTopProject = updateTopProject;
window.renderProjects = renderProjects;
window.openProject = openProject;
window.closeProject = closeProject;
window.showProjectView = showProjectView;
window.initHeroSlider = initHeroSlider;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;
window.updateWelcomeMessage = updateWelcomeMessage;
window.getPendingTaskCount = getPendingTaskCount;
window.formatDate = formatDate;
window.playNotificationSound = playNotificationSound;
window.calculateTotalBudget = calculateTotalBudget;
window.calculateSpentBudget = calculateSpentBudget;

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('index.html') || 
      window.location.pathname === '/' ||
      window.location.pathname.endsWith('/')) {
    setTimeout(initApp, 500);
  }
});