"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Đếm ngược 60s
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    // Chỉ nhận số
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-next: Tự động nhảy sang ô tiếp theo nếu nhập xong
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Tự động quay lại ô trước nếu bấm Backspace ở ô trống
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return; // Kiểm tra phải là chuỗi số

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus vào ô tiếp theo hoặc ô cuối
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      alert("Vui lòng nhập đủ 6 số OTP!");
      return;
    }
    alert(`Xác thực thành công với mã: ${otpCode}`);
    // Chuyển hướng vào Dashboard Admin hoặc Customer Profile
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="bg-glow-blue top-[-10%] right-[-10%] opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center">
          {/* Nút Back */}
          <div className="flex justify-start mb-4">
            <Link
              href="/register"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} /> Back
            </Link>
          </div>

          <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Check your email
          </h1>
          <p className="text-slate-400 text-sm mb-8 px-4">
            We've sent a 6-digit verification code to <br />
            <span className="text-white font-medium">user@example.com</span>
          </p>

          <form onSubmit={handleVerify}>
            {/* Khu vực nhập 6 ô OTP */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-900/50 border border-slate-700/50 rounded-xl text-center text-xl text-white font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-secondary text-white font-medium shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:-translate-y-px transition-all"
            >
              Verify Account
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-8 text-sm">
            {timeLeft > 0 ? (
              <p className="text-slate-400">
                Resend code in{" "}
                <span className="text-accent font-medium">
                  00:{timeLeft.toString().padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                onClick={() => setTimeLeft(60)}
                className="text-primary hover:text-accent font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <RefreshCw size={16} /> Resend New Code
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
