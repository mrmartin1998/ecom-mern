const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token'
  },

  // User endpoints
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    changePassword: '/users/change-password'
  },

  // Product endpoints
  products: {
    list: '/products',
    detail: (id) => `/products/${id}`,
    create: '/products',
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
    bulk: '/products/bulk'
  },

  // Cart endpoints
  cart: {
    get: '/carts',
    addItem: '/carts/items',
    updateItem: (itemId) => `/carts/items/${itemId}`,
    removeItem: (itemId) => `/carts/items/${itemId}`,
    clear: '/carts'
  },

  // Order endpoints
  orders: {
    create: '/orders',
    list: '/orders',
    detail: (id) => `/orders/${id}`,
    updateStatus: (id) => `/orders/${id}/status`,
    cancel: (id) => `/orders/${id}/cancel`
  },

  // Payment endpoints
  payments: {
    createIntent: (orderId) => `/payments/create-payment-intent/${orderId}`
  }
};

export default API_ENDPOINTS; 