import "./navbar.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import ukLogo from "../../assets/UK logo png black.png";
import cartLogo from "../../assets/travel.png";
import wishlistLogo from "../../assets/wishlist.png";
import { Image } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import SignInSlider from '../../Pages/SignInSlider/SignInSlider';
import { isTokenValid, clearAuthData, getCartIconQuantity } from '../../services/api';
import { jwtDecode } from "jwt-decode";
import { useCart } from '../../context/CartContext';

function NavBar() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [firstname, setFirstname] = useState('');
  const location = useLocation();
  const isCheckingTokenRef = useRef(false); // Use a ref to track checking status
  const { getCartCount, clearCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [cartIconQuantity, setCartIconQuantity] = useState<string>('');

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  interface DecodedToken {
    exp: number;
    // Add other expected fields here
  }

  const isTokenExpired = (token: string) => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const checkTokenValidity = async () => {
    if (isCheckingTokenRef.current) return; // Prevent multiple simultaneous checks
    isCheckingTokenRef.current = true;

    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        console.log('Token expired, validating with server...');
        const isValid = await isTokenValid();
        console.log('Server validation result:', isValid);
        if (!isValid) {
          console.log('Token invalid, signing out...');
          handleSignOut();
        } else {
          console.log('Token is valid.');
          setIsLoggedIn(true); // Update login state if valid
        }
      } else {
        console.log('Token is still valid.');
        setIsLoggedIn(true); // Update login state if valid
      }
    } else {
      console.log('No token found, user is not logged in.');
      handleSignOut();
    }

    isCheckingTokenRef.current = false; // Reset the ref
  };

  useEffect(() => {
    checkTokenValidity(); // Check token validity on component mount and route change
  }, [location.pathname]); // Only run when the route changes

  useEffect(() => {
    const storedFirstname = localStorage.getItem('firstname');
    if (storedFirstname) {
      setFirstname(storedFirstname);
    }
  }, []);

  useEffect(() => {
    if (!location.pathname.includes('/search')) {
      setSearchTerm('');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes('/search')) {
      const params = new URLSearchParams(location.search);
      const query = params.get('query');
      if (query) {
        setSearchTerm(query);
      }
    }
  }, [location.pathname, location.search]);

  const handleSignIn = () => {
    setShowSignIn(true);
  };

  const handleLoginSuccess = async (loggedInUsername: string, loggedInFirstname: string) => {
    setIsLoggedIn(true);
    setFirstname(loggedInFirstname);
    setShowSignIn(false);
    
    // Get initial cart quantity from backend
    const username = loggedInUsername;
    if (username) {
      try {
        const quantity = await getCartIconQuantity(username);
        setCartIconQuantity(quantity);
      } catch (error) {
        console.error('Error fetching cart quantity:', error);
      }
    }
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    clearAuthData();
    clearCart(); // Clear the cart when signing out
    setCartIconQuantity(''); // Clear the cart icon quantity
    setIsLoggedIn(false);
    setFirstname('');
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  return (
    <>
      <Navbar className="headerContainer">
        <Navbar.Brand href="/" className="companyBrand">
          <img src={ukLogo} className="brandLogo" alt="Urban Kicks Logo" />
          <span>Urban Kicks</span>
        </Navbar.Brand>
        <div className="dummy1"></div>
        {!isMobile && (
          <Form onSubmit={handleSearchSubmit} className="d-flex search-form">
            <Form.Control
              type="text"
              placeholder="Search on Urban Kicks"
              className="searchBar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form>
        )}
        <div className="dummy2"></div>
        {!isMobile && (
          <div className="opts">
            <div className="headerIcons">
              <Container>
                <Image src={wishlistLogo} className="wishilistLogo" fluid alt="Wishlist"></Image>
              </Container>
              <Container>
                <Link to="/cart" className="cart-container">
                  <Image src={cartLogo} className="cartLogo" fluid alt="Cart" />
                  {(parseInt(cartIconQuantity) > 0 || getCartCount() > 0) && (
                    <span className="cart-count">{cartIconQuantity || getCartCount()}</span>
                  )}
                </Link>
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
        )}
      </Navbar>
      {!isMobile && (
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
      )}
      <SignInSlider show={showSignIn} onClose={() => setShowSignIn(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}

export default NavBar;
