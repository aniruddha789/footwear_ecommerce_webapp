import "./NavBar.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import ukLogo from "../../assets/UK logo png black.png";
import cartLogo from "../../assets/shopping-bag (1).png";
import wishlistLogo from "../../assets/wishlist.png";
import { Image } from "react-bootstrap";
//import {Button} from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar() {


  return (
    <>
      <Navbar className="headerContainer">
        <Navbar.Brand href="#home" className="companyBrand">
          {" "}
          <img src={ukLogo} className="brandLogo"></img> Urban Kicks{" "}
        </Navbar.Brand>
        <div className="dummy1"></div>
        <Form.Control type="text" placeholder="Search on Urban Kicks" className="searchBar"/>
        <div className="dummy2"></div>
        <div className="opts">
          <div className="headerIcons">
            <Container><Image src={wishlistLogo} fluid></Image></Container>
            <Container><Image src={cartLogo} fluid></Image></Container>
            <Container><text className="signInLink ">Sign In</text></Container>
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
    </>
  );
}

export default NavBar;
