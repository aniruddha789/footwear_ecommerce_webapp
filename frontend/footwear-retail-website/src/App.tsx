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
