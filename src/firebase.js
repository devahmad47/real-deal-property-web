// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDaWAkGtk3WRfEo1tAVsByRRAtoSyloLQ",
  authDomain: "real-26b08.firebaseapp.com",
  projectId: "real-26b08",
  storageBucket: "real-26b08.appspot.com",
  messagingSenderId: "521967752099",
  appId: "1:521967752099:web:85b8c2b5d409f9b4be0016",
  measurementId: "G-KD0H7D7M74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
