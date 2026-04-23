import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://chefkart-8rif.onrender.com/api' : '/api'),
  withCredentials: true
});

export default api;
