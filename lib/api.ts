// /lib/api.ts — Centralized Axios with Auth

import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';

export const api = axios.create({
  baseURL: '', // Relative routing handled by Next.js
});

api.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔐 Session expired. Logging out...');
      useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const fetcher = (url: string) => api.get(url).then(res => res.data);
