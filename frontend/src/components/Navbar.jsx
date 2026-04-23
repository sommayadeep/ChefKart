import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, User, LogOut, Search, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 py-6 border-b border-glass-border">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-12 h-12 bg-secondary rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-secondary/10"
          >
            <ChefHat size={26} strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tighter text-text leading-none uppercase">ChefKart</span>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary mt-1">Private Reserve</span>
          </div>
        </Link>

        <div className="flex items-center gap-12">
          <Link to="/chefs" className="flex items-center gap-2.5 font-bold text-[11px] uppercase tracking-[0.2em] text-text-light hover:text-primary transition-all">
            <Search size={14} className="opacity-60" />
            Discover
          </Link>

          {user ? (
            <div className="flex items-center gap-10">
              <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-[11px] uppercase tracking-[0.2em] text-text-light hover:text-primary transition-all">
                <User size={14} className="opacity-60" />
                Concierge
              </Link>
              <Link 
                to={user.role === 'chef' ? "/settings" : "/user-settings"} 
                className="flex items-center gap-2.5 font-bold text-[11px] uppercase tracking-[0.2em] text-text-light hover:text-primary transition-all"
              >
                <Settings size={14} className="opacity-60" />
                Registry
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2.5 font-bold text-[11px] uppercase tracking-[0.2em] text-rose-500 hover:text-rose-600 transition-all bg-transparent border-none cursor-pointer p-0"
              >
                <LogOut size={14} />
                Exit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-10">
              <Link to="/login" className="font-bold text-[11px] uppercase tracking-[0.2em] text-text-light hover:text-primary transition-all">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary px-8 py-3.5 text-[10px] shadow-none">
                Request Access
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
