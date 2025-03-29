import axios from 'axios';
import { Product } from '../types/Product';
import Address from '../types/Address';
import JSEncrypt from 'jsencrypt';

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
  console.log('response:' + response.data);
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
  // Get the public key
  const publicKey = await getPublicKey();
  
  // Encrypt password with RSA public key
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

  try {
    const response = await axios.get(`${BASE_URL}/user/validate-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.valid;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const getAddresses = async (username: string): Promise<Address[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/user/getAddress/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

interface SubmitOrderItem {
  id: number;
  quantity: number;
  size: string;
  color: string;
}

interface SubmitOrderRequest {
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
    product: Product;
  }[];
}

export const placeOrder = async (orderRequest: SubmitOrderRequest): Promise<OrderResponse> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${BASE_URL}/order/submitOrder`,
    orderRequest,
    {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};
