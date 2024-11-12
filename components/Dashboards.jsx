import React, { useState, useEffect } from 'react';
import { client as sanityClient } from '../lib/client';
import { strapiClient, addStrapiData, fetchStrapiData } from '../lib/strapiClient'; // Import Strapi client
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique keys

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // New state for status filter
  // const isStrapiClient = process.env.STRAPI_CLIENT === 'true';
  const isStrapiClient = true;

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (isStrapiClient) {
        try {
          const response = await fetchStrapiData('/Orderdetailss', { 'pagination[pageSize]': 100, 'populate': '*' });
          const ordersData = response.data;
          setOrders(ordersData);
          setFilteredOrders(ordersData);
        } catch (error) {
          console.error('Error fetching Orderdetailss from Strapi:', error);
        }
      } else {
        try {
          const query = `
            *[_type == "orderDetails"]{
              _id,
              phoneNumber,
              name,
              address,
              paymentMethod,
              subtotal,
              cart,
              status,
              _createdAt
            } | order(_createdAt desc)
          `;
          const ordersData = await sanityClient.fetch(query);
          setOrders(ordersData);
          setFilteredOrders(ordersData);
        } catch (error) {
          console.error('Error fetching orders from Sanity:', error);
        }
      }
    };

    fetchOrders();
  }, [isStrapiClient]);

  const filterByDateAndStatus = () => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order._createdAt || order.createdAt);
      const normalizedOrderDate = new Date(orderDate);
      normalizedOrderDate.setHours(0, 0, 0, 0);

      const normalizedStartDate = startDate ? new Date(startDate) : null;
      if (normalizedStartDate) {
        normalizedStartDate.setHours(0, 0, 0, 0);
      }

      const normalizedEndDate = endDate ? new Date(endDate) : null;
      if (normalizedEndDate) {
        normalizedEndDate.setHours(23, 59, 59, 999);
      }

      return (
        (!startDate || normalizedOrderDate >= normalizedStartDate) &&
        (!endDate || normalizedOrderDate <= normalizedEndDate) &&
        (!statusFilter || order.status.toLowerCase() === statusFilter.toLowerCase())
      );
    });

    setFilteredOrders(filtered);
  };

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

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (isStrapiClient) {
        // Update order in Strapi
        await addStrapiData(`/Orderdetailss/${orderId}`, {
          data: { status },
        });
      } else {
        // Update order in Sanity
        await sanityClient.patch(orderId).set({ status }).commit();
      }

      // Update the local state
      setOrders(orders.map(order =>
        (order._id === orderId || order.id === orderId) ? { ...order, status } : order
      ));
      setFilteredOrders(filteredOrders.map(order =>
        (order._id === orderId || order.id === orderId) ? { ...order, status } : order
      ));

      alert(`Order status updated to ${status}.`);
    } catch (error) {
      console.error(`Failed to update order status to ${status}:`, error);
      alert(`Failed to update order status to ${status}. Please try again.`);
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
          <div className="order-card" key={order._id || order.id}>
            <h4>Order from {order.name}</h4>
            <p>Status: <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></p>
            <button onClick={() => updateOrderStatus(order.documentId || order.documentId, 'Done')} disabled={order.status === 'Done'}>Mark as Done</button>
            <button onClick={() => updateOrderStatus(order.documentId || order.documentId, 'Shipped')} disabled={order.status === 'Shipped' || order.status === 'Done'}>Mark as Shipped</button>
            <p>Subtotal: ₪{order.subtotal}</p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Order Date: {new Date(order._createdAt || order.createdAt).toLocaleDateString()}</p>
            <p>Products:</p>
            <ul>
              {order.cart.map((item, index) => (
                <li key={uuidv4()}>
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
