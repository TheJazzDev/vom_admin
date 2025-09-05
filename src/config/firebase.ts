import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW5TVk4ckeNGDLHDF_n3FRssdaVtnZ60k",
  authDomain: "vom-app-e20ae.firebaseapp.com",
  projectId: "vom-app-e20ae",
  storageBucket: "vom-app-e20ae.firebasestorage.app",
  messagingSenderId: "72770096721",
  appId: "1:72770096721:web:07efaed9acb5debf5a3270",
  measurementId: "G-DYJVM3XVBK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

export default app;
