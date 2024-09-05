// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD34t7uoLJ3K7PsjBhWqT21Slf4tUVj2D8",
  authDomain: "urban-kicks-392619.firebaseapp.com",
  projectId: "urban-kicks-392619",
  storageBucket: "urban-kicks-392619.appspot.com",
  messagingSenderId: "548769979195",
  appId: "1:548769979195:web:4f852ae6a23b46bad3751e",
  measurementId: "G-5WM19GZT2K"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);

export default [firebase, analytics];
