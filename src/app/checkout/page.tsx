"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Wallet,
  Banknote,
  QrCode,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 1. Import Hook Thông báo và Dữ liệu gốc
import { useNotification } from "../components/notification";
import { INITIAL_ORDERS } from "../constants/data";

// Mock Data Giỏ hàng
const orderItems = [
  {
    id: "1",
    name: "Thịt bò Wagyu sốt vang",
    price: 1250000,
    qty: 2,
    img: "https://images.unsplash.com/photo-1544025162-8315520c6792?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "2",
    name: "Rượu Vang Chateau Margaux",
    price: 4500000,
    qty: 1,
    img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=150",
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "vnpay" | "momo" | "cash"
  >("card");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );

  // Khởi tạo các công cụ điều hướng và thông báo
  const { toast } = useNotification();
  const router = useRouter();

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const vat = subtotal * 0.1;
  const shippingFee = deliveryType === "delivery" ? 35000 : 0;
  const total = subtotal + vat;

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // --- LOGIC XỬ LÝ THANH TOÁN THỰC TẾ ---
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Lấy danh sách đơn hàng hiện tại trong kho (Nếu có)
    const savedOrders = localStorage.getItem("cijibi_orders");
    const currentOrders = savedOrders
      ? JSON.parse(savedOrders)
      : INITIAL_ORDERS;

    // 2. Tạo một thẻ đơn hàng mới
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      table:
        deliveryType === "delivery" ? "Giao hàng tận nơi" : "Khách đến lấy",
      customer: "Khách hàng Online", // Trong thực tế sẽ lấy từ Form Input
      items: orderItems.map((item) => `${item.qty}x ${item.name}`).join(", "),
      amount: formatMoney(total),
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending", // Chuyển thẳng vào cột "Chờ xác nhận"
    };

    // 3. Lưu đơn hàng mới vào kho chung
    localStorage.setItem(
      "cijibi_orders",
      JSON.stringify([newOrder, ...currentOrders]),
    );

    // 4. Bật thông báo Toast thành công
    toast(
      "success",
      "Thanh toán thành công!",
      "Đơn hàng của bạn đã được gửi thẳng đến bếp.",
    );

    // 5. Chuyển hướng sang trang Theo dõi sau 1.5 giây
    setTimeout(() => {
      router.push("/order-tracking");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 py-12 relative overflow-hidden">
      <div className="bg-glow-blue top-[-10%] right-[-10%] opacity-30 fixed pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại Thực đơn</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck size={18} className="text-green-500" />
            Thanh toán bảo mật 256-bit SSL
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* CỘT TRÁI */}
          <div className="flex-1 space-y-8">
            <form
              id="checkout-form"
              onSubmit={handleCheckout}
              className="space-y-8"
            >
              <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">
                  1. Hình thức nhận hàng
                </h2>
                <div className="flex bg-slate-900/50 p-1.5 rounded-xl mb-6 border border-white/5">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${deliveryType === "delivery" ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    Giao hàng tận nơi
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${deliveryType === "pickup" ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    Đến lấy tại nhà hàng
                  </button>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative group">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Họ và tên người nhận"
                        required
                        className="glass-input"
                      />
                    </div>
                    <div className="relative group">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        size={18}
                      />
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        required
                        className="glass-input"
                      />
                    </div>
                  </div>
                  {deliveryType === "delivery" && (
                    <div className="relative group">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Địa chỉ giao hàng chi tiết"
                        required
                        className="glass-input"
                      />
                    </div>
                  )}
                  <textarea
                    placeholder="Ghi chú cho nhà hàng (tùy chọn)"
                    className="glass-input !rounded-2xl min-h-[100px] resize-none"
                  ></textarea>
                </div>
              </section>

              <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">
                  2. Phương thức thanh toán
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === "card" ? "border-primary bg-primary/10" : "border-slate-700/50 bg-slate-900/50"}`}
                  >
                    <div
                      className={`p-2 rounded-xl ${paymentMethod === "card" ? "bg-primary text-white" : "bg-slate-800 text-slate-400"}`}
                    >
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">
                        Thẻ Visa/Mastercard
                      </h4>
                      <p className="text-xs text-slate-400">
                        Thanh toán quốc tế
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("vnpay")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === "vnpay" ? "border-primary bg-primary/10" : "border-slate-700/50 bg-slate-900/50"}`}
                  >
                    <div
                      className={`p-2 rounded-xl ${paymentMethod === "vnpay" ? "bg-primary text-white" : "bg-slate-800 text-slate-400"}`}
                    >
                      <QrCode size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">VNPAY-QR</h4>
                      <p className="text-xs text-slate-400">
                        Quét mã qua ứng dụng NH
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("momo")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === "momo" ? "border-[#A50064] bg-[#A50064]/10" : "border-slate-700/50 bg-slate-900/50"}`}
                  >
                    <div
                      className={`p-2 rounded-xl ${paymentMethod === "momo" ? "bg-[#A50064] text-white" : "bg-slate-800 text-slate-400"}`}
                    >
                      <Wallet size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Ví MoMo</h4>
                      <p className="text-xs text-slate-400">
                        Thanh toán siêu tốc
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === "cash" ? "border-primary bg-primary/10" : "border-slate-700/50 bg-slate-900/50"}`}
                  >
                    <div
                      className={`p-2 rounded-xl ${paymentMethod === "cash" ? "bg-primary text-white" : "bg-slate-800 text-slate-400"}`}
                    >
                      <Banknote size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Tiền mặt (COD)</h4>
                      <p className="text-xs text-slate-400">
                        Thanh toán khi nhận hàng
                      </p>
                    </div>
                  </div>
                </div>
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 space-y-4 pt-6 border-t border-white/5"
                  >
                    <div className="relative">
                      <CreditCard
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Số thẻ (0000 0000 0000 0000)"
                        className="glass-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="glass-input"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="glass-input"
                      />
                    </div>
                  </motion.div>
                )}
              </section>
            </form>
          </div>

          {/* CỘT PHẢI */}
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 sticky top-28 shadow-2xl shadow-primary/10">
              <h2 className="text-xl font-bold text-white mb-6">
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        SL: {item.qty}
                      </p>
                      <p className="text-accent text-sm font-medium mt-1">
                        {formatMoney(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Tạm tính</span>
                  <span className="text-white font-medium">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Thuế VAT (10%)</span>
                  <span className="text-white font-medium">
                    {formatMoney(vat)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Phí vận chuyển</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? "Miễn phí" : formatMoney(shippingFee)}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end mb-8">
                <span className="text-slate-300">Tổng cộng</span>
                <span className="text-3xl font-extrabold text-primary">
                  {formatMoney(total)}
                </span>
              </div>
              <button
                form="checkout-form"
                type="submit"
                className="w-full py-4 rounded-2xl bg-primary hover:bg-secondary text-white font-bold text-lg shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all flex items-center justify-center gap-2 group"
              >
                Xác nhận thanh toán{" "}
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
