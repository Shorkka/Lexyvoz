import { SecureStorageAdapter } from '@/helper/adapters/secure-storage.adapter';
import axios from 'axios'
import { Platform } from 'react-native';
// TODOs conectar mediante envs vars, Android e IOS

const STAGE = process.env.EXPO_PUBLIC_STAGE || 'dev';

export const API_URL =
  STAGE === 'prod'
    ? process.env.EXPO_PUBLIC_API_URL
    : Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_API_URL_IOS
    : process.env.EXPO_PUBLIC_API_URL_ANDROID;

const productsApi = axios.create({
  baseURL: API_URL,
});

// TODOS interceptores

productsApi.interceptors.request.use( async (config) => {
  const token = await SecureStorageAdapter.getItem('token');
  console.log('Token en interceptor:', token);
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config
})

export { productsApi};