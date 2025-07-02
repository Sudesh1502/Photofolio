// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLEawQLdnQce_mPCljAaoXrkqV4yGvvuA",
  authDomain: "photofolio-514ef.firebaseapp.com",
  projectId: "photofolio-514ef",
  storageBucket: "photofolio-514ef.firebasestorage.app",
  messagingSenderId: "418497436981",
  appId: "1:418497436981:web:32af3e16afeefacd4c007c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
