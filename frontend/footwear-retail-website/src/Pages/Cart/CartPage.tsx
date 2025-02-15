import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartPage.css';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity } = useCart();

  const total = items.reduce((sum, item) => 
    sum + (item.product.listprice * item.quantity), 0
  );

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
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item">
            <img src={item.product.image} alt={item.product.name} />
            <div className="item-details">
              <h3>{item.product.name}</h3>
              <p>Size: {item.selectedSize}</p>
              <p>Color: {item.selectedColor}</p>
              <p>₹ {item.product.listprice}</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(
                    item.product.id,
                    item.selectedSize,
                    item.selectedColor,
                    Math.max(0, item.quantity - 1)
                  )}
                >-</button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(
                    item.product.id,
                    item.selectedSize,
                    item.selectedColor,
                    item.quantity + 1
                  )}
                >+</button>
              </div>
              <button 
                className="remove-button"
                onClick={() => removeFromCart(
                  item.product.id, 
                  item.selectedSize, 
                  item.selectedColor
                )}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: ₹ {total}</h2>
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
