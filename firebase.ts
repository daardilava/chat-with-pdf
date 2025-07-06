import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD1Wr3p8VUGFaYrQ4XKkExtT-gapEjbug",
  authDomain: "chat-with-pdf-f6c96.firebaseapp.com",
  projectId: "chat-with-pdf-f6c96",
  storageBucket: "chat-with-pdf-f6c96.firebasestorage.app",
  messagingSenderId: "682037718280",
  appId: "1:682037718280:web:183cfed4d84f6ed984d0bd"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };