import React, { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';

export const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load products & categories
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll(selectedCategory, searchQuery);
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await productApi.getCategories();
      if (cats && cats.length > 0) {
        setCategories(['All', ...cats]);
      } else {
        setCategories(['All', 'Electronics', 'Wearables', 'Gaming', 'Accessories', 'Furniture', 'Kitchen', 'Lifestyle']);
      }
    } catch (err) {
      setCategories(['All', 'Electronics', 'Wearables', 'Gaming', 'Accessories', 'Furniture', 'Kitchen', 'Lifestyle']);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name-az') return a.name.localeCompare(b.name);
    return b.id - a.id; // default newest / featured
  });

  return (
    <div className="container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>New Collection 2026</span>
        </div>
        <h1 className="hero-title">
          Elevate Your Lifestyle with Next-Gen Essentials
        </h1>
        <p className="hero-subtitle">
          Explore curated electronics, premium accessories, ergonomic gear, and modern home goods crafted for performance.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="search-sort-group">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products by name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading catalog...</div>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <SlidersHorizontal size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <h3>No products found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Try adjusting your search criteria or selecting another category.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 16 }}
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
