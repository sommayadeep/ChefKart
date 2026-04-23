import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chefs from './pages/Chefs';
import ChefProfile from './pages/ChefProfile';
import ChefSettings from './pages/ChefSettings';
import UserSettings from './pages/UserSettings';
import Dashboard from './pages/Dashboard';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Notification />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chefs" element={<Chefs />} />
              <Route path="/chefs/:id" element={<ChefProfile />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/user-settings" 
                element={
                  <PrivateRoute>
                    <UserSettings />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <ChefSettings />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
