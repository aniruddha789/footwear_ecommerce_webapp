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
        const fetchedOrders = await getPlacedOrders(username);
        // Sort orders by date in descending order (newest first)
        const sortedOrders = [...fetchedOrders.orders].sort((a, b) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        setOrders(sortedOrders);
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
                <div key={order.id} className="order-box">
                  <div className="order-box-header">
                    <div className="order-info">
                      <span className="order-number">#{order.id}</span>
                      <span className="order-date">Order Placed: {new Date(order.orderDate).toLocaleDateString()}</span>
                      <div className="item-status">
                            <span className="status-label">Status:</span>
                            <span className="status-value">{order.orderStatus}</span>
                      </div>    
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.orderItems.map(item => (
                      <div key={item.id} className="order-item-card">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-details">
                          
                         
                          <h3 className="item-name">{item.name}</h3>
                          <p className="item-brand">Color: {item.color}</p>
                          <div className="item-specs">
                            <p>Size: {item.size}</p>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          
                          <div className="itemPrice">

                            <p>₹{item.price}</p>
                          </div>
                          <div className="delivery-date">
                          {order.orderStatus === 'CANCELLED' ? (
                            <div className="cancellation-note">
                              <span>Note: Cancelled orders are deleted from the system after 10 days</span>
                            </div>
                          ) : (
                            <div>
                              <span>Delivery Expected by:</span>
                              <span>{new Date(new Date(order.orderDate).setDate(new Date(order.orderDate).getDate() + 7)).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>P
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-box-footer">
                    <div className="total-amount">
                    Total: ₹ {order.orderItems.reduce((sum, item) => sum + (item.price || 0), 0)}
                    </div>
                    {order.orderStatus !== 'CANCELLED' && (
                      <button 
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        CANCEL ORDER
                      </button>
                    )} 
                  </div>
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