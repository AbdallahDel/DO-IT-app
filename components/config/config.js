// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQsHV44iTDR0k2uUVooYEveaRkxyGUF-8",
  authDomain: "do-it-46762.firebaseapp.com",
  projectId: "do-it-46762",
  storageBucket: "do-it-46762.firebasestorage.app",
  messagingSenderId: "863728620857",
  appId: "1:863728620857:web:8b0f1a9d1683e6a2a204e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore instance
export { db };
