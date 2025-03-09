import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfilePage.css';
import { 
  MdOutlineShoppingBag, MdOutlineFavoriteBorder, MdOutlineInfo,
  MdOutlineSettings, MdOutlineLocationOn, MdOutlineContactSupport,
  MdOutlineDescription, MdOutlinePrivacyTip, MdChevronRight, MdArrowBack
} from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';
import SignInSlider from '../SignInSlider/SignInSlider';

interface UserDetails {
  username: string;
  email: string;
  name?: string;
}

interface DecodedToken {
  sub: string;
  email?: string;
  name?: string;
  exp: number;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoading(false);
      setShowSignIn(true);
      return;
    }
    
    try {
      // Decode JWT to get user information
      const decoded: DecodedToken = jwtDecode(token);
      
      setUserDetails({
        username: decoded.sub || localStorage.getItem('username') || 'User',
        email: decoded.email || 'email@example.com',
        name: decoded.name || localStorage.getItem('firstname') || localStorage.getItem('username') || ''
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      // Try to get username from localStorage as fallback
      const username = localStorage.getItem('username');
      if (username) {
        setUserDetails({
          username,
          email: '',
          name: localStorage.getItem('firstname') || username
        });
      } else {
        setShowSignIn(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('firstname');
    navigate('/');
  };

  const handleLoginSuccess = (username: string, firstname: string) => {
    setUserDetails({
      username,
      email: '',
      name: firstname || username
    });
    setShowSignIn(false);
  };

  if (isLoading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  // If not logged in and not showing sign-in, show a placeholder
  if (!userDetails && !showSignIn) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <MdArrowBack />
          </button>
          <h1 className="brand-name"></h1>
        </div>
        <div className="profile-not-logged-in">
          <p>Please sign in to view your profile</p>
          <button className="sign-in-button" onClick={() => setShowSignIn(true)}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <SignInSlider 
        show={showSignIn} 
        onClose={() => setShowSignIn(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {userDetails && (
        <>
          <div className="profile-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <MdArrowBack />
            </button>
            <h1 className="brand-name"></h1>
          </div>

          <div className="profile-user-info">
            <div className="profile-avatar">
              <div className="avatar-placeholder"></div>
            </div>
            <h2 className="greeting">Hello {userDetails.name}!</h2>
            <Link to="/profile/details" className="view-details-link">View Details</Link>
          </div>

          <div className="profile-menu">
            <Link to="/orders" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlineShoppingBag />
              </div>
              <span className="menu-item-text">My Orders</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/wishlist" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlineFavoriteBorder />
              </div>
              <span className="menu-item-text">My Wishlist</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/saved-details" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlineDescription />
              </div>
              <span className="menu-item-text">Saved Details</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/account-settings" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlineSettings />
              </div>
              <span className="menu-item-text">Account Settings</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/weststyleclub" className="profile-menu-item">
              <div className="menu-item-icon">
                <div className="custom-icon">W</div>
              </div>
              <span className="menu-item-text">WestStyleClub</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/store-locator" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlineLocationOn />
              </div>
              <span className="menu-item-text">Store Locator</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/contact-us" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlineContactSupport />
              </div>
              <span className="menu-item-text">Contact Us</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/about-us" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlineInfo />
              </div>
              <span className="menu-item-text">About Us</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/terms" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlineDescription />
              </div>
              <span className="menu-item-text">Terms of Use</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <Link to="/privacy" className="profile-menu-item">
              <div className="menu-item-icon">
                <MdOutlinePrivacyTip />
              </div>
              <span className="menu-item-text">Privacy Policy</span>
              <MdChevronRight className="menu-item-arrow" />
            </Link>

            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage; 