import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { Package, Calendar, MapPin, CreditCard, ChevronDown, ChevronUp, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrdersPage = ({ onNavigateShop }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data || []);
      if (data && data.length > 0) {
        setExpandedOrderId(data[0].id); // expand most recent order by default
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Helper for timeline step active state
  const getStepStatus = (orderStatus, step) => {
    const sequence = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    if (orderStatus === 'CANCELLED') return 'cancelled';
    const currentIndex = sequence.indexOf(orderStatus);
    const stepIndex = sequence.indexOf(step);
    if (currentIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 960 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>My Orders &amp; Tracking</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Review your order history and live shipping updates.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onNavigateShop}>
          <ShoppingBag size={16} />
          <span>Continue Shopping</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Package size={56} style={{ opacity: 0.3, marginBottom: 16 }} />
          <h2>No orders yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, marginBottom: 24 }}>
            You haven't placed any orders yet. Check out our latest products!
          </p>
          <button className="btn btn-primary" onClick={onNavigateShop}>
            <span>Explore Catalog</span>
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Order Card Header */}
                <div
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: 'rgba(15, 23, 42, 0.4)',
                    borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                  onClick={() => toggleExpand(order.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                      Order #{order.id}
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                      <Calendar size={16} />
                      <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}</span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#818cf8' }}>
                      ${Number(order.totalAmount).toFixed(2)}
                    </div>

                    <button
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '24px' }}>
                    {/* Visual Tracking Timeline */}
                    {order.status !== 'CANCELLED' ? (
                      <div style={{ marginBottom: 32, padding: '16px 20px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 16 }}>
                          Delivery Progress Tracker
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                          {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
                            const statusState = getStepStatus(order.status, step);
                            const isDone = statusState === 'completed';

                            return (
                              <div
                                key={step}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  position: 'relative',
                                  zIndex: 2,
                                  flex: 1,
                                }}
                              >
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 'var(--radius-full)',
                                    background: isDone ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' : 'var(--bg-subtle)',
                                    color: isDone ? '#fff' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    boxShadow: isDone ? '0 0 12px rgba(79, 70, 229, 0.5)' : 'none',
                                    marginBottom: 8,
                                  }}
                                >
                                  {idx + 1}
                                </div>
                                <span
                                  style={{
                                    fontSize: '0.8rem',
                                    fontWeight: isDone ? 700 : 500,
                                    color: isDone ? 'var(--text-primary)' : 'var(--text-muted)',
                                  }}
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginBottom: 24, padding: 14, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.9rem' }}>
                        This order was cancelled.
                      </div>
                    )}

                    {/* Items List */}
                    <div style={{ marginBottom: 24 }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: 14, color: 'var(--text-secondary)' }}>
                        Items in this Order ({order.items?.length || 0})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'var(--bg-main)',
                              padding: '12px 16px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <img
                                src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
                                alt={item.productName}
                                style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 600 }}>{item.productName}</div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                  ${Number(item.unitPrice).toFixed(2)} &times; {item.quantity} unit{item.quantity > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                              ${Number(item.subtotal).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Payment Meta */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <MapPin size={18} color="#818cf8" style={{ marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Shipping To</div>
                          <div style={{ color: 'var(--text-secondary)' }}>{order.recipientName} ({order.recipientPhone})</div>
                          <div style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <CreditCard size={18} color="#34d399" style={{ marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Payment Method</div>
                          <div style={{ color: 'var(--text-secondary)' }}>{order.paymentMethod}</div>
                          <div style={{ color: '#34d399', fontWeight: 600 }}>Status: {order.paymentStatus}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
