import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, MapPin, Navigation, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    googleId: '',
    role: 'user',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleGeoLocation = () => {
    if ("geolocation" in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.address;
          
          setFormData(prev => ({
            ...prev,
            address: data.display_name,
            city: addr.city || addr.town || addr.village || '',
            state: addr.state || '',
            pincode: addr.postcode || ''
          }));
        } catch (err) {
          console.error("Reverse geocoding failed", err);
          setFormData(prev => ({ ...prev, address: `Lat: ${latitude}, Lng: ${longitude}` }));
        } finally {
          setLocating(false);
        }
      }, (err) => {
        setError("Location access denied");
        setLocating(false);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setFormData(prev => ({
      ...prev,
      name: decoded.name,
      email: decoded.email,
      googleId: decoded.sub
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ 
        ...formData, 
        lat: coords.lat, 
        lng: coords.lng 
      });
      navigate('/dashboard');
    } catch (err) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      if (apiMessage) {
        setError(apiMessage);
        return;
      }
      if (err?.message === 'Network Error') {
        setError('Server is unreachable. Start backend on port 5001 and try again.');
        return;
      }
      setError('Application rejected');
    }
  };

  return (
    <div className="section min-h-screen flex items-center justify-center bg-background relative py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="precious-card p-20 w-full max-w-3xl bg-white relative z-10"
      >
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <Sparkles size={36} className="text-primary" />
          </div>
          <h2 className="text-6xl mb-4 tracking-tighter text-text">Join The Circle</h2>
          <p className="text-text-light font-bold tracking-[0.3em] uppercase text-[10px]">Private Culinary Membership</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-rose-50 text-rose-500 border border-rose-100 p-5 rounded-2xl mb-12 text-center text-sm font-bold uppercase tracking-widest"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-background rounded-[24px] border border-glass-border">
            <button 
              type="button"
              className={`py-4 rounded-[18px] font-bold transition-all text-[11px] uppercase tracking-[0.2em] ${formData.role === 'user' ? 'bg-white text-text shadow-lg' : 'text-text-light hover:text-text'}`}
              onClick={() => setFormData({...formData, role: 'user'})}
            >
              Elite Member
            </button>
            <button 
              type="button"
              className={`py-4 rounded-[18px] font-bold transition-all text-[11px] uppercase tracking-[0.2em] ${formData.role === 'chef' ? 'bg-white text-text shadow-lg' : 'text-text-light hover:text-text'}`}
              onClick={() => setFormData({...formData, role: 'chef'})}
            >
              Master Chef
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-light ml-2">Legal Name</label>
              <div className="relative">
                <UserIcon className="input-icon text-text-light opacity-40" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="input-with-icon w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-light ml-2">Digital Address</label>
              <div className="relative">
                <Mail className="input-icon text-text-light opacity-40" size={20} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="input-with-icon w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {!formData.googleId && (
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-light ml-2">Secure Keyphrase</label>
              <div className="relative">
                <Lock className="input-icon text-text-light opacity-40" size={20} />
                <input 
                  type="password" 
                  placeholder="Create password" 
                  className="input-with-icon w-full"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-6">
             <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-light ml-2">Residence Geography</label>
              <div className="relative">
                <MapPin className="input-icon text-text-light opacity-40" size={20} />
                <input 
                  type="text" 
                  placeholder="Complete Address" 
                  className="input-with-icon pr-20 w-full"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
                <button 
                  type="button" 
                  onClick={handleGeoLocation}
                  disabled={locating}
                  className="absolute right-6 top-5 text-primary hover:scale-110 transition disabled:opacity-50"
                >
                  {locating ? <Loader2 className="animate-spin" size={22} /> : <Navigation size={22} />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <input 
                type="text" 
                placeholder="City" 
                className="p-5 text-sm font-bold tracking-wider"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="State" 
                className="p-5 text-sm font-bold tracking-wider"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Pincode" 
                className="p-5 text-sm font-bold tracking-wider"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary py-6 w-full justify-center text-lg mt-4 group">
            Request Access
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>

          <div className="flex items-center gap-8 my-4">
            <div className="flex-1 h-[1px] bg-glass-border"></div>
            <span className="text-text-light text-[10px] font-bold uppercase tracking-widest">Or Register With</span>
            <div className="flex-1 h-[1px] bg-glass-border"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              shape="pill"
            />
          </div>
        </form>

        <p className="text-center mt-16 text-text-light font-medium text-sm">
          Already in the circle? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Secure Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
