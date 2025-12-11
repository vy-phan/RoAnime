import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: apiBaseUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});


apiClient.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;