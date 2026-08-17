import axios from "axios";

// Khởi tạo instance kết nối với Backend
const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// THÊM INTERCEPTOR: Tự động đính kèm Token vào MỌI request gửi đi
api.interceptors.request.use(
  (config) => {
    // Chỉ gọi localStorage khi code đang chạy trên trình duyệt (tránh lỗi Next.js SSR)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("cijibi_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Nhét "thẻ VIP" vào đây
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
