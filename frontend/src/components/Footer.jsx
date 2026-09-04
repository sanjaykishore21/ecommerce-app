import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'auto',
        padding: '48px 0 24px',
      }}
    >
      <div className="container">
        {/* Value props banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            paddingBottom: 36,
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Fast Global Delivery</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Free shipping on orders over $50</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Secure Payment</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>256-bit encrypted checkout</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RefreshCw size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>30-Day Free Returns</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Hassle-free refund policy</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={18} color="#818cf8" />
            <span>&copy; 2026 AURORA E-Commerce Store. Built with Spring Boot &amp; MySQL.</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>REST API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
