import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Camera, Save, MapPin, User as UserIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const UserSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    profileImage: user?.profileImage || ''
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/auth/update', {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Update failed');
    }
  };

  return (
    <div className="section bg-surface min-h-screen">
      <div className="container max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-[40px] shadow-2xl relative"
        >
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 z-10 bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
            >
              {message}
            </motion.div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4">Account Settings</h1>
            <p className="text-text-light">Manage your profile and location</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">


            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-text-light mb-2 ml-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-text-light mb-2 ml-2">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-primary" size={18} />
                  <textarea 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary font-medium min-h-[100px] resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-text-light mb-2 ml-2">City</label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary font-bold"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-text-light mb-2 ml-2">Pincode</label>
                  <input 
                    type="text" 
                    className="w-full p-4 rounded-2xl bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary font-bold"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary py-5 w-full justify-center text-lg font-black rounded-3xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Save size={24} />
              Save Settings
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserSettings;
