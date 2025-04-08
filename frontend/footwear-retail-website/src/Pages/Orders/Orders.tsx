import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';
import { MdArrowBack } from 'react-icons/md';
import { getPlacedOrders, cancelOrder } from '../../services/api'; // Import the cancelOrder function
import { OrdersResponse } from '../../services/api'; // Import the OrdersResponse type

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrdersResponse['orders']>([]); // State for orders
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token || !username) {
        navigate('/profile'); // Redirect if not logged in
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrders = await getPlacedOrders(username); // Fetch placed orders
        console.log(fetchedOrders); // Add this line to check the structure
        setOrders(fetchedOrders.orders); // Set the orders array
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]); // Re-run if navigate changes (usually doesn't)

  const handleCancelOrder = async (orderId: number) => {
    try {
      await cancelOrder(orderId); // Call the cancel order API
      setOrders(orders.filter(order => order.id !== orderId)); // Remove the canceled order from the state
    } catch (err) {
      console.error("Error canceling order:", err);
      setError("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <MdArrowBack />
        </button>
        <h1 className="page-title">My Orders</h1>
      </div>

      {isLoading && <div className="orders-loading">Loading your orders...</div>}
      {error && <div className="orders-error">{error}</div>}

      {!isLoading && !error && (
        <div className="orders-content">
          {orders.length === 0 ? (
             <div className="no-orders-message">
               <p>You don't have any orders yet.</p>
               <button 
                 className="start-shopping-btn"
                 onClick={() => navigate('/')}
               >
                 Start Shopping
               </button>
             </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-item-header">
                    <h3>Order ID: {order.id}</h3>
                    <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div className="order-details">
                    {order.orderItems.map(item => (
                      <div key={item.id} className="item-card">
                        <img src={item.image} alt={item.name} /> {/* Assuming each item has an image */}
                        <div>
                          <h4>{item.name}</h4>
                          <p>Size: {item.size}</p>
                          <p>Color: {item.color}</p>
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders; 