import axios from 'axios';

const getApiUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:3000';
  }
  
  const backendUrl = import.meta.env.VITE_API_URL;
  if (backendUrl) {
    return backendUrl;
  }
  
  return window.location.origin;
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
