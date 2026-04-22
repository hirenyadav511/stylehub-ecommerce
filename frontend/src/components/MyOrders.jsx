import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import api, { setAuthToken } from "../utils/api";
import Skeleton from "react-loading-skeleton";
import { formatPrice } from "../utils/formatters";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken, isSignedIn } = useAuth();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5001${imagePath}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (isSignedIn) {
        setLoading(true);
        try {
          const token = await getToken();
          setAuthToken(token);
          const { data } = await api.get("/orders/my");
          setOrders(data);
        } catch (err) {
          setError(err.message || "Failed to fetch orders");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [isSignedIn, getToken]);

  const OrderLoading = () => (
    <div className="container py-5">
      <Skeleton height={50} count={3} className="mb-3" />
    </div>
  );

  if (loading) return <OrderLoading />;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="display-6 fw-bolder text-center mb-5">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center lead">You have no orders yet.</div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-dark text-white d-flex justify-content-between">
                  <span>Order ID: {order._id}</span>
                  <span className="badge bg-primary text-uppercase">{order.status}</span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                       <ul className="list-group list-group-flush">
                          {order.products.map((item, idx) => (
                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 ps-0">
                               <span className="d-flex align-items-center gap-3">
                                 {(item.image || item.productId?.image) && (
                                   <img 
                                     src={getImageUrl(item.image || item.productId?.image)} 
                                     width={50} 
                                     height={50} 
                                     className="object-cover rounded shadow-sm" 
                                     alt="product" 
                                   />
                                 )}
                                 <div>
                                   <div className="fw-bold">{item.name || item.productId?.title || 'Unknown Product'}</div>
                                   {(item.size || item.color) && (
                                     <small className="text-muted">{item.size} / {item.color}</small>
                                   )}
                                 </div>
                               </span>
                               <span>{item.quantity} × {formatPrice(item.price)}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="col-md-4 text-end">
                       <h5>Total: {formatPrice(order.totalAmount)}</h5>
                       <small className="text-muted">Placed on {new Date(order.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
