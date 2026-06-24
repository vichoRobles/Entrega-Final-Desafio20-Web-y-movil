import axios from 'axios';

// Creamos la instancia Axios con la configuración base para nuestra API
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Antes de cada solicitud, este interceptor busca el token en localStorage y lo adjunta al encabezado Authorization
api.interceptors.request.use(
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

// Este interceptor maneja errores de respuesta de manera centralizada, especialmente para casos de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      console.error("🚨 Unauthorized! Token might be expired.");

    } else {
      console.error("🚨 API Error:", error.response?.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;