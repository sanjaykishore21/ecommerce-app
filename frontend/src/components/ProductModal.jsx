import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingCart, Check, AlertTriangle } from 'lucide-react';

export const ProductModal = ({ product, onClose }) => {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      onClose();
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="product-category-tag" style={{ position: 'static' }}>
            {product.category}
          </span>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Product Image */}
          <div
            style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#0f1422',
              maxHeight: 320,
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 12 }}>{product.name}</h2>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#818cf8', marginBottom: 14 }}>
              ${Number(product.price).toFixed(2)}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 20, lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Stock status */}
            <div style={{ marginBottom: 20 }}>
              {isOutOfStock ? (
                <div style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', fontWeight: 600 }}>
                  <AlertTriangle size={18} /> Out of Stock
                </div>
              ) : (
                <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', fontWeight: 600 }}>
                  <Check size={18} /> In Stock ({product.stock} units available)
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            {!isOutOfStock && (
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Quantity:</span>
                  <div className="cart-qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 8px', fontWeight: 600 }}>{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Subtotal: ${(Number(product.price) * quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
