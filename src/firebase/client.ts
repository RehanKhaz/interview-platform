import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyA25_DEq3Fcu828747cS5qhtdeT6YiMvRU",
  authDomain: "ai-interview-platform-8ed3b.firebaseapp.com",
  projectId: "ai-interview-platform-8ed3b",
  storageBucket: "ai-interview-platform-8ed3b.firebasestorage.app",
  messagingSenderId: "689459307810",
  appId: "1:689459307810:web:291fad737fe89945f6717b",
  measurementId: "G-H361YBG8TL"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)
export const db = getFirestore(app)