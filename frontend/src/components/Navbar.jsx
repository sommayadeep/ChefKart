import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, User, LogOut, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 py-4">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <ChefHat size={32} />
          <span>ChefKart</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/chefs" className="flex items-center gap-1 font-medium hover:text-primary">
            <Search size={18} />
            Find Chefs
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1 font-medium hover:text-primary">
                <User size={18} />
                Dashboard
              </Link>
              <Link 
                to={user.role === 'chef' ? "/settings" : "/user-settings"} 
                className="flex items-center gap-1 font-medium hover:text-primary"
              >
                <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 font-medium hover:text-primary">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-medium hover:text-primary">Login</Link>
              <Link to="/register" className="btn btn-primary">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
