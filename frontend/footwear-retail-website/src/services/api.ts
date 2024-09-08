import axios from 'axios';
import { Product } from '../types/Product';

const BASE_URL = 'http://localhost:8082';

export const getAllProducts = async (page: number, pageSize: number): Promise<{ products: Product[], totalPages: number }> => {
  const response = await axios.get(`${BASE_URL}/product/getProductPaged?page=${page}&size=${pageSize}`);
  return response.data.content;
};

export const getProductsByType = async (type: string, page: number, pageSize: number): Promise<{ products: Product[], totalPages: number }> => {
  const response = await axios.get(`${BASE_URL}/product/getProductByTypePaged/${type}?page=${page}&size=${pageSize}`);
  console.log('response:' + response.data);
  return response.data.content;
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

export const registerUser = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
  const response = await axios.post(`${BASE_URL}/user/register`, {
    username,
    email,
    password
  });
  return response.data;
};