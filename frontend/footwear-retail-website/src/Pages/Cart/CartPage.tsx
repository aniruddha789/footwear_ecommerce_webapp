import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import { Link } from 'react-router-dom';
import SignInSlider from '../SignInSlider/SignInSlider';
import '../../styles/alert.css';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, updateSize } = useCart();
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const isLoggedIn = localStorage.getItem('token') !== null;
  const [showAlert, setShowAlert] = useState(false);

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
              <img src={item.product.image} alt={item.product.name} />
              <div className="item-info">
                <div className="item-brand">{item.product.brand}</div>
                <h3>{item.product.name}</h3>
                <div className="size-wrapper">
                  <span>Size</span>
                  <select 
                    className="size-selector" 
                    value={item.selectedSize}
                    onChange={(e) => {
                      const newSize = e.target.value;
                      console.log('cart: ' + items.map(a => a.product.id + '-' + a.selectedSize + '-' + a.selectedColor))
                      updateSize(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor,
                        newSize
                      );
                    }}
                  >
                    {[...new Set(item.product.inventory.map(inv => inv.size))].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="delivery-info">Delivery by {item.deliveryDays || '4-5 days'}</div>
              </div>
            </div>
            <div className="quantity-controls quantity-column">
              <button 
                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, Math.max(1, item.quantity - 1))}
                className={item.quantity === 1 ? 'quantity-button-disabled' : ''}
                disabled={item.quantity === 1}
              >-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}>+</button>
            </div>
            <div className="price subtotal-column">₹ {item.product.listprice * item.quantity}</div>
            <button className="remove-button remove-column" onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}>×</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total Amount</h3>
        <div className="summary-row">
          <span>Total Item</span>
          <span>{items.length}</span>
        </div>
        <div className="summary-row">
          <span>Total MRP</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>₹ {total.toFixed(2)}</span>
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
