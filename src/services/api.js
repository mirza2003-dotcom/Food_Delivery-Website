const API_URL = 'http://localhost:5000/api';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Helper for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: (userData) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true,
    }),

  login: (credentials) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    }),

  sendOTP: (data) => 
    apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  verifyOTP: (data) => 
    apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  getMe: () => apiCall('/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return apiCall('/auth/logout', { method: 'POST' });
  },
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/restaurants${queryString ? `?${queryString}` : ''}`, {
      skipAuth: true,
    });
  },

  getById: (id) => apiCall(`/restaurants/${id}`, { skipAuth: true }),

  getNearby: (lat, lng, radius = 5000) => 
    apiCall(`/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {
      skipAuth: true,
    }),

  getCollections: (city = 'Kolkata') => 
    apiCall(`/restaurants/collections?city=${city}`, { skipAuth: true }),

  search: (query, limit = 10) => 
    apiCall(`/restaurants/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`, {
      skipAuth: true,
    }),

  getMenu: (id) => apiCall(`/restaurants/${id}/menu`, { skipAuth: true }),

  create: (data) => 
    apiCall('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) => 
    apiCall(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) => 
    apiCall(`/restaurants/${id}`, { method: 'DELETE' }),

  uploadImage: (id, formData) => 
    apiCall(`/restaurants/${id}/images`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    }),
};

// Order APIs
export const orderAPI = {
  create: (orderData) => 
    apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getMyOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/orders/my-orders${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/orders/${id}`),

  cancel: (id, reason) => 
    apiCall(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),

  addToFavorites: (id) => 
    apiCall(`/orders/${id}/favorite`, { method: 'POST' }),

  updateStatus: (id, status, note) => 
    apiCall(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    }),
};

// Review APIs
export const reviewAPI = {
  create: (reviewData) => 
    apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  getRestaurantReviews: (restaurantId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(
      `/reviews/restaurant/${restaurantId}${queryString ? `?${queryString}` : ''}`,
      { skipAuth: true }
    );
  },

  getById: (id) => apiCall(`/reviews/${id}`, { skipAuth: true }),

  update: (id, data) => 
    apiCall(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) => apiCall(`/reviews/${id}`, { method: 'DELETE' }),

  like: (id) => apiCall(`/reviews/${id}/like`, { method: 'POST' }),

  reply: (id, text) => 
    apiCall(`/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  uploadPhotos: (id, formData) => 
    apiCall(`/reviews/${id}/photos`, {
      method: 'POST',
      body: formData,
      headers: {},
    }),

  getRestaurantPhotos: (restaurantId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(
      `/reviews/restaurant/${restaurantId}/photos${queryString ? `?${queryString}` : ''}`,
      { skipAuth: true }
    );
  },
};

// User APIs
export const userAPI = {
  getProfile: (id) => apiCall(`/users/${id}`, { skipAuth: true }),

  updateProfile: (data) => 
    apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadProfilePicture: (formData) => 
    apiCall('/users/profile/picture', {
      method: 'POST',
      body: formData,
      headers: {},
    }),

  follow: (id) => apiCall(`/users/${id}/follow`, { method: 'POST' }),

  unfollow: (id) => apiCall(`/users/${id}/follow`, { method: 'DELETE' }),

  addAddress: (address) => 
    apiCall('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),

  updateAddress: (addressId, address) => 
    apiCall(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }),

  deleteAddress: (addressId) => 
    apiCall(`/users/addresses/${addressId}`, { method: 'DELETE' }),

  addBookmark: (restaurantId) => 
    apiCall(`/users/bookmarks/${restaurantId}`, { method: 'POST' }),

  removeBookmark: (restaurantId) => 
    apiCall(`/users/bookmarks/${restaurantId}`, { method: 'DELETE' }),

  getUserReviews: (id) => apiCall(`/users/${id}/reviews`, { skipAuth: true }),

  getUserPhotos: (id) => apiCall(`/users/${id}/photos`, { skipAuth: true }),

  addRecentlyViewed: (restaurantId) => 
    apiCall(`/users/recently-viewed/${restaurantId}`, { method: 'POST' }),
};

// Booking APIs
export const bookingAPI = {
  create: (bookingData) => 
    apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getMyBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bookings/my-bookings${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/bookings/${id}`),

  cancel: (id, reason) => 
    apiCall(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),

  updateStatus: (id, status) => 
    apiCall(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

export default {
  auth: authAPI,
  restaurant: restaurantAPI,
  order: orderAPI,
  review: reviewAPI,
  user: userAPI,
  booking: bookingAPI,
};
