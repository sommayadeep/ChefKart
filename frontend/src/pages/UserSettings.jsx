import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Save, MapPin, User as UserIcon } from 'lucide-react';
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
    <div className="section bg-background min-h-screen py-24">
      <div className="container max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="precious-card p-16 shadow-xl relative bg-white"
        >
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-md text-sm"
            >
              {message}
            </motion.div>
          )}

          <div className="text-center mb-12 border-b border-glass-border pb-8">
            <h1 className="text-4xl font-bold mb-3 text-text">Account Settings</h1>
            <p className="text-text-light font-medium">Manage your profile and location</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-text-light mb-2 ml-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="input-icon text-text-light opacity-50" size={18} />
                  <input 
                    type="text" 
                    className="input-with-icon w-full pr-5 py-4 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors font-medium text-text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-text-light mb-2 ml-2">Delivery Address</label>
                <div className="relative">
                  <MapPin className="input-icon text-text-light opacity-50" size={18} />
                  <textarea 
                    className="input-with-icon w-full pr-5 py-4 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors font-medium min-h-[100px] resize-none text-text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-text-light mb-2 ml-2">City</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors font-medium text-text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-text-light mb-2 ml-2">Pincode</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors font-medium text-text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary py-5 w-full justify-center text-sm tracking-widest mt-4">
              <Save size={20} className="mr-2" />
              Save Settings
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserSettings;
