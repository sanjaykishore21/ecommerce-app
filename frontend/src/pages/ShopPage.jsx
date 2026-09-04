import React, { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { Search, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality.',
    price: 349.99,
    stock: 25,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'Smartwatch with always-on retina display, blood oxygen and ECG apps, S9 chip, and water resistance.',
    price: 399.00,
    stock: 18,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Ultra-fast tactile mechanical switches, customizable per-key RGB backlighting, and aluminum frame.',
    price: 129.50,
    stock: 40,
    category: 'Gaming',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Minimalist Leather Backpack',
    description: 'Crafted from full-grain water-resistant leather with a dedicated 15.6-inch laptop compartment.',
    price: 89.99,
    stock: 15,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Smart 4K Ultra HD Action Camera',
    description: 'Captures smooth 4K video at 60fps with advanced stabilization, waterproof casing, and dual screens.',
    price: 219.00,
    stock: 12,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Ergonomic Desk Chair Pro',
    description: 'Breathable mesh back with adjustable lumbar support, 3D armrests, and dynamic tilt-lock mechanism.',
    price: 279.99,
    stock: 8,
    category: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-7387295d23f7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Premium Ceramic Pour-Over Dripper',
    description: 'Handcrafted ceramic coffee dripper designed for optimal extraction flow and rich artisanal brewing.',
    price: 34.50,
    stock: 50,
    category: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    name: 'Ultra-Slim Portable Power Bank 20000mAh',
    description: 'High-capacity fast-charging power bank equipped with 65W Power Delivery USB-C port.',
    price: 49.99,
    stock: 65,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 9,
    name: 'Polarized Sunglasses Classic Wayfarer',
    description: '100% UV400 protection with lightweight acetate frame, anti-glare scratch-resistant lenses.',
    price: 65.00,
    stock: 30,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 10,
    name: 'Stainless Steel Insulated Water Bottle',
    description: 'Double-wall vacuum insulation keeps cold beverages ice cold for 24 hours or hot drinks steaming for 12 hours.',
    price: 24.99,
    stock: 75,
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
  }
];

export const ShopPage = () => {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState(['All', 'Electronics', 'Wearables', 'Gaming', 'Accessories', 'Furniture', 'Kitchen', 'Lifestyle']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll(selectedCategory, searchQuery);
      if (data && data.length > 0) {
        setProducts(data);
      } else if (searchQuery || (selectedCategory && selectedCategory !== 'All')) {
        // Filter locally if backend returned empty search
        let filtered = [...FALLBACK_PRODUCTS];
        if (selectedCategory && selectedCategory !== 'All') {
          filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (searchQuery) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setProducts(filtered);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err) {
      // If backend is offline or loading, use fallback
      let filtered = [...FALLBACK_PRODUCTS];
      if (selectedCategory && selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
      }
      if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await productApi.getCategories();
      if (cats && cats.length > 0) {
        setCategories(['All', ...cats]);
      }
    } catch (err) {
      // Keep default categories
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name-az') return a.name.localeCompare(b.name);
    return b.id - a.id;
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
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Updating catalog...</div>
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
