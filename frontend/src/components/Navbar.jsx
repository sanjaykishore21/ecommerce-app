import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ShoppingCart, User, Shield, LogOut, Package, Store } from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, setIsDrawerOpen } = useCart();

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <div
            className="brand-logo"
            onClick={() => setCurrentView('shop')}
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-logo-icon">
              <ShoppingBag size={20} />
            </div>
            <span>AURORA</span>
          </div>

          {/* Nav Links */}
          <nav>
            <ul className="nav-links">
              <li
                className={`nav-link ${currentView === 'shop' ? 'active' : ''}`}
                onClick={() => setCurrentView('shop')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Store size={16} />
                  <span>Shop</span>
                </div>
              </li>

              {isAuthenticated && (
                <li
                  className={`nav-link ${currentView === 'orders' ? 'active' : ''}`}
                  onClick={() => setCurrentView('orders')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Package size={16} />
                    <span>My Orders</span>
                  </div>
                </li>
              )}

              {isAdmin && (
                <>
                  <li
                    className={`nav-link ${currentView === 'admin-products' ? 'active' : ''}`}
                    onClick={() => setCurrentView('admin-products')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={16} />
                      <span>Manage Products</span>
                      <span className="nav-badge-admin">ADMIN</span>
                    </div>
                  </li>
                  <li
                    className={`nav-link ${currentView === 'admin-orders' ? 'active' : ''}`}
                    onClick={() => setCurrentView('admin-orders')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={16} />
                      <span>Manage Orders</span>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Cart Button */}
            <button
              className="cart-trigger-btn"
              onClick={() => setIsDrawerOpen(true)}
              title="View Cart"
            >
              <ShoppingCart size={20} />
              {cart.totalItems > 0 && (
                <span className="cart-count-badge">{cart.totalItems}</span>
              )}
            </button>

            {/* Auth / Profile */}
            {isAuthenticated ? (
              <div className="user-menu">
                <div
                  className="user-avatar-badge"
                  title={`${user.fullName} (${user.role})`}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {user.fullName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={logout}
                  title="Logout"
                  style={{ marginLeft: 6, padding: '6px 10px' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentView('login')}
                >
                  Sign In
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setCurrentView('register')}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
