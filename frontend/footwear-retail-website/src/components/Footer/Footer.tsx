import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';
import { useBrand } from '../../context/BrandContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const brand = useBrand();

  return (
    <footer className="site-footer">
      <Container>
        <Row className="footer-main">
          <Col lg={4} md={6} className="footer-brand">
            <div className="footer-logo">
              <img src={brand.logoUrl} alt={`${brand.brandName} logo`} />
              <span>{brand.brandName}</span>
            </div>
            <p className="footer-tagline">
              {brand.tagline}
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

          <Col lg={4} md={6} className="footer-contact">
            <h5>Contact</h5>
            <address>
              <p>{brand.addressLine}</p>
              <p>{brand.phoneFooter}</p>
              <p><a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a></p>
            </address>
            
            <div className="social-links">
              {brand.social.instagram && (
                <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              )}
              {brand.social.facebook && (
                <a href={brand.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              )}
              {brand.social.twitter && (
                <a href={brand.social.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
              )}
            </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} {brand.brandName}. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/returns-policy">Returns Policy</Link>
            <Link to="/shipping-policy">Shipping Policy</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 
