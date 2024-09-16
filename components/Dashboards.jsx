import React, { useState, useEffect } from 'react';
import { client } from '../lib/client';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique keys

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // New state for status filter

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      const query = `
        *[_type == "orderDetails"]{
          _id,
          phoneNumber,
          name,
          address,
          paymentMethod,
          subtotal,
          cart,
          status, // Include the status field
          _createdAt
        } | order(_createdAt desc)
      `;
      const ordersData = await client.fetch(query);
      setOrders(ordersData);
      setFilteredOrders(ordersData); // Initially, show all orders
    };

    fetchOrders();
  }, []);

  const filterByDateAndStatus = () => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order._createdAt);
      
      // Normalize the orderDate to ignore time
      const normalizedOrderDate = new Date(orderDate);
      normalizedOrderDate.setHours(0, 0, 0, 0);
  
      // Normalize startDate and endDate to ignore time
      const normalizedStartDate = startDate ? new Date(startDate) : null;
      if (normalizedStartDate) {
        normalizedStartDate.setHours(0, 0, 0, 0);
      }
  
      const normalizedEndDate = endDate ? new Date(endDate) : null;
      if (normalizedEndDate) {
        normalizedEndDate.setHours(23, 59, 59, 999); // Include the entire end date
      }
  
      return (
        (!startDate || normalizedOrderDate >= normalizedStartDate) &&
        (!endDate || normalizedOrderDate <= normalizedEndDate) &&
        (!statusFilter || order.status.toLowerCase() === statusFilter.toLowerCase())
      );
    });
  
    setFilteredOrders(filtered);
  };

  // Get the most sold product
  const getMostSoldProduct = () => {
    const productCounts = {};

    filteredOrders.forEach((order) => {
      order.cart.forEach((item) => {
        if (productCounts[item.productName]) {
          productCounts[item.productName] += item.quantity;
        } else {
          productCounts[item.productName] = item.quantity;
        }
      });
    });

    const mostSold = Object.entries(productCounts).reduce(
      (most, current) => (current[1] > most[1] ? current : most),
      ['', 0]
    );

    return mostSold[0];
  };

  


  // Update order status to 'Done'
  const markAsDone = async (orderId) => {
    try {
      await client.patch(orderId)
        .set({ status: 'Done' }) // Set status to 'Done'
        .commit();

      // Update the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'Done' } : order
      ));
      setFilteredOrders(filteredOrders.map(order => 
        order._id === orderId ? { ...order, status: 'Done' } : order
      ));

      alert('Order status updated to Done.');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Update order status to 'Shipped'
  const markAsShipped = async (orderId) => {
    try {
      await client.patch(orderId)
        .set({ status: 'Shipped' }) // Set status to 'Shipped'
        .commit();

      // Update the local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'Shipped' } : order
      ));
      setFilteredOrders(filteredOrders.map(order => 
        order._id === orderId ? { ...order, status: 'Shipped' } : order
      ));

      alert('Order status updated to Shipped.');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Sales Dashboard</h1>

      {/* Filter Section */}
      <div className="filter-section">
        <h3>Filter Orders</h3>
        <div>
          <label>Date Range:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <button onClick={filterByDateAndStatus}>Filter</button>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div>
          <h3>Total Sales</h3>
          <p>Total Orders: {filteredOrders.length}</p>
          <p>Total Revenue: ₪{filteredOrders.reduce((total, order) => total + order.subtotal, 0)}</p>
        </div>
        <div>
          <h3>Most Sold Product</h3>
          <p>{getMostSoldProduct()}</p>
        </div>
      </div>

      {/* Order Details Section */}
      <div className="order-details-section">
        <h3>Order Details</h3>
        {filteredOrders.map((order) => (
          <div className="order-card" key={order._id}>
            <h4>Order from {order.name}</h4>
            <p>Status: <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></p>
            <button onClick={() => markAsDone(order._id)} disabled={order.status === 'Done'}>Mark as Done</button> {/* Button to change status */}
            <button onClick={() => markAsShipped(order._id)} disabled={order.status === 'Shipped' || order.status === 'Done'}>Mark as Shipped</button> {/* Button to change status */}
            <p>Subtotal: ₪{order.subtotal}</p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Order Date: {new Date(order._createdAt).toLocaleDateString()}</p>
            <p>Products:</p>
            <ul>
              {order.cart.map((item, index) => (
                <li key={index}>
                  {item.productName} (Quantity: {item.quantity})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
