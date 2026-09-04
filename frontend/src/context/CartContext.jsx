import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch cart from backend if authenticated
  const refreshCart = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await cartApi.getCart();
      setCart(data || { items: [], totalItems: 0, totalPrice: 0 });
    } catch (err) {
      console.warn('Could not refresh cart from server:', err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please log in to add items to your cart', 'error');
      return false;
    }

    setLoading(true);
    try {
      const updatedCart = await cartApi.addItem(product.id, quantity);
      setCart(updatedCart);
      showToast(`Added "${product.name}" to cart!`, 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to add item to cart', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!isAuthenticated) return;
    try {
      const updatedCart = await cartApi.updateQuantity(cartItemId, newQuantity);
      setCart(updatedCart);
    } catch (err) {
      showToast(err.message || 'Could not update quantity', 'error');
    }
  };

  const removeItem = async (cartItemId) => {
    if (!isAuthenticated) return;
    try {
      const updatedCart = await cartApi.removeItem(cartItemId);
      setCart(updatedCart);
      showToast('Item removed from cart', 'info');
    } catch (err) {
      showToast(err.message || 'Could not remove item', 'error');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      await cartApi.clearCart();
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        setIsDrawerOpen,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
