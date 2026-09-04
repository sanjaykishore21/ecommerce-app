import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import { CreditCard, Truck, CheckCircle2, ArrowRight, ShieldCheck, ArrowLeft, QrCode } from 'lucide-react';

export const CheckoutPage = ({ onNavigateShop, onNavigateOrders }) => {
  const { cart, clearCart, showToast } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    recipientName: user?.fullName || 'John Doe',
    recipientPhone: user?.phone || '+1 (555) 849-1029',
    shippingAddress: user?.address || '123 Main Street, Apt 4B, New York, NY 10001',
    paymentMethod: 'CREDIT_CARD',
  });

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const subtotal = Number(cart.totalPrice || 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const grandTotal = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recipientName.trim() || !formData.recipientPhone.trim() || !formData.shippingAddress.trim()) {
      showToast('Please fill in all required shipping fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const order = await orderApi.checkout(formData);
      setOrderSuccess(order);
      clearCart();
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to complete checkout', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // If order was successfully placed, show Confirmation Screen
  if (orderSuccess) {
    return (
      <div className="container" style={{ padding: '60px 24px', maxWidth: 700 }}>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle2 size={42} />
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>Thank You For Your Order!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 28 }}>
            Your order <strong>#{orderSuccess.id}</strong> has been received and is being prepared.
          </p>

          <div
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'left',
              marginBottom: 32,
              fontSize: '0.92rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Recipient:</span>
              <strong>{orderSuccess.recipientName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery Address:</span>
              <span style={{ maxWidth: 320, textAlign: 'right' }}>{orderSuccess.shippingAddress}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Payment Method:</span>
              <strong>{orderSuccess.paymentMethod}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: '1.05rem', fontWeight: 800 }}>
              <span>Total Paid:</span>
              <span style={{ color: '#818cf8' }}>${Number(orderSuccess.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button className="btn btn-secondary" onClick={onNavigateShop}>
              Continue Shopping
            </button>
            <button className="btn btn-primary" onClick={onNavigateOrders}>
              Track My Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Truck size={56} style={{ opacity: 0.3, marginBottom: 16 }} />
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, marginBottom: 24 }}>
          Add items to your cart before proceeding to checkout.
        </p>
        <button className="btn btn-primary" onClick={onNavigateShop}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 24 }}
        onClick={onNavigateShop}
      >
        <ArrowLeft size={16} />
        <span>Back to Shop</span>
      </button>

      <h1 style={{ fontSize: '2rem', marginBottom: 32 }}>Checkout &amp; Order Confirmation</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36, alignItems: 'start' }}>
          {/* Left Column: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* 1. Shipping Details Card */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Truck size={20} color="#818cf8" />
                <span>1. Shipping Information</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="recipientName"
                    className="form-input"
                    value={formData.recipientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    name="recipientPhone"
                    className="form-input"
                    value={formData.recipientPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Shipping Address *</label>
                <textarea
                  name="shippingAddress"
                  className="form-textarea"
                  rows={3}
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="Street address, apartment, city, state, postal code"
                  required
                />
              </div>
            </div>

            {/* 2. Payment Method Card */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={20} color="#34d399" />
                <span>2. Payment Method</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'CREDIT_CARD' })}
                  style={{
                    border: formData.paymentMethod === 'CREDIT_CARD' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: formData.paymentMethod === 'CREDIT_CARD' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <CreditCard size={24} style={{ margin: '0 auto 8px', color: formData.paymentMethod === 'CREDIT_CARD' ? '#818cf8' : 'var(--text-secondary)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Credit Card</div>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                  style={{
                    border: formData.paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: formData.paymentMethod === 'UPI' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <QrCode size={24} style={{ margin: '0 auto 8px', color: formData.paymentMethod === 'UPI' ? '#818cf8' : 'var(--text-secondary)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>UPI / QR</div>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'CASH_ON_DELIVERY' })}
                  style={{
                    border: formData.paymentMethod === 'CASH_ON_DELIVERY' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Truck size={24} style={{ margin: '0 auto 8px', color: formData.paymentMethod === 'CASH_ON_DELIVERY' ? '#818cf8' : 'var(--text-secondary)' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cash on Delivery</div>
                </div>
              </div>

              {formData.paymentMethod === 'CREDIT_CARD' && (
                <div style={{ background: 'var(--bg-main)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">CVC / CVV</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              position: 'sticky',
              top: 96,
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: 20 }}>Order Summary</h2>

            {/* Item list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 240, overflowY: 'auto', marginBottom: 20, paddingRight: 4 }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.88rem' }}>
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
                    alt={item.productName}
                    style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.productName}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>Qty: {item.quantity} &times; ${Number(item.unitPrice).toFixed(2)}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>${Number(item.subtotal).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping:</span>
                <span>{shipping === 0 ? <strong style={{ color: '#34d399' }}>FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#818cf8' }}>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 24 }}
              disabled={submitting}
            >
              <span>{submitting ? 'Processing Order...' : 'Place Order Now'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
