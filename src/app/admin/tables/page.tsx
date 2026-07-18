"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Receipt,
  X,
  Filter,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu và Mock Data
type TableStatus = "available" | "occupied" | "reserved";

interface Table {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  guestName?: string;
  timeSeated?: string;
  orderId?: string;
  totalAmount?: string;
}

const tableData: Table[] = [
  { id: "T01", name: "Bàn 01", capacity: 2, status: "available" },
  {
    id: "T02",
    name: "Bàn 02",
    capacity: 2,
    status: "occupied",
    guestName: "Nguyễn Văn A",
    timeSeated: "45 phút",
    orderId: "#ORD-045",
    totalAmount: "850,000đ",
  },
  {
    id: "T03",
    name: "Bàn 03",
    capacity: 4,
    status: "reserved",
    guestName: "Trần Thị B",
    timeSeated: "19:00 Hôm nay",
  },
  { id: "T04", name: "Bàn 04", capacity: 4, status: "available" },
  {
    id: "T05",
    name: "Bàn 05",
    capacity: 6,
    status: "occupied",
    guestName: "Lê Hoàng C",
    timeSeated: "1.5 giờ",
    orderId: "#ORD-042",
    totalAmount: "2,400,000đ",
  },
  { id: "T06", name: "Bàn 06", capacity: 6, status: "available" },
  {
    id: "T07",
    name: "VIP 1",
    capacity: 10,
    status: "occupied",
    guestName: "Đoàn Khách Cty",
    timeSeated: "20 phút",
    orderId: "#ORD-048",
    totalAmount: "4,500,000đ",
  },
  {
    id: "T08",
    name: "VIP 2",
    capacity: 8,
    status: "reserved",
    guestName: "Phạm D",
    timeSeated: "20:30 Hôm nay",
  },
];

export default function TableMapPage() {
  const [filter, setFilter] = useState<TableStatus | "all">("all");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const filteredTables = tableData.filter(
    (t) => filter === "all" || t.status === filter,
  );

  // Hàm helper chọn giao diện theo trạng thái
  const getStatusStyles = (status: TableStatus) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-400",
          icon: <CheckCircle2 size={16} />,
        };
      case "occupied":
        return {
          bg: "bg-primary/15",
          border: "border-primary/40",
          text: "text-primary",
          icon: <Coffee size={16} />,
        };
      case "reserved":
        return {
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          text: "text-orange-400",
          icon: <Clock size={16} />,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sơ đồ nhà hàng
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Giám sát và quản lý trạng thái bàn theo thời gian thực.
          </p>
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="glass-card rounded-xl p-1.5 flex items-center gap-1">
          {["all", "available", "occupied", "reserved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-slate-700 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {f === "all"
                ? "Tất cả"
                : f === "available"
                  ? "Bàn trống"
                  : f === "occupied"
                    ? "Đang phục vụ"
                    : "Đã đặt"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Map & Side Panel */}
      <div className="flex-1 flex gap-6 min-h-0 relative">
        {/* Lưới Sơ đồ bàn (Mặt bằng 2D) */}
        <div
          className={`flex-1 glass-card rounded-2xl p-6 overflow-y-auto transition-all duration-300 ${selectedTable ? "w-2/3 hidden lg:block" : "w-full"}`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredTables.map((table, index) => {
                const styles = getStatusStyles(table.status);
                const isSelected = selectedTable?.id === table.id;

                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`relative p-5 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${styles.bg} ${isSelected ? "border-white ring-2 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]" : styles.border} hover:-translate-y-1 hover:shadow-lg`}
                  >
                    {/* Họa tiết trang trí (mô phỏng bàn) */}
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-tl from-white/5 to-transparent rounded-full blur-xl pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <h3 className="text-xl font-bold text-white">
                        {table.name}
                      </h3>
                      <div
                        className={`p-1.5 rounded-lg ${styles.bg} ${styles.text} border ${styles.border}`}
                      >
                        {styles.icon}
                      </div>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Users size={14} className="text-slate-500" />
                        <span>{table.capacity} Ghế</span>
                      </div>

                      {table.status !== "available" && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <AlertCircle size={14} className={styles.text} />
                          <span className="truncate">{table.guestName}</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Side Panel Chi tiết bàn (Trượt từ phải ra) */}
        <AnimatePresence>
          {selectedTable && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full lg:w-1/3 shrink-0 h-full"
            >
              <div className="glass-card rounded-2xl h-full flex flex-col overflow-hidden border-t border-l border-white/20">
                {/* Panel Header */}
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/30">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedTable.name}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyles(selectedTable.status).bg} ${getStatusStyles(selectedTable.status).text} ${getStatusStyles(selectedTable.status).border}`}
                    >
                      {getStatusStyles(selectedTable.status).icon}
                      {selectedTable.status === "available"
                        ? "Đang trống"
                        : selectedTable.status === "occupied"
                          ? "Đang phục vụ"
                          : "Đã đặt trước"}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="p-2 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Panel Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                  {selectedTable.status === "available" ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                      <Coffee size={48} className="text-slate-600 mb-4" />
                      <p className="text-slate-300 font-medium">
                        Bàn đang trống sẵn sàng đón khách
                      </p>
                      <button className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-secondary transition-all">
                        Mở bàn ngay
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Thông tin khách */}
                      <div className="glass-card rounded-xl p-4 bg-slate-900/30">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                          Thông tin khách hàng
                        </p>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Khách hàng:</span>
                            <span className="text-white font-medium">
                              {selectedTable.guestName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Thời gian:</span>
                            <span className="text-white font-medium">
                              {selectedTable.timeSeated}
                            </span>
                          </div>
                          {selectedTable.orderId && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Mã Order:</span>
                              <span className="text-accent font-medium">
                                {selectedTable.orderId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Các nút thao tác */}
                      <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary text-slate-200 hover:text-primary transition-all flex flex-col items-center gap-2">
                          <Receipt size={20} />
                          <span className="text-sm font-medium">Thêm món</span>
                        </button>
                        <button className="py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-green-500/50 text-slate-200 hover:text-green-400 transition-all flex flex-col items-center gap-2">
                          <CheckCircle2 size={20} />
                          <span className="text-sm font-medium">
                            Thanh toán
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
