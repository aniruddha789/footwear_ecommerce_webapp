import axios from 'axios';
import { Product } from '../types/Product';
import Address from '../types/Address';
import JSEncrypt from 'jsencrypt';
import { customAlert } from '../utils/alert';
import { signUpWithEmailAndVerify, signInWithGoogle, firebaseSignOut } from './firebaseAuth';
import { auth } from '../services/firebase';

// const BASE_URL = 'http://localhost:8082';
const BASE_URL = 'https://backend.myurbankicks.in:8082';

let cachedPublicKey: string | null = null;

const getPublicKey = async (): Promise<string> => {
  if (cachedPublicKey) return cachedPublicKey;
  
  const response = await axios.get(`${BASE_URL}/auth/public-key`);
  const newPublicKey = response.data.publicKey;
  if (!newPublicKey) {
    throw new Error('Failed to fetch public key from server');
  }
  cachedPublicKey = newPublicKey;
  return newPublicKey;
};

export const getAllProducts = async (page: number, pageSize: number): Promise<{ content: Product[], totalPages: number }> => {
  const response = await axios.get(`${BASE_URL}/product/getProductPaged?page=${page}&size=${pageSize}`);
  return response.data;
};

export const getProductsByType = async (type: string, page: number, pageSize: number): Promise<{ content: Product[], totalPages: number }> => {
  const response = await axios.get(`${BASE_URL}/product/getProductByTypePaged/${type}?page=${page}&size=${pageSize}`);
  return response.data;
};

// export const getProductsByType = async (type: string, page: number, pageSize: number): Promise<{ products: Product[]}> => {
//   const response = await axios.get(`${BASE_URL}/product/getProductByType/${type}`);//?page=${page}&size=${pageSize}`);
//   console.log('response:' + JSON.stringify(response.data));
//   return response.data;
// };

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axios.get(`${BASE_URL}/product/getProduct/${id}`);
  return response.data;
};

interface RegisterResponse {
  status: string;
  message: string;
  code: string;
}

export const registerUser = async (username: string, email: string, password: string, firstname: string, lastname: string): Promise<RegisterResponse> => {
  try {
    // First create Firebase user for email verification
    const firebaseUid = await signUpWithEmailAndVerify(email);
    
    // Then register in your Spring Boot backend
    const response = await axios.post(`${BASE_URL}/user/register`, {
      username,
      email,
      password,
      firstname,
      lastname,
      firebaseUid // Store this to verify email later
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: 'ERROR',
        message: error.message,
        code: '400'
      };
    }
    throw error;
  }
};

interface LoginResponse {
  token: string | null;
  status: string;
  message: string;
  username: string;
  firstname: string;
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const publicKey = await getPublicKey();
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encryptedPassword = encrypt.encrypt(password);
  
  if (!encryptedPassword) {
    throw new Error('Password encryption failed');
  }

  const response = await axios.post(`${BASE_URL}/user/login`, {
    username,
    password: encryptedPassword
  });
  
  if (response.data.token) {
    localStorage.setItem('username', username);
  }
  
  return response.data;
};

export const isTokenValid = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const response = await axios.get(`${BASE_URL}/user/validate-token`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.valid;
};

export const getAddresses = async (username: string): Promise<Address[]> => {
  const response = await axios.get(`${BASE_URL}/user/getAddress/${username}`);
  return response.data;
};

export interface SubmitOrderItem {
  id: number;
  quantity: number;
  size: string;
  color: string;
}

export interface SubmitOrderRequest {
  username: string;
  items: SubmitOrderItem[];
}

export const placeOrder = async (orderRequest: SubmitOrderRequest): Promise<OrdersResponse> => {
  const response = await axios.post(
    `${BASE_URL}/order/submitOrder`,
    orderRequest
  );
  return response.data;
};

export const addItemToCart = async (orderRequest: SubmitOrderRequest): Promise<OrdersResponse> => {
  const response = await axios.post(
    `${BASE_URL}/order/cart/add`,
    orderRequest
  );
  return response.data;
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('firstname');
  cachedPublicKey = null;
  firebaseSignOut();
};

interface CartIconResponse {
  quantity: string;
}

export const getCartIconQuantity = async (username: string): Promise<string> => {
  const response = await axios.get<CartIconResponse>(`${BASE_URL}/order/cartIcon/${username}`);
  return response.data.quantity;
};

export interface CartItem {
  id: number;
  orderID: number;
  productID: number;
  quantity: number;
  size: string;
  color: string;
  product: Product;
}

