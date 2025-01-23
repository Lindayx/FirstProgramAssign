// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adopt-app-cc961.firebaseapp.com",
  projectId: "pet-adopt-app-cc961",
  storageBucket: "pet-adopt-app-cc961.firebasestorage.app",
  messagingSenderId: "404211160067",
  appId: "1:404211160067:web:55b475e913c4581dcfaa36",
  measurementId: "G-Z0HKMBWK4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
// const analytics = getAnalytics(app);