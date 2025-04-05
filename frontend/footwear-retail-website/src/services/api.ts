import axios from 'axios';
import { Product } from '../types/Product';
import Address from '../types/Address';
import JSEncrypt from 'jsencrypt';
import { customAlert } from '../utils/alert';

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
  const response = await axios.post(`${BASE_URL}/user/register`, {
    username,
    email,
    password,
    firstname,
    lastname
  });
  return response.data;
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

interface OrderResponse {
  id: number;
  userId: number;
  orderDate: string;
  orderStatus: string;
  orderItems: {
    id: number;
    orderID: number;
    productID: number;
    quantity: number;
    size: string;
    color: string;
  }[];
}

export const placeOrder = async (orderRequest: SubmitOrderRequest): Promise<OrderResponse> => {
  const response = await axios.post(
    `${BASE_URL}/order/submitOrder`,
    orderRequest
  );
  return response.data;
};

export const addItemToCart = async (orderRequest: SubmitOrderRequest): Promise<OrderResponse> => {
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
  cachedPublicKey = null; // Also clear the cached public key
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
