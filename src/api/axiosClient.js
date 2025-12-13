import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "http://127.0.0.1:8000/",
  baseURL : "https://web-production-7d98.up.railway.app",
 
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default axiosClient;
