import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;

  React.useEffect(() => {
    // Redirect to sign in if not logged in
    if (!isLoggedIn) {
      localStorage.setItem('returnUrl', '/checkout');
      navigate('/signin');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null; // or a loading state
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {/* Add your checkout form here */}
    </div>
  );
};

export default CheckoutPage; 