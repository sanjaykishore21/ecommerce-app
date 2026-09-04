import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { Shield, ShoppingBag, DollarSign, Clock, CheckCircle2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

export const AdminOrdersPage = () => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrdersAdmin(selectedStatus);
      setOrders(data || []);
    } catch (err) {
      showToast('Failed to load orders: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateOrderStatusAdmin(orderId, newStatus);
      showToast(`Order #${orderId} status changed to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + Number(o.totalAmount), 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>Admin Order Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor customer orders, verify payments, and manage fulfillment stages.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.88rem' }}>
            <span>Total Orders</span>
            <ShoppingBag size={18} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalOrders}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.88rem' }}>
            <span>Gross Revenue</span>
            <DollarSign size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.88rem' }}>
            <span>Pending Fulfillment</span>
            <Clock size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>{pendingCount}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.88rem' }}>
            <span>Delivered Orders</span>
            <CheckCircle2 size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>{deliveredCount}</div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="category-pills" style={{ marginBottom: 24 }}>
        {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            className={`category-pill ${selectedStatus === st ? 'active' : ''}`}
            onClick={() => setSelectedStatus(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                  Loading order list...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No orders found for this filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedId === order.id;

                return (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td style={{ fontWeight: 800 }}>
                        #{order.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.recipientName || order.userName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.userEmail}</div>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        >
                          <span>{order.items?.length || 0} Item(s)</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                      <td style={{ fontWeight: 800, color: '#818cf8', fontSize: '1.05rem' }}>
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <select
                          className="form-select"
                          style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', display: 'inline-block' }}
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>

                    {/* Sub-row for line items & shipping address */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px 24px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                            {/* Items */}
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>
                                Ordered Products:
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {order.items?.map((item) => (
                                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-main)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <img
                                        src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
                                        alt={item.productName}
                                        style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }}
                                      />
                                      <span>{item.productName} &times; {item.quantity}</span>
                                    </div>
                                    <span style={{ fontWeight: 700 }}>${Number(item.subtotal).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping details */}
                            <div style={{ fontSize: '0.85rem' }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>
                                Delivery Details:
                              </div>
                              <div style={{ background: 'var(--bg-main)', padding: '12px 16px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                                <div style={{ marginBottom: 4 }}><strong>Recipient:</strong> {order.recipientName} ({order.recipientPhone})</div>
                                <div style={{ marginBottom: 4 }}><strong>Address:</strong> {order.shippingAddress}</div>
                                <div style={{ marginBottom: 4 }}><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
