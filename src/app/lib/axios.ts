import axios from "axios";

// Thiết lập mặc định để kết nối với NestJS
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  timeout: 10000,
});

// Bạn có thể mở rộng file này ở Giai đoạn Bảo mật (gắn JWT Token tự động vào header)
export default api;
