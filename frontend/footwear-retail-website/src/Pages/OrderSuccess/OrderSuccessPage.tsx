import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Thank You for Your Order!</h1>
        <p className="order-message">Your order has been successfully placed</p>
        
        {orderDetails && (
          <div className="order-info">
            <p className="order-number">Order #{orderDetails.orderId}</p>
            <p className="delivery-estimate">Estimated Delivery: 4-5 business days</p>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
          <button onClick={() => navigate('/orders')} className="view-orders-btn">
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 