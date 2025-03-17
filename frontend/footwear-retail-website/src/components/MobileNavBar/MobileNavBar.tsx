import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MobileNavBar.css';
import { MdOutlineHome, MdOutlineSearch, MdOutlinePerson, MdOutlineShoppingBag, MdOutlineCategory } from 'react-icons/md';
import { useCart } from '../../context/CartContext';
import MobileSearchOverlay from '../MobileSearchOverlay/MobileSearchOverlay';

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  
  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSearch(true);
  };

  // Custom navigation handler to ensure scroll to top
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    
    // Only navigate if we're not already on this path
    if (location.pathname !== path) {
      window.scrollTo(0, 0);
      navigate(path);
    }
  };

  return (
    <>
      <MobileSearchOverlay 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
      />
      
      <div className="mobile-nav-container">
        <div className="mobile-nav">
          <a href="/" 
             className={`mobile-nav-item ${isActive('/')}`}
             onClick={(e) => handleNavigation(e, '/')}>
            <MdOutlineHome className="mobile-nav-icon" />
            <span>Home</span>
          </a>
          
          <a href="/categories" 
             className={`mobile-nav-item ${isActive('/categories')}`}
             onClick={(e) => handleNavigation(e, '/categories')}>
            <MdOutlineCategory className="mobile-nav-icon" />
            <span>Categories</span>
          </a>
          
          <a href="#" 
             className={`mobile-nav-item ${location.pathname === '/search' ? 'active' : ''}`}
             onClick={handleSearchClick}>
            <MdOutlineSearch className="mobile-nav-icon" />
            <span>Search</span>
          </a>
          
          <a href="/cart" 
             className={`mobile-nav-item ${isActive('/cart')}`}
             onClick={(e) => handleNavigation(e, '/cart')}>
            <div className="mobile-nav-icon-container">
              <MdOutlineShoppingBag className="mobile-nav-icon" />
              {getCartCount() > 0 && (
                <span className="mobile-cart-badge">{getCartCount()}</span>
              )}
            </div>
            <span>Bag</span>
          </a>
          
          <a href="/profile" 
             className={`mobile-nav-item ${isActive('/profile')}`}
             onClick={(e) => handleNavigation(e, '/profile')}>
            <MdOutlinePerson className="mobile-nav-icon" />
            <span>Profile</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default MobileNavBar;