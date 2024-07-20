import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button } from "react-bootstrap";
import React from "react";
import ReactDOM from "react-dom";
import Bottoms from "./Pages/Bottoms/Bottoms";
import Tops from "./Pages/Tops/Tops";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useAsyncError,
  Link,
} from "react-router-dom";
import Home from "./Pages/Home/Home";
import Shoes from "./Pages/Shoes/Shoes";
import Accessories from "./Pages/Accessories/Accessories";

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

function App() {


  return (
    <>

      <Router >
      <NavBar />
        {/* <div className="container"> */}
          <Routes>
            <Route path="/" element = {<Home />} /> 
            <Route path="/tops" element = {<Tops />} />
            <Route path="/bottoms" element = {<Bottoms />} />
            <Route path="/shoes" element = {<Shoes />} />
            <Route path="/accessories" element = {<Accessories />}/>  
          </Routes>
          
      
      </Router>
    </>
  );
}

export default App;
