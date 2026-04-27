import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('sommayadeepsaha@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleBlocked, setGoogleBlocked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.user?.role !== 'admin') {
        setError('This account is not admin.');
        return;
      }
      onLogin(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    if (googleBlocked) {
      setError('Google sign-in is currently blocked for this origin. Use email/password login, then retry Google later.');
      return;
    }

    if (!credentialResponse?.credential) {
      setError('Google did not return a credential token. Verify Authorized JavaScript origins include: ' + window.location.origin);
      return;
    }

    try {
      const res = await api.post('/auth/google', { tokenId: credentialResponse.credential, role: 'admin' });
      if (res.data?.user?.role !== 'admin') {
        setError('This Google account is not admin.');
        return;
      }
      onLogin(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. If your browser shows "origin is not allowed", add this URL to Google OAuth Authorized JavaScript origins: ' + window.location.origin);
    }
  };

  return (
    <div className="screen center login-screen">
      <div className="card auth-card">
        <p className="kicker">Private Reserve Control</p>
        <h1 className="admin-title">Admin Portal</h1>
        <p className="muted">Separate control center for chef and customer accounts.</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="stack">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Sign In To Admin</button>
        </form>
        {!googleBlocked && <div className="divider">OR</div>}
        {!googleBlocked ? (
          <div className="google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setGoogleBlocked(true);
                setError('Google login is blocked for this origin by Google OAuth settings. Use email/password now. Ensure this origin is added in Google Console: ' + window.location.origin);
              }}
              shape="pill"
            />
          </div>
        ) : (
          <p className="muted" style={{ marginTop: 10 }}>
            Google sign-in is temporarily disabled for this browser origin. Continue with email/password admin login.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
