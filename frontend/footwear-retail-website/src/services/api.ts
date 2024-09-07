import axios from 'axios';
import { Product } from '../types/Product';

const BASE_URL = 'http://localhost:8082';

export const getAllProducts = async (page: number, pageSize: number): Promise<{ products: Product[], totalPages: number }> => {
  const response = await axios.get(`${BASE_URL}/product/getProduct?page=${page}&size=${pageSize}`);
  return response.data;
};

// export const getProductsByType = async (type: string, page: number, pageSize: number): Promise<{ products: Product[], totalPages: number }> => {
//   const response = await axios.get(`${BASE_URL}/product/getProductByType/${type}`);//?page=${page}&size=${pageSize}`);
//   console.log('response:' + response.data);
//   return response.data;
// };

export const getProductsByType = async (type: string, page: number, pageSize: number): Promise<{ products: Product[]}> => {
  const response = await axios.get(`${BASE_URL}/product/getProductByType/${type}`);//?page=${page}&size=${pageSize}`);
  console.log('response:' + JSON.stringify(response.data));
  return response.data;
};