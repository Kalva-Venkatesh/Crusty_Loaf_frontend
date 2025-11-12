// This is the base URL of your backend server
const API_URL = 'http://localhost:5000/api';

/**
 * A helper function for making authenticated API calls.
 * It automatically adds the 'Authorization' header if a token exists.
 */
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
      return null;
  }
  
  return response.json();
};

// --- REAL API FUNCTIONS ---
export const api = {
  // AUTH
  login: async (email, password) => {
    return fetchWithAuth(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  signup: async (name, email, password) => {
    return fetchWithAuth(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // PRODUCTS
  getProducts: async () => {
    return fetchWithAuth(`${API_URL}/products`);
  },

  getProductById: async (id) => {
    return fetchWithAuth(`${API_URL}/products/${id}`);
  },

  // CART (Protected)
  getCart: async () => {
    return fetchWithAuth(`${API_URL}/user/cart`);
  },

  updateCart: async (cart) => {
    const backendCart = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
    }));
    return fetchWithAuth(`${API_URL}/user/cart`, {
      method: 'PUT',
      body: JSON.stringify({ cart: backendCart }),
    });
  },

  // ADDRESS (Protected)
  updateAddresses: async (addresses) => {
    const finalAddresses = addresses.map(({ id, ...rest }) => ({
      ...rest,
      ...(id.startsWith('new_') ? {} : { _id: id }) 
    }));
    
    return fetchWithAuth(`${API_URL}/user/addresses`, {
        method: 'PUT',
        body: JSON.stringify({ addresses: finalAddresses })
    });
  },

  // ORDERS (Protected)
  placeOrder: async (cart, address, deliveryNotes) => {
      const backendCart = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
    return fetchWithAuth(`${API_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify({ cart: backendCart, address, deliveryNotes }),
    });
  },
  
  getOrderHistory: async () => {
    return fetchWithAuth(`${API_URL}/orders/myorders`);
  },
  
  // ADMIN (Protected)
  getAllOrders: async () => {
    return fetchWithAuth(`${API_URL}/admin/orders`);
  },
  
  updateOrderStatus: async (orderId, status) => {
    return fetchWithAuth(`${API_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};