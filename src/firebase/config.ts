import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase configuration
// Get this from your Firebase project settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if Firebase is configured
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => value !== '');

let app: any;
let auth: any;
let db: any;
let storage: any;

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase only if configured
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization failed. App will work in demo mode.');
  }
} else {
  console.warn('Firebase not configured. App will work in demo mode. Add .env.local with Firebase credentials to enable Firebase features.');
}

export { auth, db, storage, isFirebaseConfigured };
export default app;
