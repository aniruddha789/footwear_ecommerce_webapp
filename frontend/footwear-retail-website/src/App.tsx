import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductGrid from "./containers/ProductGrid/ProductGrid";
import { useState } from "react";
import { Button } from "react-bootstrap";
import React from "react";
import ReactDOM from "react-dom";
import Bottoms from "./Pages/Bottoms/Bottoms";
import Tops from "./Pages/Tops/Tops";
import ProductPage from "./Pages/ProductPage/ProductPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useAsyncError,
  Link,
} from "react-router-dom";
import Home from "./Pages/Home/Home";

function App() {
  const [showTops, setShowTops] = useState(false);
  const [showBottoms, setShowBottoms] = useState(false);
  const [showProduct, setShowProduct] = useState(false);

  const topsFun = () => {
    setShowTops(!showTops);
  };

  const bottomsFun = () => {
    setShowBottoms(!showBottoms);
  };

  const productPageFun = () => {
    setShowProduct(!showProduct);
  };

  return (
    <>
    {/* <NavBar showTopsButton={topsFun} showBottomsButton={bottomsFun} /> */}
  
      <Router >
      <NavBar />
        {/* <div className="container"> */}
          <Routes>
            <Route path="/" element = {<Home />} /> 
            <Route path="/tops" element = {<Tops />} />
            <Route path="/bottoms" element = {<Bottoms />} />  
          </Routes>
          
      
      </Router>
    </>
  );
}

export default App;
    {/* <div>{showTops ? <Tops /> : <></>}</div>
          <div>{showBottoms ? <Bottoms></Bottoms> : <></>}</div>
          <div>{showProduct ? <ProductPage></ProductPage> : <></>}</div> */}
        {/* </div> */}