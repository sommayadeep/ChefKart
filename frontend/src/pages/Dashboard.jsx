import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, TrendingUp, Users, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const endpoint = user.role === 'chef' ? '/bookings/chef' : '/bookings/user';
      const res = await api.get(endpoint);
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      fetchBookings();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'accepted': return 'bg-accent/10 text-accent border-accent/20';
      case 'rejected': return 'bg-rose-50 text-rose-500 border-rose-200';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="section min-h-screen bg-background">
      <div className="container">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-16 border-b border-glass-border pb-12">
          <div>
            <div className="flex items-center gap-2 text-text-light font-bold tracking-[0.3em] text-[10px] uppercase mb-4">
              <TrendingUp size={16} />
              Personal Portal
            </div>
            <h1 className="text-5xl tracking-tighter text-text mb-2">Salutations, <span className="italic">{user.name}</span></h1>
            <p className="text-text-light text-sm font-medium">Elite {user.role} Account Status</p>
          </div>
          
          <div className="flex gap-6">
             <div className="precious-card px-8 py-5 flex items-center gap-5">
               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Calendar size={24} />
               </div>
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-text-light mb-1">Activities</p>
                 <p className="text-2xl font-bold text-text">{bookings.length}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Stats Grid for Chef/Admin */}
        {(user.role === 'chef' || user.role === 'admin') && (
          <div className="grid grid-cols-3 gap-8 mb-16">
            <motion.div whileHover={{ translateY: -5 }} className="precious-card p-10 group">
              <Users size={36} className="text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-text-light uppercase tracking-widest mb-2">Active Clientele</h3>
              <p className="text-4xl font-bold text-text">{new Set(bookings.map(b => b.userId?._id || b.userId)).size}</p>
            </motion.div>
            <motion.div whileHover={{ translateY: -5 }} className="precious-card p-10 group">
              <CheckCircle2 size={36} className="text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-text-light uppercase tracking-widest mb-2">Confirmed Engagements</h3>
              <p className="text-4xl font-bold text-text">{bookings.filter(b => b.status === 'accepted').length}</p>
            </motion.div>
            <motion.div whileHover={{ translateY: -5 }} className="precious-card p-10 group">
              <Wallet size={36} className="text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-text-light uppercase tracking-widest mb-2">Accrued Revenue</h3>
              <p className="text-4xl font-bold text-text">₹{bookings.filter(b => b.status === 'accepted').reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0).toLocaleString()}</p>
            </motion.div>
          </div>
        )}

        {/* Bookings Table */}
        <div className="precious-card overflow-hidden">
          <div className="p-10 border-b border-glass-border flex justify-between items-center bg-surface">
            <h3 className="text-3xl tracking-tight text-text">Recent Transactions</h3>
            <button className="text-primary font-bold text-xs tracking-widest uppercase hover:text-text transition-colors">View Archive</button>
          </div>
          
          <div className="overflow-x-auto bg-surface">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/50 border-b border-glass-border text-text-light text-[11px] font-bold uppercase tracking-[0.2em]">
                  <th className="px-10 py-6 font-bold">Associate</th>
                  <th className="px-10 py-6 font-bold">Schedule</th>
                  <th className="px-10 py-6 font-bold">Value</th>
                  <th className="px-10 py-6 font-bold">Status</th>
                  <th className="px-10 py-6 font-bold text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {bookings.map((booking, i) => (
                  <motion.tr 
                    key={booking._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-background/50 transition-colors group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-glass-border shadow-sm flex items-center justify-center text-primary font-bold text-xl group-hover:border-primary/50 transition-colors">
                          {(user.role === 'chef' ? booking.userId?.name : booking.chefId?.name)?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-text mb-1">{user.role === 'chef' ? booking.userId?.name : booking.chefId?.name}</p>
                          <p className="text-xs text-text-light font-medium tracking-wide">{user.role === 'chef' ? booking.userId?.email : booking.chefId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-sm font-semibold text-text">
                          <Calendar size={18} className="text-primary" />
                          {new Date(booking.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-light font-bold uppercase tracking-wider">
                          <Clock size={18} />
                          {booking.timeSlot}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="font-bold text-2xl text-text">₹{booking.totalAmount}</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      {user.role === 'chef' && booking.status === 'pending' ? (
                        <div className="flex gap-3 justify-end">
                          <button 
                            onClick={() => updateStatus(booking._id, 'accepted')}
                            className="w-12 h-12 bg-accent/10 text-accent border border-accent/20 rounded-xl hover:bg-accent hover:text-white transition-all flex items-center justify-center"
                          >
                            <CheckCircle2 size={24} />
                          </button>
                          <button 
                            onClick={() => updateStatus(booking._id, 'rejected')}
                            className="w-12 h-12 bg-rose-50 text-rose-500 border border-rose-200 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                          >
                            <XCircle size={24} />
                          </button>
                        </div>
                      ) : (
                        <button className="text-text-light hover:text-primary transition-colors p-3 bg-white rounded-xl border border-glass-border shadow-sm">
                          <AlertCircle size={24} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="p-32 text-center bg-surface">
              <div className="bg-background w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-glass-border shadow-inner">
                <AlertCircle size={40} className="text-text-light" />
              </div>
              <p className="text-3xl font-bold mb-4 text-text">No recent engagements</p>
              <p className="text-text-light font-medium mb-12 max-w-sm mx-auto text-lg">Your culinary itinerary is currently open for new opportunities.</p>
              {user.role === 'user' && (
                <Link to="/chefs" className="btn btn-primary px-12 py-5 text-lg">
                  Explore Master Chefs
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
