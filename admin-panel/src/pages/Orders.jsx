import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const { data } = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    } catch (error) {
      alert('Error updating order status');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Orders List</h2>

      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded shadow-sm">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded shadow-sm border border-gray-200">
              {/* Order Header */}
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <p className="font-bold text-gray-800 mb-1">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Payment: <span className="font-semibold">{order.paymentStatus}</span></p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-gray-800 mb-2">${order.totalAmount.toFixed(2)}</p>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Change Status</span>
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded p-1 text-sm bg-gray-50 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Products */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 border-b-2 border-gray-100 inline-block pb-1">Purchased Products</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.products && order.products.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded border border-gray-100">
                      {item.productId && item.productId.image ? (
                        <img src={item.productId.image} className="w-16 h-16 object-cover rounded" alt={item.productId.title} />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.productId ? item.productId.title : 'Unknown Product'}</p>
                        <p className="text-gray-600 text-sm mt-1">Qty: {item.quantity}</p>
                        <p className="text-gray-800 font-bold text-sm mt-1">${item.productId ? item.productId.price : 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
