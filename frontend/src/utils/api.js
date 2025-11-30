import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

console.log("API Base URL:", baseURL); // TEMP: to confirm the build has correct value

const api = axios.create({
  baseURL: baseURL + "/api"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
