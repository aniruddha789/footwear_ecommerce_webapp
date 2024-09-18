import axios from 'axios';
import { Product } from '../types/Product';

// const BASE_URL = 'http://localhost:8082';
//const BASE_URL = 'https://backend.myurbankicks.in:8082';
const BASE_URL = '/api';


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
  const response = await axios.post(`${BASE_URL}/user/login`, {
    username,
    password
  });
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