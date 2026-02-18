// firebase-service.js
import { 
  db, auth, storage,
  ref, set, push, get, child, update, remove, query, orderByChild, limitToLast, onValue,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile,
  storageRef, uploadString, getDownloadURL 
} from './firebase-config.js';

class FirebaseService {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  async init() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUser = {
          uid: user.uid,
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        await this.updateUserOnlineStatus(true);
      } else {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
      }
    });
  }

  // Authentication
  async login(username, password) {
    try {
      // Use the exact email format matching what you added in Firebase
      const email = `${username}@prospen.co.za`;
      console.log('Attempting login with:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user.displayName !== username) {
        await updateProfile(userCredential.user, { displayName: username });
      }
      
      // Store session in Realtime Database
      await set(ref(db, `sessions/${userCredential.user.uid}`), {
        username: username,
        loginTime: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        online: true
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Login error:', error);
      
      // Return the actual error message
      return { success: false, error: error.message };
    }
  }

  async createDemoUser(username, password) {
    try {
      const email = `${username}@prospenhub.demo`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, { displayName: username });
      
      // Create user profile in Realtime Database
      await set(ref(db, `profiles/${userCredential.user.uid}`), {
        username: username,
        fullName: username.charAt(0).toUpperCase() + username.slice(1),
        email: email,
        role: username === 'admin' ? 'Administrator' : 'Team Member',
        createdAt: new Date().toISOString()
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    if (this.currentUser) {
      await this.updateUserOnlineStatus(false);
      
      // Record logout activity
      await push(ref(db, 'activities'), {
        user: this.currentUser.username,
        action: 'logout',
        details: 'User logged out',
        timestamp: new Date().toISOString()
      });
    }
    
    await signOut(auth);
  }

  // Projects
  async getProjects() {
    try {
      const snapshot = await get(ref(db, 'projects'));
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error getting projects:', error);
      return {};
    }
  }

  async saveProject(project) {
    try {
      const projectId = project.id || push(ref(db, 'projects')).key;
      const projectRef = ref(db, `projects/${projectId}`);
      
      const projectData = {
        ...project,
        id: projectId,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: this.currentUser?.username || 'system'
      };
      
      await set(projectRef, projectData);
      
      await this.recordActivity(
        project.id ? 'update' : 'create',
        `Project "${project.name}" ${project.id ? 'updated' : 'created'}`,
        projectId
      );
      
      return { success: true, id: projectId };
    } catch (error) {
      console.error('Error saving project:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteProject(projectId) {
    try {
      await remove(ref(db, `projects/${projectId}`));
      await this.recordActivity('delete', `Project deleted`, projectId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }
  }

  // Updates
  async getUpdates() {
    try {
      const updatesQuery = query(ref(db, 'updates'), orderByChild('timestamp'), limitToLast(500));
      const snapshot = await get(updatesQuery);
      
      if (!snapshot.exists()) return [];
      
      const updates = [];
      snapshot.forEach((child) => {
        updates.push({ id: child.key, ...child.val() });
      });
      
      // Sort descending (newest first)
      return updates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error getting updates:', error);
      return [];
    }
  }

  // In firebase-service.js, replace the saveUpdate method:
  async saveUpdate(update) {
    try {
      const updateData = {
        ...update,
        timestamp: new Date().toISOString(),
        user: this.currentUser?.username || 'system'
      };
      
      // If update has an id, use it, otherwise create new
      if (update.id) {
        await set(ref(db, `updates/${update.id}`), updateData);
        return { success: true, id: update.id };
      } else {
        const newUpdateRef = push(ref(db, 'updates'));
        await set(newUpdateRef, updateData);
        
        await this.recordActivity('post_update', `Posted update: ${update.title}`);
        
        return { success: true, id: newUpdateRef.key };
      }
    } catch (error) {
      console.error('Error saving update:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteUpdate(updateId) {
    try {
      await remove(ref(db, `updates/${updateId}`));
      await this.recordActivity('delete_update', 'Deleted an update');
      return { success: true };
    } catch (error) {
      console.error('Error deleting update:', error);
      return { success: false, error: error.message };
    }
  }

  // Tasks methods
  async getTasks() {
    try {
      const snapshot = await get(ref(db, 'tasks'));
      if (!snapshot.exists()) return [];
      
      const tasks = [];
      snapshot.forEach((child) => {
        tasks.push({ id: child.key, ...child.val() });
      });
      
      // Sort by date (newest first)
      return tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async saveTask(task) {
    try {
      const taskId = task.id || push(ref(db, 'tasks')).key;
      const taskRef = ref(db, `tasks/${taskId}`);
      
      const taskData = {
        ...task,
        id: taskId,
        createdAt: task.createdAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: this.currentUser?.username || 'system'
      };
      
      await set(taskRef, taskData);
      
      await this.recordActivity(
        task.id ? 'update' : 'create',
        `Task "${task.title}" ${task.id ? 'updated' : 'created'}`,
        null,
        taskId
      );
      
      return { success: true, id: taskId };
    } catch (error) {
      console.error('Error saving task:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteTask(taskId) {
    try {
      await remove(ref(db, `tasks/${taskId}`));
      await this.recordActivity('delete', `Task deleted`, null, taskId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }
  }

  subscribeToTasks(callback) {
    const tasksRef = ref(db, 'tasks');
    return onValue(tasksRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      
      const tasks = [];
      snapshot.forEach((child) => {
        tasks.push({ id: child.key, ...child.val() });
      });
      
      callback(tasks.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }, (error) => {
      console.error('Tasks subscription error:', error);
    });
  }

  // Get all users with their profiles and online status
  // In firebase-service.js, update getAllUsers method
  async getAllUsers() {
      try {
          const usersSnapshot = await get(ref(db, 'users'));
          const profilesSnapshot = await get(ref(db, 'profiles'));
          const sessionsSnapshot = await get(ref(db, 'sessions'));
          
          const users = [];
          const userMap = new Map();
          
          // Get user data from auth (via users node)
          if (usersSnapshot.exists()) {
              usersSnapshot.forEach((child) => {
                  const userData = child.val();
                  userMap.set(child.key, {
                      uid: child.key,
                      username: userData.username || userData.email?.split('@')[0],
                      email: userData.email,
                      ...userData
                  });
              });
          }
          
          // Add profile data
          if (profilesSnapshot.exists()) {
              profilesSnapshot.forEach((child) => {
                  const profileData = child.val();
                  const existingUser = userMap.get(child.key) || {};
                  userMap.set(child.key, {
                      ...existingUser,
                      uid: child.key,
                      username: existingUser.username || profileData.username,
                      fullName: profileData.fullName || profileData.username,
                      email: profileData.email || existingUser.email,
                      role: profileData.role || 'Team Member',
                      ...profileData
                  });
              });
          }
          
          // Add online status - Check last active within 5 minutes
          const onlineUsers = new Set();
          if (sessionsSnapshot.exists()) {
              const fiveMinutesAgo = new Date();
              fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
              
              sessionsSnapshot.forEach((child) => {
                  const session = child.val();
                  if (session.online && session.lastActive) {
                      const lastActive = new Date(session.lastActive);
                      if (lastActive > fiveMinutesAgo) {
                          onlineUsers.add(session.username);
                      }
                  }
              });
          }
          
          userMap.forEach((user) => {
              if (user.username) {
                  user.online = onlineUsers.has(user.username);
                  users.push(user);
              }
          });
          
          // Default users if none exist - UPDATED with correct user information
          if (users.length === 0) {
              const defaultUsers = [
                  { 
                      username: 'admin', 
                      fullName: 'admin', 
                      email: 'admin@prospen.co.za', 
                      role: 'Administrator' 
                  },
                  { 
                      username: 'Junior', 
                      fullName: 'techsupport', 
                      email: 'techsupport@prospen.co.za', 
                      role: 'Team Member' 
                  },
                  { 
                      username: 'Buhle', 
                      fullName: 'buhle', 
                      email: 'buhle@prospen.co.za', 
                      role: 'Team Member' 
                  },
                  { 
                      username: 'AJay', 
                      fullName: 'infotech', 
                      email: 'infotech@prospen.co.za', 
                      role: 'Team Member' 
                  }
              ];
              
              defaultUsers.forEach((user, index) => {
                  users.push({
                      uid: `default_${index}`,
                      ...user,
                      online: false
                  });
              });
          }
          
          return users;
      } catch (error) {
          console.error('Error getting users:', error);
          
          // Return default users as fallback - UPDATED with correct user information
          return [
              { 
                  uid: '1', 
                  username: 'admin', 
                  fullName: 'admin', 
                  email: 'admin@prospen.co.za', 
                  role: 'Administrator', 
                  online: false 
              },
              { 
                  uid: '2', 
                  username: 'Junior', 
                  fullName: 'techsupport', 
                  email: 'techsupport@prospen.co.za', 
                  role: 'Team Member', 
                  online: false 
              },
              { 
                  uid: '3', 
                  username: 'Buhle', 
                  fullName: 'buhle', 
                  email: 'buhle@prospen.co.za', 
                  role: 'Team Member', 
                  online: false 
              },
              { 
                  uid: '4', 
                  username: 'AJay', 
                  fullName: 'infotech', 
                  email: 'infotech@prospen.co.za', 
                  role: 'Team Member', 
                  online: false 
              }
          ];
      }
  }

  // Reset user password (admin only) - Note: This requires Firebase Admin SDK
  // For now, we'll simulate it with a note
  async resetUserPassword(uid, newPassword) {
    try {
      // In production, you'd need to use Firebase Admin SDK
      // This is a placeholder that returns success for demo purposes
      console.log(`Password reset requested for user ${uid} to ${newPassword}`);
      
      // Record the activity
      await this.recordActivity('admin', `Password reset for user ${uid}`);
      
      return { success: true, message: 'Password reset functionality requires Firebase Admin SDK. This is a demo response.' };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    }
  }

  // Version Board methods
  async getVersions() {
    try {
      const snapshot = await get(ref(db, 'versions'));
      if (!snapshot.exists()) return [];
      
      const versions = [];
      snapshot.forEach((child) => {
        versions.push({ id: child.key, ...child.val() });
      });
      
      return versions.sort((a, b) => new Date(b.implDate) - new Date(a.implDate));
    } catch (error) {
      console.error('Error getting versions:', error);
      return [];
    }
  }

  async saveVersion(version) {
    try {
      const versionId = version.id || push(ref(db, 'versions')).key;
      const versionRef = ref(db, `versions/${versionId}`);
      
      const versionData = {
        ...version,
        id: versionId,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: this.currentUser?.username || 'system'
      };
      
      await set(versionRef, versionData);
      
      await this.recordActivity(
        version.id ? 'update' : 'create',
        `Version "${version.title}" ${version.id ? 'updated' : 'created'}`
      );
      
      return { success: true, id: versionId };
    } catch (error) {
      console.error('Error saving version:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteVersion(versionId) {
    try {
      await remove(ref(db, `versions/${versionId}`));
      await this.recordActivity('delete', 'Version deleted');
      return { success: true };
    } catch (error) {
      console.error('Error deleting version:', error);
      return { success: false, error: error.message };
    }
  }

  subscribeToVersions(callback) {
    const versionsRef = ref(db, 'versions');
    return onValue(versionsRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      
      const versions = [];
      snapshot.forEach((child) => {
        versions.push({ id: child.key, ...child.val() });
      });
      
      callback(versions.sort((a, b) => new Date(b.implDate) - new Date(a.implDate)));
    }, (error) => {
      console.error('Versions subscription error:', error);
    });
  }

  // Enquiries
  async getEnquiries() {
    try {
      const snapshot = await get(ref(db, 'enquiries'));
      if (!snapshot.exists()) return [];
      
      const enquiries = [];
      snapshot.forEach((child) => {
        enquiries.push({ id: child.key, ...child.val() });
      });
      
      return enquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error getting enquiries:', error);
      return [];
    }
  }

  async saveEnquiry(enquiry) {
    try {
      const enquiryData = {
        ...enquiry,
        timestamp: new Date().toISOString(),
        read: false,
        status: 'new'
      };
      
      const newEnquiryRef = push(ref(db, 'enquiries'));
      await set(newEnquiryRef, enquiryData);
      return { success: true, id: newEnquiryRef.key };
    } catch (error) {
      console.error('Error saving enquiry:', error);
      return { success: false, error: error.message };
    }
  }

  async updateEnquiry(enquiryId, data) {
    try {
      await update(ref(db, `enquiries/${enquiryId}`), data);
      return { success: true };
    } catch (error) {
      console.error('Error updating enquiry:', error);
      return { success: false, error: error.message };
    }
  }

  // Clocking
  async saveClockingStatus(username, status) {
    try {
      await set(ref(db, `clocking/${username}`), {
        ...status,
        lastUpdated: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving clocking status:', error);
      return { success: false };
    }
  }

  async getClockingStatus(username) {
    try {
      const snapshot = await get(ref(db, `clocking/${username}`));
      return snapshot.exists() ? snapshot.val() : {
        clockedIn: false,
        clockInTime: null,
        clockOutTime: null,
        lastClockDate: null
      };
    } catch (error) {
      console.error('Error getting clocking status:', error);
      return {
        clockedIn: false,
        clockInTime: null,
        clockOutTime: null,
        lastClockDate: null
      };
    }
  }

  async addClockingHistory(username, entry) {
    try {
      const historyRef = push(ref(db, `clockingHistory/${username}`));
      await set(historyRef, {
        ...entry,
        timestamp: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding clocking history:', error);
      return { success: false };
    }
  }

  // Activities
  async recordActivity(action, details, projectId = null, taskId = null) {
    if (!this.currentUser) return;
    
    try {
      await push(ref(db, 'activities'), {
        user: this.currentUser.username,
        action: action,
        details: details,
        projectId: projectId,
        taskId: taskId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  }

  async getActivities(limit = 500) {
    try {
      const activitiesQuery = query(ref(db, 'activities'), orderByChild('timestamp'), limitToLast(limit));
      const snapshot = await get(activitiesQuery);
      
      if (!snapshot.exists()) return [];
      
      const activities = [];
      snapshot.forEach((child) => {
        activities.push({ id: child.key, ...child.val() });
      });
      
      return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  }

  // Sessions
  async updateUserOnlineStatus(online) {
    if (!this.currentUser) return;
    
    try {
      await set(ref(db, `sessions/${this.currentUser.uid}`), {
        username: this.currentUser.username,
        online: online,
        lastActive: new Date().toISOString(),
        ...(online ? { loginTime: new Date().toISOString() } : { logoutTime: new Date().toISOString() })
      });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  }

  async getCurrentSessions() {
    try {
      const snapshot = await get(ref(db, 'sessions'));
      if (!snapshot.exists()) return {};
      
      const sessions = {};
      snapshot.forEach((child) => {
        if (child.val().online) {
          sessions[child.val().username] = child.val();
        }
      });
      
      return sessions;
    } catch (error) {
      console.error('Error getting sessions:', error);
      return {};
    }
  }

  // Profiles
  async getUserProfile(username) {
    try {
      const snapshot = await get(ref(db, 'profiles'));
      if (!snapshot.exists()) return null;
      
      let userProfile = null;
      snapshot.forEach((child) => {
        if (child.val().username === username) {
          userProfile = child.val();
        }
      });
      
      return userProfile || {
        fullName: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@prospentech.co.za`,
        bio: `${username} user`,
        avatar: null,
        role: username === 'admin' ? 'System Administrator' : 'Team Member'
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {
        fullName: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@prospentech.co.za`,
        bio: `${username} user`,
        avatar: null,
        role: username === 'admin' ? 'System Administrator' : 'Team Member'
      };
    }
  }

  async saveUserProfile(username, profileData) {
    try {
      // Find user by username
      const snapshot = await get(ref(db, 'profiles'));
      let userId = null;
      
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          if (child.val().username === username) {
            userId = child.key;
          }
        });
      }
      
      if (userId) {
        await update(ref(db, `profiles/${userId}`), profileData);
      } else {
        // Create new profile with auth user's uid
        const newProfileRef = push(ref(db, 'profiles'));
        await set(newProfileRef, {
          username: username,
          ...profileData
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time subscriptions
  subscribeToProjects(callback) {
    const projectsRef = ref(db, 'projects');
    return onValue(projectsRef, (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : {});
    }, (error) => {
      console.error('Projects subscription error:', error);
    });
  }

  subscribeToUpdates(callback) {
    const updatesRef = ref(db, 'updates');
    return onValue(updatesRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      
      const updates = [];
      snapshot.forEach((child) => {
        updates.push({ id: child.key, ...child.val() });
      });
      
      callback(updates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    }, (error) => {
      console.error('Updates subscription error:', error);
    });
  }

  subscribeToEnquiries(callback) {
    const enquiriesRef = ref(db, 'enquiries');
    return onValue(enquiriesRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      
      const enquiries = [];
      snapshot.forEach((child) => {
        enquiries.push({ id: child.key, ...child.val() });
      });
      
      callback(enquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    }, (error) => {
      console.error('Enquiries subscription error:', error);
    });
  }

  subscribeToActivities(callback) {
    const activitiesRef = ref(db, 'activities');
    return onValue(activitiesRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      
      const activities = [];
      snapshot.forEach((child) => {
        activities.push({ id: child.key, ...child.val() });
      });
      
      callback(activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 100));
    }, (error) => {
      console.error('Activities subscription error:', error);
    });
  }

  // Avatar upload
  async uploadAvatar(username, base64Data) {
    try {
      const avatarRef = storageRef(storage, `avatars/${username}`);
      await uploadString(avatarRef, base64Data, 'data_url');
      const url = await getDownloadURL(avatarRef);
      return { success: true, url: url };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { success: false, error: error.message };
    }
  }
}

const firebaseService = new FirebaseService();
export default firebaseService;