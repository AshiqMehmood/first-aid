// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBcEwmpkzD7cme7I5Wev4YCq5ysenbk7pA",
  authDomain: "first-aid-44aaf.firebaseapp.com",
  projectId: "first-aid-44aaf",
  storageBucket: "first-aid-44aaf.appspot.com",
  messagingSenderId: "197928038688",
  appId: "1:197928038688:web:028f4e5bb728128fce6745",
  measurementId: "G-V0R96BL3M3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);