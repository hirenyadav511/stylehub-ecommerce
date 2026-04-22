import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../utils/adminApi";
import Skeleton from "react-loading-skeleton";
import { formatPrice } from "../utils/formatters";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Interceptors now handle token attachment and redirections
        const [ordersRes, usersRes] = await Promise.all([
          adminApi.get("/orders"),
          adminApi.get("/users")
        ]);

        setOrders(ordersRes.data);
        setUsers(usersRes.data);
      } catch (err) {
         setError(err.response?.data?.message || err.message || "Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [navigate]);

  const updateStatus = async (orderId, status) => {
    try {
      await adminApi.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
       alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  if (loading && !error) return <div className="container py-5"><Skeleton height={50} count={5} /></div>;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="display-6 fw-bolder mb-0">Admin Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          <i className="fa fa-sign-out me-1"></i> Admin Logout
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card text-center p-3 bg-light border-0 shadow-sm">
             <h3>{users.length}</h3>
             <p className="lead mb-0">Total Users</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-center p-3 bg-light border-0 shadow-sm">
             <h3>{orders.length}</h3>
             <p className="lead mb-0">Total Orders</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
           <div className="card text-center p-3 bg-light border-0 shadow-sm">
             <h3>{formatPrice(orders.reduce((acc, o) => acc + o.totalAmount, 0))}</h3>
             <p className="lead mb-0">Total Revenue</p>
           </div>
        </div>
      </div>

      <h4 className="mt-5 mb-3">Manage Orders</h4>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId}</td>
                <td>{formatPrice(order.totalAmount)}</td>
                <td>
                  <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'warning'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select 
                    className="form-select form-select-sm" 
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
