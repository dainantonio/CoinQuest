import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Configuration uses Environment Variables (from .env file)
// Ensure you have created a .env file in the root directory with these values.
const firebaseConfig = {
  apiKey: "AIzaSyDx84KrNm_eco_zJ7fnAVrpHzc9HyQrDvQ",
  authDomain: "coinquest-613bc.firebaseapp.com",
  projectId: "coinquest-613bc",
  storageBucket: "coinquest-613bc.firebasestorage.app",
  messagingSenderId: "914748706075",
  appId: "1:914748706075:web:92433e17d88aa301b9d7be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();