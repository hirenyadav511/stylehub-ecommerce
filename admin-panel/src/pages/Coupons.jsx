import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatPrice } from '../utils/formatters';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        minOrderAmount: '',
        expiryDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchCoupons = async () => {
        setListLoading(true);
        try {
            const { data } = await api.get('/coupons');
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setListLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCoupons();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const payload = {
            code: formData.code.toUpperCase(),
            discountType: 'percentage',
            discountValue: Number(formData.discount),
            minOrderAmount: Number(formData.minOrderAmount),
            expiryDate: formData.expiryDate,
            usageLimit: 1000
        };

        try {
            await api.post('/coupons', payload);
            setMessage({ type: 'success', text: 'Coupon created successfully!' });
            setFormData({
                code: '',
                discount: '',
                minOrderAmount: '',
                expiryDate: ''
            });
            fetchCoupons(); // Refresh list
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to create coupon' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete coupon');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
                <p className="text-gray-500">Create and manage discount codes for your customers.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-md font-semibold text-gray-700">New Coupon</h2>
                        </div>
                        
                        <div className="p-6">
                            {message.text && (
                                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center justify-between ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    <span>{message.text}</span>
                                    <button onClick={() => setMessage({ type: '', text: '' })} className="hover:opacity-70">
                                        &times;
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="SUMMER20"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none uppercase text-sm"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Discount (%)</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            placeholder="20"
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Min Order (₹)</label>
                                        <input
                                            type="number"
                                            name="minOrderAmount"
                                            value={formData.minOrderAmount}
                                            onChange={handleChange}
                                            placeholder="100"
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-2.5 rounded-lg font-bold text-white transition-all text-sm ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? 'Processing...' : 'Create Coupon'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Coupon List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-md font-semibold text-gray-700">Existing Coupons</h2>
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {coupons.length} total
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4">Discount</th>
                                        <th className="px-6 py-4">Min Order</th>
                                        <th className="px-6 py-4">Expiry</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {listLoading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading coupons...</td>
                                        </tr>
                                    ) : coupons.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No coupons found.</td>
                                        </tr>
                                    ) : (
                                        coupons.map((coupon) => (
                                            <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800">{coupon.code}</td>
                                                <td className="px-6 py-4">{coupon.discountValue}%</td>
                                                <td className="px-6 py-4">{formatPrice(coupon.minOrderAmount)}</td>
                                                <td className="px-6 py-4">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleDelete(coupon._id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                        title="Delete Coupon"
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coupons;
