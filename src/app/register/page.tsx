"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // Hàm tính toán độ mạnh mật khẩu đơn giản (0 - 4)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);
  const strengthColors = [
    "bg-slate-700",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];
  const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập sau khi đăng ký thành công sẽ chuyển sang trang nhập OTP
    window.location.href = "/verify-otp";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 py-12">
      <div className="bg-glow-blue top-[-10%] left-[-10%]"></div>
      <div className="bg-glow-blue bottom-[-10%] right-[-10%] opacity-50"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Create an Account
            </h1>
            <p className="text-slate-400 text-sm">
              Join CIJIBI to manage your restaurant
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Cụm Họ Tên & Username (Chia 2 cột) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="glass-input"
                  required
                />
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors font-medium">
                  @
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  className="glass-input pl-10"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
                size={20}
              />
              <input
                type="email"
                placeholder="name@example.com"
                className="glass-input"
                required
              />
            </div>

            {/* Mật khẩu & Xác nhận mật khẩu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="glass-input pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="glass-input"
                  required
                />
              </div>
            </div>

            {/* Thanh đo độ mạnh mật khẩu */}
            {password.length > 0 && (
              <div className="space-y-1.5 mt-2">
                <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-800">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 transition-all duration-500 ${strength >= level ? strengthColors[strength] : "bg-transparent"}`}
                    ></div>
                  ))}
                </div>
                <p
                  className={`text-xs font-medium text-right ${strength > 0 ? strengthColors[strength].replace("bg-", "text-") : "text-slate-500"}`}
                >
                  {strengthLabels[strength]}
                </p>
              </div>
            )}

            {/* Điều khoản */}
            <label className="flex items-start gap-3 cursor-pointer group mt-4">
              <div className="w-5 h-5 rounded border border-slate-600 group-hover:border-primary flex-shrink-0 mt-0.5 transition-colors flex items-center justify-center">
                <input type="checkbox" className="hidden" required />
              </div>
              <span className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-accent">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:text-accent">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="relative w-full py-3.5 mt-2 rounded-xl bg-primary hover:bg-secondary text-white font-medium shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:-translate-y-px transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Create Account</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          <div className="text-center text-sm text-slate-400 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white hover:text-primary transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
