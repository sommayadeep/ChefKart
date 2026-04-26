import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
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
      setError('Credentials not recognized');
    }
  };

  return (
    <div className="section min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="precious-card p-16 w-full max-w-xl bg-white relative z-10"
      >
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <ShieldCheck size={36} className="text-primary" />
          </div>
          <h2 className="text-5xl mb-4 tracking-tighter text-text">Authorized Entry</h2>
          <p className="text-text-light font-bold tracking-[0.3em] uppercase text-[10px]">Private Reserve Security</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-rose-50 text-rose-500 border border-rose-100 p-5 rounded-2xl mb-10 text-center text-sm font-bold uppercase tracking-widest"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-light ml-2">Email Address</label>
            <div className="relative">
              <Mail className="input-icon text-text-light opacity-40" size={20} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="input-with-icon w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-light ml-2">Secure Phrase</label>
            <div className="relative">
              <Lock className="input-icon text-text-light opacity-40" size={20} />
              <input 
                type="password" 
                placeholder="••••••••••••" 
                className="input-with-icon w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary py-5 w-full justify-center text-lg mt-4 group">
            Sign In
            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </button>

          <div className="flex items-center gap-6 my-4">
            <div className="flex-1 h-[1px] bg-glass-border"></div>
            <span className="text-text-light text-[10px] font-bold uppercase tracking-widest">Or Sync With</span>
            <div className="flex-1 h-[1px] bg-glass-border"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={credentialResponse => {
                googleLogin(credentialResponse.credential)
                  .then(() => navigate('/dashboard'))
                  .catch((err) => setError('Verification failed'));
              }}
              shape="pill"
            />
          </div>
        </form>

        <p className="text-center mt-12 text-text-light font-medium text-sm">
          Awaiting an invitation? <Link to="/register" className="text-primary font-bold hover:underline ml-1">Request Membership</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
