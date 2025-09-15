import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});


axiosInstance.interceptors.request.use(
  (config) => {
  
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized access - user needs to login");
    }
    return Promise.reject(error);
  }
);