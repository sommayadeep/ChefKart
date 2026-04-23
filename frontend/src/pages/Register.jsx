import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, MapPin, UserPlus, Navigation, Loader2 } from 'lucide-react';
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
  const { register, googleLogin } = useAuth();
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
    try {
      await register({ 
        ...formData, 
        lat: coords.lat, 
        lng: coords.lng 
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="section min-h-[90vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-[32px] w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl mb-2">Create Account</h2>
          <p className="text-text-light">Join the ChefKart community today</p>
        </div>

        {error && <div className="bg-primary/10 text-primary p-4 rounded-xl mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-4">
            <button 
              type="button"
              className={`flex-1 py-3 rounded-xl font-bold transition ${formData.role === 'user' ? 'bg-primary text-white' : 'bg-surface text-text-light'}`}
              onClick={() => setFormData({...formData, role: 'user'})}
            >
              I'm a Customer
            </button>
            <button 
              type="button"
              className={`flex-1 py-3 rounded-xl font-bold transition ${formData.role === 'chef' ? 'bg-primary text-white' : 'bg-surface text-text-light'}`}
              onClick={() => setFormData({...formData, role: 'chef'})}
            >
              I'm a Chef
            </button>
          </div>

          <div className="relative">
            <UserIcon className="absolute left-4 top-4 text-text-light" size={20} />
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-text-light" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          {!formData.googleId && (
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-text-light" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-text-light" size={20} />
              <input 
                type="text" 
                placeholder="Complete Address" 
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
              <button 
                type="button" 
                onClick={handleGeoLocation}
                disabled={locating}
                className="absolute right-4 top-4 text-primary hover:scale-110 transition disabled:opacity-50"
              >
                {locating ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="City" 
                className="w-full p-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none text-sm"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="State" 
                className="w-full p-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none text-sm"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Pincode" 
                className="w-full p-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none text-sm"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary py-4 w-full justify-center text-lg mt-4">
            <UserPlus size={20} />
            Register Now
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-[1px] bg-glass-border"></div>
            <span className="text-text-light text-sm">OR REGISTER WITH</span>
            <div className="flex-1 h-[1px] bg-glass-border"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Authentication Failed')}
            />
          </div>
        </form>

        <p className="text-center mt-8 text-text-light">
          Already have an account? <Link to="/login" className="text-primary font-bold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
