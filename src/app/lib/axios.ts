import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

// ĐOẠN NÀY RẤT QUAN TRỌNG: Tự động gắn Token vào mọi Request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("cijibi_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
