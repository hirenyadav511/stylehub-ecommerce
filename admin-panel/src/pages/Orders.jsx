import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatPrice } from '../utils/formatters';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
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
      await api.put(`/orders/status/${id}`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5001${imagePath}`;
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
                  <p className="font-bold text-xl text-gray-800 mb-2">{formatPrice(order.totalAmount)}</p>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Change Status</span>
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded p-1 text-sm bg-gray-50 outline-none capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="out for delivery">Out for Delivery</option>
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
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={getImageUrl(item.productId?.images?.[0] || item.image)} 
                          className="w-16 h-16 object-cover rounded" 
                          alt={item.name} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/64?text=No+Img";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name || (item.productId ? item.productId.name : 'Unknown Product')}</p>
                        <p className="text-gray-600 text-sm mt-1">Qty: {item.quantity}</p>
                        <p className="text-gray-800 font-bold text-sm mt-1">{formatPrice(item.price)}</p>
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
