import "./NavBar.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import ukLogo from "../../assets/UK logo png black.png";
import cartLogo from "../../assets/travel.png";
import wishlistLogo from "../../assets/wishlist.png";
import { Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import SignInSlider from '../../Pages/SignInSlider/SignInSlider';

function NavBar() {
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignIn = () => {
    setShowSignIn(true);
  };

  return (
    <>
      <Navbar className="headerContainer">
        <Navbar.Brand href="#home" className="companyBrand">
          {" "}
          <img src={ukLogo} className="brandLogo" alt="Urban Kicks Logo"></img> Urban Kicks{" "}
        </Navbar.Brand>
        <div className="dummy1"></div>
        <Form.Control type="text" placeholder="Search on Urban Kicks" className="searchBar"/>
        <div className="dummy2"></div>
        <div className="opts">
          <div className="headerIcons">
            <Container><Image src={wishlistLogo} fluid alt="Wishlist"></Image></Container>
            <Container><Image src={cartLogo} fluid alt="Cart"></Image></Container>
            <Container>
              <Button variant="link" className="signInLink" onClick={handleSignIn}>Sign In</Button>
            </Container>
          </div>
        </div>
      </Navbar>
      <Navbar className="nav">
        <Container className="childContainer">
          <Nav className="me-auto">
            <Link className="navLink" to="/tops">Tops</Link>
            <Link className="navLink" to="/bottoms">Bottoms</Link>
            <Link className="navLink" to="/shoes">Shoes</Link>
            <Link className="navLink" to="/accessories">Accessories</Link>
          </Nav>
        </Container>
      </Navbar>
      <SignInSlider show={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
}

export default NavBar;
