import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if we have valid config (not empty strings)
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase only if config is valid
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (hasValidConfig) {
  // Check if already initialized
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// Export getters that throw helpful errors when Firebase isn't configured
function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error(
      "Firebase Auth is not initialized. Please configure NEXT_PUBLIC_FIREBASE_* environment variables.",
    );
  }
  return auth;
}

function getFirebaseDb(): Firestore {
  if (!db) {
    throw new Error(
      "Firebase Firestore is not initialized. Please configure NEXT_PUBLIC_FIREBASE_* environment variables.",
    );
  }
  return db;
}

function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error(
      "Firebase Storage is not initialized. Please configure NEXT_PUBLIC_FIREBASE_* environment variables.",
    );
  }
  return storage;
}

// Export with backwards compatibility
export { auth, db, storage };
export { getFirebaseAuth, getFirebaseDb, getFirebaseStorage };

export default app;
