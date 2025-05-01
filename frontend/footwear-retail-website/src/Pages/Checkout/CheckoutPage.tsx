import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';
import { useCart } from '../../context/CartContext';
import Address from '../../types/Address';
import { getAddresses, placeOrder, initiatePayment, getCart, cancelOrder, addAddress } from '../../services/api';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const isLoggedIn = localStorage.getItem('token') !== null;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
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
  const [isAddingAddress, setIsAddingAddress] = useState(false);
 
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
      // If there are addresses, select the first one by default
      if (addressList.length > 0) {
        handleAddressSelect(addressList[0]);
      } else {
        // If no addresses, show the form to add one
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pincode' ? parseInt(value) || 0 : value
    }));
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingAddress(true);
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        throw new Error('User not logged in');
      }

      // Add the new address
      await addAddress(username, formData);
      
      // Reset form
      setFormData({
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        state: '',
        pincode: 0,
        country: ''
      });
      
      // Refresh addresses list
      await fetchAddresses();
      
      // Hide the form
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        throw new Error('User not logged in');
      }

      if (!selectedAddress) {
        throw new Error('Please select a delivery address');
      }

      // Prepare order items
      const orderItems = items.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor
      }));

      // Create order request with addressId
      const orderRequest = {
        username: username,
        addressId: selectedAddress.id,
        items: orderItems
      };

      // Call the API
      const response = await placeOrder(orderRequest);
      
      // Clear the cart after successful order
      clearCart();
      
      // Navigate to success page with order details
      navigate('/order-confirmation', {
        state: {
          orderDetails: {
            orderId: response.id,
            orderStatus: response.orderStatus,
            orderDate: response.orderDate,
            items: response.orders
          }
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error instanceof Error ? error.message : 'Failed to place order');
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


  // Add payment initiation function
  const handlePayment = async () => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        throw new Error('User not logged in');
      }

      if (!selectedAddress) {
        throw new Error('Please select a delivery address');
      }

      // Calculate total amount in rupees first
      const totalInRupees = items.reduce((sum, item) => 
        sum + (item.product.listprice * item.quantity), 0
      );
      
      // Convert to paise (1 rupee = 100 paise)
      const totalInPaise = Math.round(totalInRupees * 100);

      // Get current cart ID (which will be the order ID)
      const cart = await getCart(username);
      const cartId = cart.id;

      // Initiate payment with amount in paise
      const paymentResponse = await initiatePayment(cartId, totalInPaise);

      // Initialize PhonePe checkout
      if (window.PhonePeCheckout && window.PhonePeCheckout.transact) {
        window.PhonePeCheckout.transact({
          tokenUrl: paymentResponse.redirectUrl,
          callback: async (response) => {
            if (response === 'CONCLUDED') {
              try {
                // Place order only after successful payment, including addressId
                const orderResponse = await placeOrder({
                  username: username,
                  addressId: selectedAddress.id,
                  items: items.map(item => ({
                    id: item.product.id,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    color: item.selectedColor
                  }))
                });
                
                alert('Payment successful!');
                clearCart();
                navigate('/order-confirmation', {
                  state: {
                    orderDetails: {
                      orderId: orderResponse.id,
                      orderStatus: orderResponse.orderStatus,
                      orderDate: orderResponse.orderDate,
                      items: orderResponse.orders
                    }
                  }
                });
              } catch (error) {
                console.error('Error placing order:', error);
                alert('Payment successful but order placement failed. Please contact support.');
              }
            } else if (response === 'USER_CANCEL') {
              await cancelOrder(cartId);
              alert('Payment was cancelled by the user.');
            }
          },
          type: 'IFRAME'
        });
      } else {
        alert('PhonePeCheckout is not available.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert(error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.');
    }
  };

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
            <div className="saved-addresses-header">
              <h2>Saved Addresses</h2>
              {addresses.length > 0 && (
                <button 
                  className="add-address-btn"
                  onClick={() => setShowAddressForm(true)}
                >
                  Add New Address
                </button>
              )}
            </div>
            {addresses.length > 0 && (
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
            )}
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddNewAddress} className="delivery-form">
              <h2>Add New Address</h2>
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
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    if (addresses.length > 0) {
                      setShowAddressForm(false);
                      setSelectedAddress(addresses[0]);
                    }
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-address-btn"
                  disabled={isAddingAddress}
                >
                  {isAddingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          )}

          {selectedAddress && !showAddressForm && (
            <div className="selected-address-actions">
              <div className="button-group">
                <button 
                  type="button" 
                  className="pay-button"
                  onClick={handlePayment}
                >
                  Pay Now
                </button>
                <button 
                  type="button" 
                  className="place-order-button"
                  onClick={handleSubmit}
                >
                  Place Order (Cash on Delivery)
                </button>
              </div>
            </div>
          )}
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

// Add TypeScript declaration for PhonePe checkout
declare global {
  interface Window {
    PhonePeCheckout?: {
      transact: (options: {
        tokenUrl: string;
        callback: (response: string) => void;
        type: 'IFRAME';
      }) => void;
    };
  }
}

export default CheckoutPage; 