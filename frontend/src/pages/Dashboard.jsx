import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, TrendingUp, Users, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const endpoint = user.role === 'chef' ? '/bookings/chef' : '/bookings/user';
      const res = await api.get(endpoint);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  const incompleteProfile = user.role === 'chef' && !user.bio;

  return (
    <div className="section bg-surface min-h-screen">
      <div className="container">
        {incompleteProfile && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 p-6 rounded-3xl mb-12 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-primary mb-1">Complete Your Profile!</h3>
              <p className="text-text-light">Completing your bio helps you get 3x more bookings.</p>
            </div>
            <Link to="/settings" className="btn btn-primary">
              Go to Settings
            </Link>
          </motion.div>
        )}
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl mb-2">Welcome back, {user.name}!</h1>
            <p className="text-text-light capitalize">You are logged in as {user.role}</p>
          </div>
          <div className="flex gap-4">
            <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
              <TrendingUp size={20} className="text-primary" />
              <div>
                <p className="text-xs text-text-light">Total Bookings</p>
                <p className="font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid for Chef/Admin */}
        {(user.role === 'chef' || user.role === 'admin') && (
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="glass p-8 rounded-3xl">
              <Users size={32} className="text-primary mb-4" />
              <h3 className="text-xl mb-1">Active Customers</h3>
              <p className="text-3xl font-bold">12</p>
            </div>
            <div className="glass p-8 rounded-3xl">
              <ChefHat size={32} className="text-primary mb-4" />
              <h3 className="text-xl mb-1">Upcoming Meals</h3>
              <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'accepted').length}</p>
            </div>
            <div className="glass p-8 rounded-3xl">
              <TrendingUp size={32} className="text-primary mb-4" />
              <h3 className="text-xl mb-1">Total Earnings</h3>
              <p className="text-3xl font-bold">₹45,200</p>
            </div>
          </div>
        )}

        {/* Bookings Table/List */}
        <div className="glass rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-glass-border flex justify-between items-center">
            <h3 className="text-2xl">Recent Bookings</h3>
            <button className="text-primary font-bold hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface/50 text-text-light text-sm uppercase">
                  <th className="px-8 py-4">Chef / User</th>
                  <th className="px-8 py-4">Date & Time</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {bookings.map((booking, i) => (
                  <motion.tr 
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-surface/30 transition"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {(user.role === 'chef' ? booking.userId?.name : booking.chefId?.name)?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold">{user.role === 'chef' ? booking.userId?.name : booking.chefId?.name}</p>
                          <p className="text-xs text-text-light">{user.role === 'chef' ? booking.userId?.email : booking.chefId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-primary" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-light">
                          <Clock size={14} />
                          {booking.timeSlot}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold">₹{booking.totalAmount}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {user.role === 'chef' && booking.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateStatus(booking._id, 'accepted')}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => updateStatus(booking._id, 'rejected')}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <button className="text-text-light hover:text-primary transition">
                          <AlertCircle size={20} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="p-20 text-center text-text-light">
              <p className="text-lg">No bookings found yet.</p>
              {user.role === 'user' && <Link to="/chefs" className="text-primary font-bold mt-2 inline-block">Start searching for chefs</Link>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
