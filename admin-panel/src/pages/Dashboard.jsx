import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [prodRes, orderRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const productsCount = prodRes.data.length || 0;
        const ordersList = orderRes.data.orders || [];
        const totalRev = ordersList.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

        setStats({ products: productsCount, orders: ordersList.length, revenue: totalRev });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.products}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.orders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
