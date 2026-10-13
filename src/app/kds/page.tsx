"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import api from "../lib/axios"; // Đường dẫn tới file axios của bạn
import {
  Clock,
  ChefHat,
  CheckCircle2,
  Flame,
  Utensils,
  Wifi,
  WifiOff,
} from "lucide-react";

// Kết nối tới Backend (Cổng 4000)
const socket: Socket = io("http://localhost:4000");

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  note?: string;
  status: "PENDING" | "COOKING" | "READY";
}

interface Order {
  id: string;
  dbId?: string;
  table: string;
  time: string;
  items: OrderItem[];
}

export default function KitchenDisplaySystem() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    // Đồng hồ
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // 👇 1. KONTROL TRỰC TIẾP: Kiểm tra ngay trạng thái hiện tại (Đề phòng Socket kết nối quá nhanh)
    if (socket.connected) {
      setIsConnected(true);
    }

    // 👇 2. Đặt các hàm lắng nghe cho các lần rớt mạng/kết nối lại sau này
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Lắng nghe ĐƠN HÀNG MỚI từ Thu ngân
    socket.on("receiveNewOrder", (newOrder: Order) => {
      setOrders((prev) => [...prev, newOrder]);
    });

    return () => {
      clearInterval(timer);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receiveNewOrder");
    };
  }, []);
  // Hàm chuyển đổi trạng thái món ăn khi đầu bếp bấm vào
  const toggleItemStatus = async (
    orderId: string,
    itemId: string,
    currentStatus: string,
  ) => {
    let nextStatus: "PENDING" | "COOKING" | "READY" = "COOKING";
    if (currentStatus === "PENDING") nextStatus = "COOKING";
    else if (currentStatus === "COOKING") nextStatus = "READY";
    else if (currentStatus === "READY") nextStatus = "PENDING";

    // 1. Tìm đơn hàng hiện tại để lấy dbId thật
    const currentOrder = orders.find((o) => o.id === orderId);

    // 2. Cập nhật UI lập tức cho mượt
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item) =>
            item.id === itemId ? { ...item, status: nextStatus } : item,
          ),
        };
      }),
    );

    socket.emit("updateDishStatus", { orderId, itemId, status: nextStatus });

    // 3. GỌI API BẰNG ID THẬT
    if (nextStatus === "COOKING" && currentOrder?.dbId) {
      try {
        await api.patch(`/orders/${currentOrder.dbId}/status`, {
          status: "COOKING",
        });
        socket.emit("orderStatusUpdated"); // Báo cho trang Orders nhảy số
      } catch (error) {
        console.error("Lỗi cập nhật API Đang nấu:", error);
      }
    }
  };
  // Hàm Bếp Bấm Trả Món / Xong Bill
  const removeOrder = async (orderId: string) => {
    const currentOrder = orders.find((o) => o.id === orderId);

    // Xóa khỏi UI bếp
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    // Gọi API chuyển trạng thái thành ĐÃ LÊN MÓN (SERVED) thay vì COMPLETED
    if (currentOrder?.dbId) {
      try {
        await api.patch(`/orders/${currentOrder.dbId}/status`, {
          status: "SERVED",
        }); // 👈 Sửa ở đây
        socket.emit("orderStatusUpdated"); // Báo cho trang Orders nhảy số
      } catch (error) {
        console.error("Lỗi cập nhật API Hoàn thành:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col font-sans">
      {/* KDS Header */}
      <header className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center">
            <ChefHat size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Màn hình Bếp (KDS)
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {isConnected ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <Wifi size={14} /> KẾT NỐI ỔN ĐỊNH
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                  <WifiOff size={14} /> MẤT KẾT NỐI
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black text-white tracking-tighter">
            {isMounted
              ? currentTime.toLocaleTimeString("vi-VN", { hour12: false })
              : "--:--:--"}
          </h2>
        </div>
      </header>

      {/* Danh sách các Bill order */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full items-start">
          <AnimatePresence>
            {orders.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center pt-20 text-slate-600">
                <Utensils size={64} className="mb-4 opacity-50" />
                <p className="text-xl font-bold uppercase tracking-widest">
                  Chưa có đơn hàng nào
                </p>
              </div>
            )}

            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="min-w-[340px] w-[340px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shrink-0 flex flex-col max-h-[80vh]"
              >
                {/* Order Header */}
                <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      {order.table}
                    </h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">
                      {order.id}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="flex items-center gap-1.5 text-orange-400 font-bold bg-orange-500/10 px-2.5 py-1 rounded-lg">
                      <Clock size={16} /> {order.time}
                    </span>
                  </div>
                </div>

                {/* Danh sách món */}
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        toggleItemStatus(order.id, item.id, item.status)
                      }
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 active:scale-95 select-none ${
                        item.status === "PENDING"
                          ? "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                          : item.status === "COOKING"
                            ? "bg-orange-500/10 border-orange-500/50 hover:border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                            : "bg-emerald-500/10 border-emerald-500 hover:border-emerald-400 opacity-60"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <h4
                            className={`text-lg font-bold ${item.status === "READY" ? "text-emerald-400 line-through" : "text-white"}`}
                          >
                            {item.name}
                          </h4>
                          {item.note && (
                            <p className="text-sm text-amber-400 font-medium italic mt-1 bg-amber-500/10 px-2 py-1 rounded w-fit">
                              Lưu ý: {item.note}
                            </p>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center font-black text-xl text-white shrink-0 shadow-inner">
                          x{item.quantity}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-end">
                        {item.status === "PENDING" && (
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Chờ nấu
                          </span>
                        )}
                        {item.status === "COOKING" && (
                          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                            <Flame size={14} /> Đang nấu
                          </span>
                        )}
                        {item.status === "READY" && (
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 size={14} /> Xong
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nút Hoàn tất toàn bộ Bill */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                  <button
                    onClick={() => removeOrder(order.id)}
                    className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
                  >
                    TRẢ MÓN & ĐÓNG BILL
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
