// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaZjk06VCNbdO4r2VsjTKTnCI3KRGQPsg",
  authDomain: "illusia-ry-f27e8.firebaseapp.com",
  projectId: "illusia-ry-f27e8",
  storageBucket: "illusia-ry-f27e8.firebasestorage.app",
  messagingSenderId: "419803959581",
  appId: "1:419803959581:web:00663143574a66e46711f4",
  measurementId: "G-NSRZM1T7FR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
