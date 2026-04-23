import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Save, Clock, Navigation, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ChefSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    userId: { name: '', profileImage: '' },
    pricing: 0,
    experience: 0,
    bio: '',
    specialties: [],
    availability: [],
    timeSlots: []
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/chefs/${user.id}`);
      if (res.data) {
        setProfile({
          ...res.data,
          userId: res.data.userId || { name: user.name, profileImage: user.profileImage || '' }
        });
      }
    } catch (err) {
      console.error(err);
      setProfile(prev => ({
        ...prev,
        userId: { name: user.name, profileImage: user.profileImage || '' }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/auth/update', {
        name: profile.userId.name
      });

      await api.put('/chefs/profile', {
        pricing: profile.pricing,
        experience: profile.experience,
        bio: profile.bio,
        specialties: profile.specialties,
        availability: profile.availability,
        timeSlots: profile.timeSlots
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Update error detail:", err.response?.data || err.message);
      setMessage(`Update failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className="text-center py-20 text-text-light">Loading settings...</div>;

  return (
    <div className="section bg-background min-h-screen py-24">
      <div className="container max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="precious-card p-16 shadow-xl relative bg-white"
        >
          {/* Success Message Float */}
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-6 left-1/2 -translate-x-1/2 z-10 px-6 py-2 rounded-xl font-bold shadow-md text-sm ${
                message.includes('failed') ? 'bg-rose-500 text-white' : 'bg-primary text-white'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="text-center mb-12 border-b border-glass-border pb-8">
            <h1 className="text-4xl font-bold mb-3 text-text">Chef Registry</h1>
            <p className="text-text-light font-medium">Manage your professional profile and availability</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md">
                <label className="block text-center text-[11px] font-bold uppercase tracking-widest text-text-light mb-2">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light opacity-50" size={20} />
                  <input 
                    type="text" 
                    className="w-full pl-14 pr-5 py-4 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors text-center text-lg font-bold text-text"
                    placeholder="Enter your professional name"
                    value={profile.userId?.name || ''}
                    onChange={(e) => setProfile({ ...profile, userId: { ...profile.userId, name: e.target.value } })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-text-light mb-2 ml-2">Specialties</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors font-medium text-text"
                  placeholder="Italian, Keto, Indian..."
                  value={profile.specialties?.join(', ') || ''}
                  onChange={(e) => setProfile({ ...profile, specialties: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-text-light mb-2 ml-2">Honorarium (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-4 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors font-medium text-text"
                    value={profile.pricing || ''}
                    onChange={(e) => setProfile({ ...profile, pricing: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-text-light mb-2 ml-2">Exp (Yrs)</label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-4 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors font-medium text-text"
                    value={profile.experience || ''}
                    onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-text-light mb-2 ml-2">Culinary Story</label>
              <textarea 
                className="w-full p-5 rounded-2xl border border-glass-border focus:border-primary outline-none transition-colors font-medium min-h-[140px] resize-none text-text"
                placeholder="Tell your clients about your journey and passion..."
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-background p-6 rounded-2xl border border-glass-border">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-text">
                  <Navigation className="text-primary" size={18} />
                  Service Days
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button 
                      key={day}
                      type="button"
                      onClick={() => {
                        const newAvail = profile.availability?.includes(day)
                          ? profile.availability.filter(d => d !== day)
                          : [...(profile.availability || []), day];
                        setProfile({ ...profile, availability: newAvail });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        profile.availability?.includes(day) ? 'bg-primary text-white shadow-sm' : 'bg-white border border-glass-border text-text-light hover:border-primary'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-background p-6 rounded-2xl border border-glass-border">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-text">
                  <Clock className="text-primary" size={18} />
                  Time Slots
                </h3>
                <div className="flex flex-col gap-2">
                  {['Breakfast', 'Lunch', 'Dinner'].map(slot => (
                    <button 
                      key={slot}
                      type="button"
                      onClick={() => {
                        const newSlots = profile.timeSlots?.includes(slot)
                          ? profile.timeSlots.filter(s => s !== slot)
                          : [...(profile.timeSlots || []), slot];
                        setProfile({ ...profile, timeSlots: newSlots });
                      }}
                      className={`px-4 py-2.5 rounded-lg text-left text-xs font-bold transition-all border ${
                        profile.timeSlots?.includes(slot) ? 'bg-primary/10 text-primary border-primary' : 'bg-white border-glass-border text-text-light hover:border-primary'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary py-5 w-full justify-center text-sm tracking-widest mt-4">
              <Save size={20} className="mr-2" />
              Save Registry
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChefSettings;