export interface ShopOrder {
  id: number;
  userId: number;
  orderDate: string;
  orderStatus: string;
  orderItems: CartItem[];
}

export const getCart = async (username: string): Promise<ShopOrder> => {
  const response = await axios.get(`${BASE_URL}/order/cart`, {
    params: { username }
  });
  return response.data;
};

export const updateItemQuantity = async (username: string, itemId: number, newQuantity: number): Promise<ShopOrder> => {
    const response = await axios.post(
      `${BASE_URL}/order/cart/updateQuantity`,
      null,
      {
        params: { username, itemId, newQuantity }
      }
    );
    return response.data;
};

export const removeItemFromCart = async (username: string, itemId: number): Promise<ShopOrder> => {
  const response = await axios.post(
    `${BASE_URL}/order/cart/removeX`,
    null,
    {
      params: { username, itemId }
    }
  );
  return response.data;
};

export const updateItemSize = async (username: string, itemId: number, newSize: string): Promise<ShopOrder> => {
  const response = await axios.post(
    `${BASE_URL}/order/cart/updateSize`,
    null,
    {
      params: { username, itemId, size: newSize }
    }
  );
  return response.data;
};

const handleUnauthorized = () => {
  clearAuthData();
  window.location.href = '/';
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error:', error);
      throw new Error('Network error. Please check your connection.');
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        handleUnauthorized();
        throw new Error('Session expired. Please login again.');

      case 403:
        throw new Error('You do not have permission to perform this action.');

      case 404:
        throw new Error('Resource not found.');

      case 422: {
        const validationMessage = data.message || 'Validation failed.';
        throw new Error(validationMessage);
      }

      case 500:
        throw new Error('Internal server error. Please try again later.');

      default: {
        const errorMessage = data?.message || 'Something went wrong. Please try again.';
        customAlert(errorMessage);
        throw new Error(errorMessage);
      }
    }
  }
);

/** Add auth token to each API Call */ 
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add this new function for Google sign-in
export const loginWithGoogle = async (): Promise<LoginResponse> => {
  try {
    // First authenticate with Firebase
    const googleUser = await signInWithGoogle();
    
    // Get Firebase ID token to verify with backend (more secure approach)
    const idToken = await auth.currentUser?.getIdToken(true);
    
    // Then authenticate with your backend
    const response = await axios.post(`${BASE_URL}/user/google-login`, {
      firebaseUid: googleUser.firebaseUid,
      email: googleUser.email,
      displayName: googleUser.displayName,
      photoURL: googleUser.photoURL,
      idToken // Send this token for verification on backend
    });
    
    // Clear any existing data before setting new data
    clearAuthData();
    
    // Store authentication data in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('firstname', response.data.firstname);
    } else {
      // If backend didn't provide a token, sign out from Firebase
      await firebaseSignOut();
    }
    
    return response.data;
  } catch (error) {
    // Sign out from Firebase on error
    await firebaseSignOut();
    
    if (error instanceof Error) {
      return {
        token: null,
        status: 'ERROR',
        message: error.message,
        username: '',
        firstname: ''
      };
    }
    throw error;
  }
};

// Function to update user password
export interface UpdatePasswordResponse {
  status: string;
  message: string;
}

export const updatePassword = async (username: string, password: string): Promise<UpdatePasswordResponse> => {
  try {
    // Encrypt password with public key
    const publicKey = await getPublicKey();
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedPassword = encrypt.encrypt(password);
    
    if (!encryptedPassword) {
      throw new Error('Password encryption failed');
    }

    const response = await axios.post(`${BASE_URL}/user/updatePassword`, {
      username,
      password: encryptedPassword
    });
    
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: 'ERROR',
        message: error.message
      };
    }
    throw error;
  }
};

// Define the OrderItem interface
export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

// Define the Order interface
export interface Order {
  id: number;
  orderDate: string;
  orderStatus: string;
  orderItems: OrderItem[];
}

// Define the OrdersResponse interface
export interface OrdersResponse {
  id: number;
  orderDate: string;
  orderStatus: string;
  userId: number;
  orders: Order[];
}

// Update the getPlacedOrders function to return OrdersResponse
export const getPlacedOrders = async (username: string): Promise<OrdersResponse> => {
  const response = await axios.get(`${BASE_URL}/order/getOrders/${username}`);
  return response.data; // Ensure this matches the OrdersResponse structure
};

// Add the cancelOrder function
export const cancelOrder = async (orderId: number): Promise<ShopOrder> => {
  const response = await axios.post(`${BASE_URL}/order/${orderId}/cancel`);
  return response.data; // Ensure this matches the ShopOrder structure
};
