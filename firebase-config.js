// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child, update, remove, query, orderByChild, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjI5LXppPrcOBk5iUvFien6TBx5znCNu8",
  authDomain: "prospen-hub.firebaseapp.com",
  databaseURL: "https://prospen-hub-default-rtdb.europe-west1.firebasedatabase.app/", // Your Realtime Database URL
  projectId: "prospen-hub",
  storageBucket: "prospen-hub.firebasestorage.app",
  messagingSenderId: "949638532118",
  appId: "1:949638532118:web:e1a58c13f55b03f858f937"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Realtime Database
const auth = getAuth(app);
const storage = getStorage(app);

export { 
  app, db, auth, storage,
  ref, set, push, get, child, update, remove, query, orderByChild, limitToLast, onValue,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, onAuthStateChanged, updateProfile,
  storageRef, uploadString, getDownloadURL 
};