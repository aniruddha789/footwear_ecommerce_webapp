import { Navbar, Form, Container, Image } from "react-bootstrap";
import ukLogo from "../../assets/UK logo png black.png";
import wishlistLogo from "../../assets/love.png";
import cartLogo from "../../assets/shopping-bag (1).png";
import ProductCard from "../../components/ProductCard/ProductCard";
import offwhite1 from '../../../src/assets/300952867OFFWHITE_1.webp';
import offwhite2 from '../../../src/assets/300952867OFFWHITE_2.webp';
import offwhite3 from '../../../src/assets/300952867OFFWHITE_3.webp';

function ProductPage() {
  return (
    <>
      <Navbar className="headerContainer">
        <Navbar.Brand href="#home" className="companyBrand">
          {" "}
          <img src={ukLogo} className="brandLogo"></img> Urban Kicks{" "}
        </Navbar.Brand>
        <div className="dummy1"></div>
        <Form.Control
          type="text"
          placeholder="Search on Urban Kicks"
          className="searchBar"
        />
        <div className="dummy2"></div>
        <div className="opts">
          <div className="headerIcons">
            <Container>
              <Image src={wishlistLogo} fluid></Image>
            </Container>
            <Container>
              <Image src={cartLogo} fluid></Image>
            </Container>
            <Container>
              <text className="signInLink ">Sign In</text>
            </Container>
          </div>
        </div>
      </Navbar>

      <Container>
      <ProductCard
              name="StudioFit"
              text="Studiofit Off White Relaxed Fit Hoodie Sweatshirt"
              price={1299}
              img1={offwhite1}
              img2={offwhite2}
              img3={offwhite3}
            />
                
      </Container>


    </>
  );
}
export default ProductPage;
