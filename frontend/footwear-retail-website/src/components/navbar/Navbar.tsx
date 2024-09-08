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
import React, { useState, useEffect } from 'react';
import SignInSlider from '../../Pages/SignInSlider/SignInSlider';

function NavBar() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [firstname, setFirstname] = useState('');


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedFirstname = localStorage.getItem('firstname');
    if (storedUsername && storedFirstname) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setFirstname(storedFirstname);
    }
  }, []);

  const handleSignIn = () => {
    setShowSignIn(true);
  };

  const handleLoginSuccess = (loggedInUsername: string, loggedInFirstname: string) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
    setFirstname(loggedInFirstname);
    setShowSignIn(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('firstname');
    setIsLoggedIn(false);
    setUsername('');
    setFirstname('');
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      <Navbar className="headerContainer">
        <Navbar.Brand href="/" className="companyBrand">
          {" "}
          <img src={ukLogo} className="brandLogo" alt="Urban Kicks Logo"></img> Urban Kicks{" "}
        </Navbar.Brand>
        <div className="dummy1"></div>
        <Form.Control type="text" placeholder="Search on Urban Kicks" className="searchBar"/>
        <div className="dummy2"></div>
        <div className="opts">
          <div className="headerIcons">
            <Container>
              <Image src={wishlistLogo} className="wishilistLogo" fluid alt="Wishlist"></Image>
            </Container>
            <Container>
              <Image src={cartLogo} className="cartLogo" fluid alt="Cart"></Image>
            </Container>
            <Container>
              {isLoggedIn ? (
                <div className="user-menu-container">
                  <p className="user-greeting" onClick={toggleUserMenu}>
                    <span>Hi</span> {firstname}
                  </p>
                  {showUserMenu && (
                    <div className="user-menu">
                      <p onClick={() => console.log('View Profile')}>View Profile</p>
                      <p onClick={() => console.log('Orders')}>Orders</p>
                      <p onClick={handleSignOut}>Sign Out</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="signInLink" onClick={handleSignIn}>
                  Sign In
                </p>
              )}
            </Container>
          </div>
        </div>
      </Navbar>
      <Navbar className="nav">
        <Container className="childContainer">
          <Nav className="me-auto">
            <Link to="/tops" className="nav-link">Tops</Link>
            <Link to="/bottoms" className="nav-link">Bottoms</Link>
            <Link to="/shoe" className="nav-link">Shoes</Link>
            <Link to="/accessories" className="nav-link">Accessories</Link>
          </Nav>
        </Container>
      </Navbar>
      <SignInSlider show={showSignIn} onClose={() => setShowSignIn(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}

export default NavBar;
