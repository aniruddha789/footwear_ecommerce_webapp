import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import { Link } from 'react-router-dom';
import SignInSlider from '../SignInSlider/SignInSlider';
import '../../styles/alert.css';
import trashIcon from '../../assets/trash-can.png';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, updateSize, refreshCart } = useCart();
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const isLoggedIn = localStorage.getItem('token') !== null;
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    refreshCart();
  }, []);

  const total = items.reduce((sum, item) => 
    sum + (item.product.listprice * item.quantity), 0
  );

  const handleLoginSuccess = () => {
    setShowSignIn(false);
    navigate('/checkout');
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setShowSignIn(true);
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/" className="continue-shopping">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {showAlert && (
        <div className="app-alert error">
          Please sign in
        </div>
      )}
      
      <div className="cart-steps">
        <div className="step active">
          <div className="step-number">1</div>
          <div className="step-text">Bag</div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-text">Details</div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-text">Payment</div>
        </div>
      </div>

      <div className="cart-header">
        <span className="checkbox-column"></span>
        <span className="product-column">Shopping Bag ({items.length.toString().padStart(2, '0')})</span>
        <span className="quantity-column">Quantity</span>
        <span className="subtotal-column">Subtotal</span>
        <span className="remove-column"></span>
      </div>

      <div className="cart-items">
        {items.map((item, index) => (
          <div 
            key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`} 
            className="cart-item"
          >
            <input type="checkbox" className="checkbox-column" />
            <div className="cart-item-details product-column">
              <img 
                src={item.image ? item.image.split(";")[0] : (item.product?.image || '/placeholder-image.jpg')} 
                alt={item.product?.name || 'Product'} 
              />
              <div className="item-info">
                <div className="item-brand">{item.product.brandid}</div>
                <h3>{item.product.name}</h3>
                
                <div className="color-display">
                  <span>Color: </span>
                  <span className="selected-color">{item.selectedColor}</span>
                </div>

                <div className="size-wrapper">
                  <span>Size</span>
                  <select 
                    className="size-selector" 
                    value={item.selectedSize}
                    onChange={(e) => {
                      const newSize = e.target.value;
                      updateSize(item.itemId, newSize);
                    }}
                  >
                    {[...new Set(
                      item.product.inventory
                        .filter(inv => inv.color === item.selectedColor)
                        .map(inv => inv.size)
                    )].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="delivery-info">Delivery by {'4-5 days'}</div>
              </div>
            </div>
            <div className="quantity-controls quantity-column">
              <button 
                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                className={item.quantity === 1 ? 'quantity-button-disabled' : ''}
                disabled={item.quantity === 1}
              >-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
            </div>
            <div className="price subtotal-column">₹ {item.product.listprice * item.quantity}</div>
            <button 
              className="remove-button remove-column" 
              onClick={() => removeFromCart(item.itemId)}
            >
              <img src={trashIcon} alt="Remove" className="trash-icon" />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total Amount</h3>
        <div className="summary-row">
          <span>Total MRP</span>
          <span>₹ {total.toFixed(0)}</span>
        </div>
        <div className="summary-row">
          <span>Discount on MRP</span>
          <span>₹ 0</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>₹ {total.toFixed(0)}</span>
        </div>
        
        <button className="checkout-button" onClick={handleCheckout}>
          PROCEED TO CHECKOUT
        </button>
      </div>

      <SignInSlider 
        show={showSignIn} 
        onClose={() => setShowSignIn(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default CartPage;
