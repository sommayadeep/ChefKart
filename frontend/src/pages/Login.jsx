import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="section min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-[32px] w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl mb-2">Welcome Back</h2>
          <p className="text-text-light">Login to manage your bookings</p>
        </div>

        {error && <div className="bg-primary/10 text-primary p-4 rounded-xl mb-6 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-text-light" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-text-light" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-transparent focus:border-primary outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary py-4 w-full justify-center text-lg">
            <LogIn size={20} />
            Login
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-[1px] bg-glass-border"></div>
            <span className="text-text-light text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-glass-border"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={credentialResponse => {
                googleLogin(credentialResponse.credential)
                  .then(() => navigate('/dashboard'))
                  .catch((err) => {
                    console.error("Backend Google Login Error:", err.response?.data || err.message);
                    setError(err.response?.data?.error || 'Backend verification failed');
                  });
              }}
              onError={() => {
                console.error("Google OAuth Popup/Init Error");
                setError('Google Popup Blocked or Client ID Mismatch');
              }}
            />
          </div>
        </form>

        <p className="text-center mt-8 text-text-light">
          Don't have an account? <Link to="/register" className="text-primary font-bold">Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
