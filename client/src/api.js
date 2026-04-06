import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur : rejette les 401 (la redirection est gérée par le router guard)
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export default api;
