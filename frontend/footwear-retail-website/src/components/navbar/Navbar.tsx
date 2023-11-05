import "./NavBar.css"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';


function NavBar() {

    return (
      <>
      <Navbar className = "headerContainer">
       
        <Navbar.Brand href="#home" className="companyBrand"> <img src="/src/assets/UK logo png black.png" className="brandLogo"></img> Urban Kicks </Navbar.Brand>
        <div className="dummy1"></div>
          <Form.Control
              type="text"
              placeholder="Search"
              className="searchBar"
            />
        <div className="dummy2"></div>
        <div className="opts"><img src="/src/assets/react.svg"></img></div>
       
      </Navbar>
      <Navbar className="nav">
        <Container className="childContainer">
          <Nav className="me-auto">
            <Nav.Link href="#tops">Tops</Nav.Link>
            <Nav.Link href="#bottoms">Bottoms</Nav.Link>
            <Nav.Link href="#shoes">Shoes</Nav.Link>
            <Nav.Link href="#accessories">Accessories</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>

      );

}

export default NavBar;