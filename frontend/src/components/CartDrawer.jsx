import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer = ({ onNavigateCheckout, onNavigateShop }) => {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 100;
  const subtotal = Number(cart.totalPrice || 0);
  const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    onNavigateCheckout();
  };

  const handleStartShopping = () => {
    setIsDrawerOpen(false);
    onNavigateShop();
  };

  return (
    <>
      <div className="cart-drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
              Shopping Cart ({cart.totalItems || 0})
            </h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart.items && cart.items.length > 0 && (
          <div style={{ padding: '12px 24px', background: 'rgba(99, 102, 241, 0.08)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
              <span>
                {freeShippingLeft === 0 ? (
                  <strong style={{ color: '#34d399' }}>🎉 You unlocked Free Delivery!</strong>
                ) : (
                  <span>Add <strong>${freeShippingLeft.toFixed(2)}</strong> more for Free Shipping</span>
                )}
              </span>
              <span>{Math.round(freeShippingProgress)}%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${freeShippingProgress}%`,
                  height: '100%',
                  background: freeShippingLeft === 0 ? '#10b981' : 'linear-gradient(90deg, #6366f1, #06b6d4)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Cart items list */}
        <div className="cart-drawer-items">
          {!cart.items || cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <ShoppingBag size={54} style={{ opacity: 0.3, marginBottom: 16 }} />
              <h4>Your cart is empty</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>
                Explore our catalog and find something you love!
              </p>
              <button className="btn btn-primary btn-sm" onClick={handleStartShopping}>
                Start Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
                  alt={item.productName}
                  className="cart-item-thumb"
                />
                <div className="cart-item-details">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <span className="cart-item-title">{item.productName}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div className="cart-qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      ${Number(item.subtotal).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cart.items && cart.items.length > 0 && (
          <div className="cart-drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '1.15rem', fontWeight: 800 }}>
              <span>Total:</span>
              <span style={{ color: '#818cf8' }}>${subtotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: 10 }}
              onClick={handleCheckoutClick}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};
