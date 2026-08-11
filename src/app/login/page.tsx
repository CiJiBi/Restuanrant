"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Chặn hành vi reload mặc định của form
    setIsLoading(true);
    setError("");

    try {
      // Gọi API đăng nhập xuống NestJS
      const response = await api.post("/auth/login", { email, password });

      const payload = response.data;

      // Thuật toán đào Token qua 3 lớp vỏ bảo vệ của NestJS
      let token = "";
      if (payload?.data?.data?.access_token) {
        token = payload.data.data.access_token; // Bọc 2 lớp
      } else if (payload?.data?.access_token) {
        token = payload.data.access_token; // Bọc 1 lớp
      } else if (payload?.access_token) {
        token = payload.access_token; // Không bọc
      }

      if (!token) {
        throw new Error("Không lấy được thẻ từ hệ thống!");
      }

      // Cất "thẻ từ" thật vào túi (localStorage)
      localStorage.setItem("cijibi_token", token);

      // Chuyển hướng người dùng sang trang Quản trị
      router.push("/admin");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Đăng nhập thất bại. Kiểm tra lại thông tin!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/50 backdrop-blur-xl p-8 shadow-2xl border border-white/60">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-800">
          Cijibi Admin
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              placeholder="admin@cijibi.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition disabled:bg-gray-400"
          >
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
