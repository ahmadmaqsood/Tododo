// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyABllSgUCU4PKBEQxV3IGd2zSHxPNMMZjQ",
    authDomain: "seeraht-todo.firebaseapp.com",
    projectId: "seeraht-todo",
    storageBucket: "seeraht-todo.appspot.com",
    messagingSenderId: "702180321692",
    appId: "1:702180321692:web:c55b0554c018f05c3a4059",
    measurementId: "G-TH55Z6KS3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth,db,analytics}
