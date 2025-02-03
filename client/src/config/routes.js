export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  
  // Auth routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Product routes
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  
  // User routes
  PROFILE: '/profile',
  ORDERS: '/profile/orders',
  ORDER_DETAIL: '/profile/orders/:id',
  
  // Cart routes
  CART: '/cart',
  CHECKOUT: '/cart/checkout',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users'
}; 