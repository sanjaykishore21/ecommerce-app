// API Service Layer for E-Commerce Web Application
// Automatically cleans and normalizes API URLs to prevent 405 / 404 routing errors

let rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
// Strip any trailing slashes
rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');

// If the URL is an external domain (e.g. https://xyz.onrender.com) and doesn't end with /api, append /api
if (rawBaseUrl.startsWith('http') && !rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}

const API_BASE_URL = rawBaseUrl;

// Helper to make fetch requests with auth headers and robust response parsing
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (response.status === 405) {
        throw new Error("HTTP 405 Method Not Allowed: Please ensure VITE_API_BASE_URL in Vercel points to your Render backend (e.g. https://your-backend.onrender.com/api)");
      }
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: Failed to reach backend API`);
      }
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || (data.data ? JSON.stringify(data.data) : 'Request failed');
      throw new Error(errorMsg);
    }

    return data.data !== undefined ? data.data : data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
    throw err;
  }
}

// 1. Auth Endpoints
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () => request('/auth/me'),
};

// 2. Products Endpoints
export const productApi = {
  getAll: (category, search) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/products${queryString}`);
  },

  getById: (id) => request(`/products/${id}`),

  getCategories: () => request('/products/categories'),

  create: (productData) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  delete: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// 3. Cart Endpoints
export const cartApi = {
  getCart: () => request('/cart'),

  addItem: (productId, quantity = 1) =>
    request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  updateQuantity: (cartItemId, quantity) =>
    request(`/cart/items/${cartItemId}?quantity=${quantity}`, {
      method: 'PUT',
    }),

  removeItem: (cartItemId) =>
    request(`/cart/items/${cartItemId}`, {
      method: 'DELETE',
    }),

  clearCart: () =>
    request('/cart/clear', {
      method: 'DELETE',
    }),
};

// 4. Orders Endpoints
export const orderApi = {
  checkout: (checkoutData) =>
    request('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),

  getMyOrders: () => request('/orders/my-orders'),

  getOrderById: (id) => request(`/orders/${id}`),

  getAllOrdersAdmin: (status) => {
    const queryString = status && status !== 'ALL' ? `?status=${status}` : '';
    return request(`/orders/admin/all${queryString}`);
  },

  updateOrderStatusAdmin: (id, status) =>
    request(`/orders/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};
