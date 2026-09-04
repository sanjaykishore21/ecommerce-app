import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Lock, Mail, Shield, User, ArrowRight } from 'lucide-react';

export const LoginPage = ({ onNavigateRegister, onLoginSuccess }) => {
  const { login, loading } = useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
      showToast('Logged in successfully!', 'success');
      onLoginSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password');
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@ecommerce.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  const fillUserCredentials = () => {
    setEmail('user@ecommerce.com');
    setPassword('user123');
    setErrorMessage('');
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 480 }}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 36,
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Lock size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Sign in to manage orders, cart, and account settings.
          </p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div style={{ marginBottom: 24, padding: 14, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>
            ⚡ 1-Click Demo Accounts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fillAdminCredentials}
              style={{ fontSize: '0.8rem', padding: '6px 8px' }}
            >
              <Shield size={14} color="#ec4899" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fillUserCredentials}
              style={{ fontSize: '0.8rem', padding: '6px 8px' }}
            >
              <User size={14} color="#818cf8" />
              <span>User Demo</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.88rem', marginBottom: 20 }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="search-input-wrapper">
              <Mail size={18} className="search-icon" />
              <input
                type="email"
                className="search-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="search-input-wrapper">
              <Lock size={18} className="search-icon" />
              <input
                type="password"
                className="search-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <span
            onClick={onNavigateRegister}
            style={{ color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};
