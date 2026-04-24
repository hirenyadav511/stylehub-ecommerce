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
      const { data } = await api.put(`/orders/status/${id}`, { status });
      setOrders(orders.map(o => o._id === id ? data.order : o));
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

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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
                  <p className="text-sm text-gray-500 mt-1">Payment: <span className="font-semibold uppercase">{order.paymentStatus}</span> ({order.paymentMethod || 'Stripe'})</p>
                  <button 
                    onClick={() => openOrderDetails(order)}
                    className="mt-3 text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    <i className="fa fa-eye"></i> View Full Details
                  </button>
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

              {/* Order Products Preview */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 border-b-2 border-gray-100 inline-block pb-1">Purchased Products ({order.products?.length || 0})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(order.products || []).slice(0, 3).map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded border border-gray-100">
                      <div className="w-12 h-12 flex-shrink-0">
                        <img 
                          src={getImageUrl(item.productId?.images?.[0] || item.image)} 
                          className="w-12 h-12 object-cover rounded" 
                          alt={item.name} 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-xs truncate w-32">{item.name}</p>
                        <p className="text-gray-600 text-[10px]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.products?.length > 3 && (
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded border border-dashed text-gray-400 text-xs font-bold">
                      +{order.products.length - 3} More items
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fa fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Customer & Shipping */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Shipping Address</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[120px] flex flex-col justify-center">
                    {selectedOrder.shippingAddress ? (
                      <>
                        <p className="font-bold text-gray-800 text-lg mb-1">{selectedOrder.shippingAddress.fullName}</p>
                        <p className="text-gray-600 mb-1">{selectedOrder.shippingAddress.address}</p>
                        <p className="text-gray-600 mb-1">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                        <p className="text-gray-600 mb-3">{selectedOrder.shippingAddress.pincode}</p>
                        <div className="flex items-center gap-2 text-blue-600 font-semibold">
                          <i className="fa fa-phone"></i>
                          <span>{selectedOrder.shippingAddress.phone}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fa fa-exclamation-triangle text-gray-300 mb-2"></i>
                        <p className="text-gray-400 text-xs italic">No shipping information available for this order.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Information */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Info</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID</span>
                      <span className="font-medium text-gray-800">#{selectedOrder._id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium text-gray-800">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status</span>
                      <span className={`font-bold uppercase text-xs px-2 py-1 rounded ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method</span>
                      <span className="font-medium text-gray-800 uppercase">{selectedOrder.paymentMethod || 'Stripe'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Status</span>
                      <span className="font-bold text-blue-600 capitalize">{selectedOrder.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-center">Size/Color</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.products?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={getImageUrl(item.productId?.images?.[0] || item.image)} className="w-10 h-10 object-cover rounded" />
                              <span className="font-medium text-gray-800 truncate w-32">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center text-gray-600 uppercase text-xs">{item.size} / {item.color}</td>
                          <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="p-3 text-right font-bold">{formatPrice(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-900 text-white p-6 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Grand Total</p>
                  <p className="text-3xl font-bold">{formatPrice(selectedOrder.totalAmount)}</p>
                </div>
                <div className="text-right">
                  {selectedOrder.discountAmount > 0 && (
                    <p className="text-red-400 text-sm mb-1">Discount: -{formatPrice(selectedOrder.discountAmount)}</p>
                  )}
                  <p className="text-gray-400 text-xs">Tax included</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-top bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded font-bold hover:bg-gray-700 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
