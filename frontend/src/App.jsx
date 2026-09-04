import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';

import { ShopPage } from './pages/ShopPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('shop');
  const { isAuthenticated, isAdmin } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case 'shop':
        return <ShopPage />;

      case 'checkout':
        if (!isAuthenticated) {
          return (
            <LoginPage
              onNavigateRegister={() => setCurrentView('register')}
              onLoginSuccess={() => setCurrentView('checkout')}
            />
          );
        }
        return (
          <CheckoutPage
            onNavigateShop={() => setCurrentView('shop')}
            onNavigateOrders={() => setCurrentView('orders')}
          />
        );

      case 'orders':
        if (!isAuthenticated) {
          return (
            <LoginPage
              onNavigateRegister={() => setCurrentView('register')}
              onLoginSuccess={() => setCurrentView('orders')}
            />
          );
        }
        return <OrdersPage onNavigateShop={() => setCurrentView('shop')} />;

      case 'admin-products':
        if (!isAdmin) {
          return <ShopPage />;
        }
        return <AdminProductsPage />;

      case 'admin-orders':
        if (!isAdmin) {
          return <ShopPage />;
        }
        return <AdminOrdersPage />;

      case 'login':
        return (
          <LoginPage
            onNavigateRegister={() => setCurrentView('register')}
            onLoginSuccess={() => setCurrentView('shop')}
          />
        );

      case 'register':
        return (
          <RegisterPage
            onNavigateLogin={() => setCurrentView('login')}
            onRegisterSuccess={() => setCurrentView('shop')}
          />
        );

      default:
        return <ShopPage />;
    }
  };

  return (
    <div className="app-container">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="main-content">
        {renderView()}
      </main>

      <CartDrawer
        onNavigateCheckout={() => setCurrentView('checkout')}
        onNavigateShop={() => setCurrentView('shop')}
      />

      <Toast />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
