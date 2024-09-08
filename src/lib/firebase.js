import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNTWvxHNTCmEYq8GDrwnHrhGbL410RStM",
  authDomain: "eventcenter-426d5.firebaseapp.com",
  projectId: "eventcenter-426d5",
  storageBucket: "eventcenter-426d5.appspot.com",
  messagingSenderId: "683178770227",
  appId: "1:683178770227:web:5d934f6ae68da8fc25c846",
  measurementId: "G-7FH23J2HX9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };