import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Camera, Save, Clock, CheckCircle, Navigation, Loader2, User as UserIcon } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
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
    if (!user?.id) {
      alert("ERROR: User ID is missing! Profile: " + JSON.stringify(user));
      setMessage('Update failed: User ID is missing. Please re-login.');
      return;
    }
    
    const url = `/chefs/${user.id}`;
    console.log("Saving to URL:", url);
    try {
      await api.patch(`/chefs/${user.id}`, {
        pricing: profile.pricing,
        experience: profile.experience,
        bio: profile.bio,
        specialties: profile.specialties,
        availability: profile.availability,
        timeSlots: profile.timeSlots,
        name: profile?.userId?.name || user?.name
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Update error detail:", err.response?.data || err.message);
      setMessage(`Update failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className="text-center py-20">Loading settings...</div>;

  return (
    <div className="section bg-surface min-h-screen">
      <div className="container max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
        >
          {/* Success Message Float */}
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-8 left-1/2 -translate-x-1/2 z-10 px-8 py-3 rounded-2xl font-bold shadow-lg ${
                message.includes('failed') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="text-center mb-16">
            <h1 className="text-4xl font-black mb-4">Chef Profile Settings</h1>
            <p className="text-text-light">Customize your culinary brand and availability</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-12">
            {/* Top Middle Profile Photo Display Only */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-56 h-56 rounded-[56px] overflow-hidden border-4 border-white shadow-2xl ring-8 ring-primary/5">
                  <img 
                    src={profile.userId?.profileImage || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="w-full max-w-md mt-12">
                <label className="block text-center text-sm font-black uppercase tracking-widest text-text-light mb-4">Chef Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-5 rounded-[24px] bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary text-center text-xl font-bold"
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
                <label className="block text-sm font-black uppercase tracking-widest text-text-light ml-2">Specialties</label>
                <input 
                  type="text" 
                  className="w-full p-5 rounded-[24px] bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary"
                  placeholder="Italian, Keto, Indian..."
                  value={profile.specialties?.join(', ') || ''}
                  onChange={(e) => setProfile({ ...profile, specialties: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-black uppercase tracking-widest text-text-light ml-2">Price (₹)</label>
                  <input 
                    type="number" 
                    className="w-full p-5 rounded-[24px] bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary"
                    value={profile.pricing || ''}
                    onChange={(e) => setProfile({ ...profile, pricing: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black uppercase tracking-widest text-text-light ml-2">Exp (Yrs)</label>
                  <input 
                    type="number" 
                    className="w-full p-5 rounded-[24px] bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary"
                    value={profile.experience || ''}
                    onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black uppercase tracking-widest text-text-light ml-2">Bio / Culinary Story</label>
              <textarea 
                className="w-full p-6 rounded-[32px] bg-white shadow-inner border-none outline-none focus:ring-2 ring-primary min-h-[160px] resize-none"
                placeholder="Tell your customers about your journey and passion..."
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white/50 p-8 rounded-[32px] border border-glass-border">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Navigation className="text-primary" size={20} />
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
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        profile.availability?.includes(day) ? 'bg-primary text-white shadow-lg' : 'bg-surface text-text-light'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/50 p-8 rounded-[32px] border border-glass-border">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Clock className="text-primary" size={20} />
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
                      className={`p-3 rounded-xl text-left text-xs font-bold transition-all border ${
                        profile.timeSlots?.includes(slot) ? 'bg-primary/10 text-primary border-primary shadow-inner' : 'bg-surface text-text-light border-transparent'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary py-5 w-full justify-center text-xl font-black rounded-[32px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Save size={24} />
              Save All Profile Changes
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChefSettings;
