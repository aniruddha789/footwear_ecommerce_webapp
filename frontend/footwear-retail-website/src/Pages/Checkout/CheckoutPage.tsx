import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';
import { useCart } from '../../context/CartContext';
import Address from '../../types/Address';
import { getAddresses, placeOrder } from '../../services/api';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const isLoggedIn = localStorage.getItem('token') !== null;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    addressType: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    pincode: 0,
    country: ''
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const addressBoxesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('returnUrl', '/checkout');
      navigate('/signin');
    } else {
      // Fetch addresses from API
      fetchAddresses();
    }
  }, [isLoggedIn, navigate]);

  const fetchAddresses = async () => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('Username not found in localStorage');
        return;
      }
      const addressList = await getAddresses(username);
      setAddresses(addressList);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      addressType: address.addressType,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      district: address.district,
      state: address.state,
      pincode: address.pincode,
      country: address.country
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        throw new Error('User not logged in');
      }

      // Prepare order items
      const orderItems = items.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.product.color // Assuming product has color property
      }));

      // Create order request
      const orderRequest = {
        username: username,
        items: orderItems
      };

      // Call the API
      const response = await placeOrder(orderRequest);
      
      // Clear the cart after successful order
      clearCart();
      
      // Navigate to success page with order details
      navigate('/order-success', {
        state: {
          orderDetails: {
            orderId: response.id,
            orderStatus: response.orderStatus,
            orderDate: response.orderDate,
            items: response.orderItems
          }
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (addressBoxesRef.current) {
      const container = addressBoxesRef.current;
      const scrollAmount = isMobile ? 260 : 320; // Adjust for mobile
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = addressBoxesRef.current 
    ? scrollPosition < addressBoxesRef.current.scrollWidth - addressBoxesRef.current.clientWidth 
    : false;

  if (!isLoggedIn) {
    return null;
  }

  const total = items.reduce((sum, item) => 
    sum + (item.product.listprice * item.quantity), 0
  );

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form">
          <div className="saved-addresses">
            <h2>Saved Addresses</h2>
            <div className="address-boxes-container">
              {canScrollLeft && (
                <button 
                  className="slider-arrow left"
                  onClick={() => handleScroll('left')}
                  aria-label="Scroll left"
                >
                  ←
                </button>
              )}
              <div 
                className="address-boxes"
                ref={addressBoxesRef}
                onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
              >
                {addresses.map(address => (
                  <div 
                    key={address.id}
                    className={`address-box ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="address-type">{address.addressType}</div>
                    <div className="address-details">
                      <p>{address.addressLine1}</p>
                      <p>{address.addressLine2}</p>
                      <p>{address.city}, {address.district}</p>
                      <p>{address.state} - {address.pincode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                ))}
              </div>
              {canScrollRight && (
                <button 
                  className="slider-arrow right"
                  onClick={() => handleScroll('right')}
                  aria-label="Scroll right"
                >
                  →
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="delivery-form">
            <h2>Delivery Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Address Type</label>
                <input
                  type="text"
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="number"
                  name="pincode"
                  value={formData.pincode || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="place-order-button">
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="order-item-details">
                  <div className="order-item-name">{item.product.name}</div>
                  <div className="order-item-variant">
                    Size: {item.selectedSize} | Qty: {item.quantity}
                  </div>
                </div>
                <div className="order-item-price">
                  ₹{item.product.listprice * item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <div className="order-total-row">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="order-total-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="order-total-row final">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 