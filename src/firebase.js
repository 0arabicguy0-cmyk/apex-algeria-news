// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKX7VcsNdevIBMpv0baWHnH4r17l19bdM",
  authDomain: "apex-c5262.firebaseapp.com",
  projectId: "apex-c5262",
  storageBucket: "apex-c5262.firebasestorage.app",
  messagingSenderId: "609645507794",
  appId: "1:609645507794:web:28e89e924dd7445211e90b",
  measurementId: "G-MT02CEFNN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);