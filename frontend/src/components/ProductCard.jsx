import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, loading } = useCart();

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return <span className="stock-badge out-of-stock">Out of Stock</span>;
    } else if (stock <= 10) {
      return <span className="stock-badge low-stock">Only {stock} Left</span>;
    }
    return <span className="stock-badge in-stock">In Stock ({stock})</span>;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <span className="product-category-tag">{product.category}</span>
        {getStockBadge(product.stock)}
      </div>

      <div className="product-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        <p className="product-description" title={product.description}>
          {product.description || 'No description available.'}
        </p>

        <div className="product-footer">
          <div className="product-price">
            ${Number(product.price).toFixed(2)}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onQuickView(product)}
              title="Quick View"
              style={{ padding: '8px 10px' }}
            >
              <Eye size={16} />
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0 || loading}
              title={product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingCart size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
