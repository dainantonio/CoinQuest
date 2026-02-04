import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔴 TODO: Replace these values with your actual Firebase project configuration
// You can find these in the Firebase Console -> Project Settings -> General -> Your Apps
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

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);