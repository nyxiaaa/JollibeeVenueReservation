import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2tP9hg8GOmd-lyyYvJ9BaotRShvHcBl8",
  authDomain: "bday-reserve.firebaseapp.com",
  projectId: "bday-reserve",
  storageBucket: "bday-reserve.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "978178358193",
  appId: "1:978178358193:web:ba50445bf6ee7301f91b90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
