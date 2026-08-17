import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("cijibi_token");

      if (token) {
        // Loại bỏ toàn bộ dấu ngoặc kép thừa hoặc khoảng trắng xung quanh
        token = token.replace(/^["'](.+(?=["']$))["']$/, "$1").trim();

        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
