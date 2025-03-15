import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';
import ukLogo from "../../assets/UK logo png black.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <Container>
        <Row className="footer-main">
          <Col lg={4} md={6} className="footer-brand">
            <div className="footer-logo">
              <img src={ukLogo} alt="Urban Kicks Logo" />
              <span>Urban Kicks</span>
            </div>
            <p className="footer-tagline">
              Step into style with Urban Kicks - your destination for premium footwear and apparel.
            </p>
          </Col>
          
          <Col lg={2} md={6} className="footer-links">
            <h5>Shop</h5>
            <ul>
              <li><Link to="/tops">Tops</Link></li>
              <li><Link to="/bottoms">Bottoms</Link></li>
              <li><Link to="/shoe">Shoes</Link></li>
              <li><Link to="/accessories">Accessories</Link></li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} className="footer-links">
            <h5>Help</h5>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </Col>
          
          <Col lg={4} md={6} className="footer-contact">
            <h5>Contact</h5>
            <address>
              <p>Shivaji Commercial, Amravati, Maharashtra</p>
              <p>+91 7721906862</p>
              <p><a href="mailto:info@myurbankicks.in">info@myurbankicks.in</a></p>
            </address>
            
            <div className="social-links">
            <a href="https://instagram.com/urban_kicks_amt" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.facebook.com/profile.php?id=61557063887144" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://x.com/MyUrbanKicks" target="_blank" rel="noopener noreferrer">Twitter</a>
             </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} Urban Kicks. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 