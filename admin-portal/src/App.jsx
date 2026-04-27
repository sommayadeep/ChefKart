import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import api from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser({ ...res.data, id: res.data._id });
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error('Session check failed:', err.response?.data || err.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return <div className="screen center">Checking admin session...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user?.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={user?.role === 'admin' ? <Navigate to="/dashboard" /> : <Login onLogin={setUser} />}
      />
      <Route
        path="/dashboard"
        element={user?.role === 'admin' ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
