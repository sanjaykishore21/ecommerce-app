import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserPlus, User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

export const RegisterPage = ({ onNavigateLogin, onRegisterSuccess }) => {
  const { register, loading } = useAuth();
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'ROLE_USER',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      await register(formData);
      showToast('Account registered successfully!', 'success');
      onRegisterSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 520 }}>
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
              background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            }}
          >
            <UserPlus size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 6 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Join Aurora today for seamless shopping and order management.
          </p>
        </div>

        {errorMessage && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.88rem', marginBottom: 20 }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="search-input-wrapper">
              <User size={18} className="search-icon" />
              <input
                type="text"
                name="fullName"
                className="search-input"
                placeholder="Jane Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="search-input-wrapper">
              <Mail size={18} className="search-icon" />
              <input
                type="email"
                name="email"
                className="search-input"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="search-input-wrapper">
              <Lock size={18} className="search-icon" />
              <input
                type="password"
                name="password"
                className="search-input"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="search-input-wrapper">
                <Phone size={18} className="search-icon" />
                <input
                  type="text"
                  name="phone"
                  className="search-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ROLE_USER">Customer (User)</option>
                <option value="ROLE_ADMIN">Store Administrator (Admin)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Default Shipping Address</label>
            <div className="search-input-wrapper">
              <MapPin size={18} className="search-icon" />
              <input
                type="text"
                name="address"
                className="search-input"
                placeholder="Street, City, State, Zip"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <span
            onClick={onNavigateLogin}
            style={{ color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};
