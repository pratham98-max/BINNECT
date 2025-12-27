import axios from 'axios';

// Vite uses import.meta.env, NOT process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;