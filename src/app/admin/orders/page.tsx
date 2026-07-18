"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChefHat,
  Package,
  CheckCircle2,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react";
import { INITIAL_ORDERS, Order, OrderStatus } from "../../constants/data";

const columns = [
  {
    id: "pending",
    title: "Chờ xác nhận",
    icon: Clock,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    id: "cooking",
    title: "Đang chế biến",
    icon: ChefHat,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    id: "ready",
    title: "Sẵn sàng phục vụ",
    icon: Package,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    id: "completed",
    title: "Đã hoàn thành",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

export default function KanbanOrdersPage() {
  // Lấy dữ liệu từ Trình duyệt (nếu có), nếu không có thì lấy dữ liệu mẫu
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cijibi_orders");
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    }
    return INITIAL_ORDERS;
  });

  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<OrderStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Tự động lưu mỗi khi trạng thái đơn hàng bị thay đổi (kéo thả)
  useEffect(() => {
    localStorage.setItem("cijibi_orders", JSON.stringify(orders));
  }, [orders]);

  // Các hàm xử lý kéo thả (Giữ nguyên logic mượt mà)
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedOrderId(id);
    e.dataTransfer.effectAllowed = "move";
    const ghost = document.createElement("div");
    e.dataTransfer.setDragImage(ghost, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, status: OrderStatus) => {
    e.preventDefault();
    if (activeColumn !== status) setActiveColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setActiveColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    setActiveColumn(null);
    if (draggedOrderId) {
      setOrders(
        orders.map((order) =>
          order.id === draggedOrderId
            ? { ...order, status: targetStatus }
            : order,
        ),
      );
    }
    setDraggedOrderId(null);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.table.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6">
      {/* Header & Tools */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Tiến độ đơn hàng
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kéo thả để cập nhật trạng thái đơn hàng tới bộ phận bếp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm mã đơn, tên bàn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 pl-9 text-sm text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex-1 flex gap-4 lg:gap-6 overflow-x-auto pb-4 snap-x">
        {columns.map((col) => {
          const columnOrders = filteredOrders.filter(
            (o) => o.status === col.id,
          );
          const isDragOver = activeColumn === col.id;
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className="flex-1 min-w-[300px] max-w-[400px] flex flex-col gap-4 snap-center"
              onDragOver={(e) => handleDragOver(e, col.id as OrderStatus)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id as OrderStatus)}
            >
              {/* Column Header */}
              <div
                className={`glass-card rounded-2xl p-4 border-t-2 ${isDragOver ? col.border.replace("20", "100") : "border-t-transparent"} transition-all flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${col.bg} ${col.color}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-white text-sm">{col.title}</h3>
                </div>
                <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700/50">
                  {columnOrders.length}
                </span>
              </div>

              {/* Column Body */}
              <div
                className={`flex-1 overflow-y-auto rounded-2xl p-2 -mx-2 transition-colors duration-200 ${isDragOver ? "bg-slate-800/30 ring-1 ring-slate-700/50 inset-0" : ""}`}
              >
                <AnimatePresence>
                  {columnOrders.map((order) => (
                    <motion.div
                      layout
                      layoutId={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      key={order.id}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, order.id)}
                      className={`glass-card p-4 rounded-xl mb-3 cursor-grab active:cursor-grabbing border ${draggedOrderId === order.id ? "border-primary shadow-[0_0_20px_rgba(37,99,235,0.2)] opacity-50" : "border-slate-700/30 hover:border-slate-600"} transition-all`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-xs font-bold text-accent">
                            {order.id}
                          </span>
                          <h4 className="text-white font-bold mt-0.5">
                            {order.table}
                          </h4>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                        {order.items}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                        <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md">
                          {order.time}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {order.amount}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {columnOrders.length === 0 && (
                  <div className="h-32 rounded-xl border border-dashed border-slate-700/50 flex items-center justify-center text-slate-500 text-sm opacity-50">
                    Thả đơn hàng vào đây
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
