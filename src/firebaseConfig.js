// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCLurPa2f9UmJccSmkmOv_TgcBu60fqm3o",
  authDomain: "auth-development-aa64f.firebaseapp.com",
  projectId: "auth-development-aa64f",
  storageBucket: "auth-development-aa64f.firebasestorage.app",
  messagingSenderId: "36024839715",
  appId: "1:36024839715:web:72f5d4ea55d7d6b8c0cb96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export the services
export { db, auth, storage };

