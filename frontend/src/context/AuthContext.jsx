import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

const AuthContext = createContext();
const socket = io(import.meta.env.VITE_BACKEND_URL || '/', { withCredentials: true, autoConnect: false });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('join', user.id);
    } else {
      socket.disconnect();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser({ ...res.data, id: res.data._id });
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser({ ...res.data.user, id: res.data.user.id || res.data.user._id });
      return res.data;
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      throw err;
    }
  };

  const googleLogin = async (tokenId, role, lat, lng) => {
    try {
      console.log("GOOGLE LOGIN START:", { role, lat, lng });
      const res = await api.post('/auth/google', { tokenId, role, lat, lng });
      console.log("GOOGLE LOGIN SUCCESS:", res.data);
      setUser({ ...res.data.user, id: res.data.user.id || res.data.user._id });
      return res.data;
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      setUser({ ...res.data.user, id: res.data.user.id || res.data.user._id });
      return res.data;
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
