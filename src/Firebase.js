import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC0yfIJedLm691id4o80bSA3WJyi5vJgEw",
  authDomain: "react-site-a35a3.firebaseapp.com",
  databaseURL:
    "https://react-site-a35a3-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "react-site-a35a3",
  storageBucket: "react-site-a35a3.appspot.com",
  messagingSenderId: "868498669492",
  appId: "1:868498669492:web:fb3c423addd476759bbce1",
  measurementId: "G-169DL3P8DK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
