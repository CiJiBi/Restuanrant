"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axios";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Receipt,
  X,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type TableStatus = "available" | "occupied" | "reserved";

interface Table {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  guestName?: string;
  timeSeated?: string;
  orderId?: string;
  totalAmount?: string;
}

interface ToastMessage {
  message: string;
  type: "success" | "error";
}

export default function TableMapPage() {
  const [tableData, setTableData] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TableStatus | "all">("all");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTable, setNewTable] = useState({ name: "", capacity: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State quản lý Popup xác nhận xóa (Thay thế hoàn toàn window.confirm)
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);

  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/tables");
      const payload = response.data;
      if (payload?.data && Array.isArray(payload.data)) {
        setTableData(payload.data);
      } else if (Array.isArray(payload)) {
        setTableData(payload);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách bàn:", error);
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/tables", {
        name: newTable.name,
        capacity: Number(newTable.capacity),
      });
      showToast("Thêm bàn mới thành công!");
      setIsAddModalOpen(false);
      setNewTable({ name: "", capacity: "" });
      fetchTables();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Lỗi khi thêm bàn mới!",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenTable = async (tableId: number) => {
    try {
      await api.patch(`/tables/${tableId}/status`, {
        status: "occupied",
        guestName: "Khách lẻ",
      });
      showToast("Đã mở bàn thành công!");
      fetchTables();
      setSelectedTable(null);
    } catch (error: any) {
      showToast("Không thể mở bàn!", "error");
    }
  };

  // Thực thi xóa sau khi bấm xác nhận trên Popup mới
  const confirmDeleteTable = async () => {
    if (!tableToDelete) return;

    if (tableToDelete.status !== "available") {
      showToast("Không thể xóa bàn đang có khách hoặc đã đặt!", "error");
      setTableToDelete(null);
      return;
    }

    try {
      await api.delete(`/tables/${tableToDelete.id}`);
      showToast("Đã xóa bàn thành công!");
      setSelectedTable(null);
      setTableToDelete(null);
      fetchTables();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Không thể xóa bàn này!",
        "error",
      );
      setTableToDelete(null);
    }
  };

  const filteredTables = tableData.filter(
    (t) => filter === "all" || t.status === filter,
  );

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
          bg: "bg-blue-500/15",
          border: "border-blue-500/40",
          text: "text-blue-400",
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
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 relative">
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-slate-900/90 border-green-500/30 text-green-400"
                  : "bg-slate-900/90 border-red-500/30 text-red-400"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={20} className="text-green-400 shrink-0" />
              ) : (
                <AlertCircle size={20} className="text-red-400 shrink-0" />
              )}
              <span className="text-sm font-medium text-white">
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sơ đồ nhà hàng
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Giám sát và quản lý trạng thái bàn theo thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> Thêm bàn mới
          </button>

          <div className="glass-card rounded-xl p-1.5 flex items-center gap-1 bg-slate-800/40 border border-slate-700/50">
            {["all", "available", "occupied", "reserved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
      </div>

      <div className="flex-1 flex gap-6 min-h-0 relative">
        <div
          className={`flex-1 glass-card rounded-2xl p-6 overflow-y-auto transition-all duration-300 ${selectedTable ? "w-2/3 hidden lg:block" : "w-full"}`}
        >
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-slate-400">
              Đang tải sơ đồ bàn...
            </div>
          ) : filteredTables.length === 0 ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              Không có bàn nào phù hợp với bộ lọc.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredTables.map((table, index) => {
                  const styles = getStatusStyles(table.status || "available");
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

                        {table.status !== "available" && table.guestName && (
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
          )}
        </div>

        <AnimatePresence>
          {selectedTable && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full lg:w-1/3 shrink-0 h-full"
            >
              <div className="glass-card rounded-2xl h-full flex flex-col overflow-hidden border-t border-l border-white/20 bg-slate-900/60 backdrop-blur-md">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/30">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedTable.name}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyles(selectedTable.status || "available").bg} ${getStatusStyles(selectedTable.status || "available").text} ${getStatusStyles(selectedTable.status || "available").border}`}
                    >
                      {
                        getStatusStyles(selectedTable.status || "available")
                          .icon
                      }
                      {selectedTable.status === "available"
                        ? "Đang trống"
                        : selectedTable.status === "occupied"
                          ? "Đang phục vụ"
                          : "Đã đặt trước"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTable.status === "available" && (
                      <button
                        onClick={() => setTableToDelete(selectedTable)} // 👈 Mở Popup xác nhận thay vì confirm cũ
                        className="p-2 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                        title="Xóa bàn trống"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedTable(null)}
                      className="p-2 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                  {selectedTable.status === "available" ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-90">
                      <Coffee size={48} className="text-slate-600 mb-4" />
                      <p className="text-slate-300 font-medium mb-6">
                        Bàn đang trống sẵn sàng đón khách
                      </p>
                      <button
                        onClick={() => handleOpenTable(selectedTable.id)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                      >
                        Mở bàn ngay (Gán khách)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="glass-card rounded-xl p-4 bg-slate-800/30 border border-slate-700/50">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">
                          Thông tin khách hàng
                        </p>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Khách hàng:</span>
                            <span className="text-white font-medium">
                              {selectedTable.guestName || "Khách lẻ"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Thời gian:</span>
                            <span className="text-white font-medium">
                              {selectedTable.timeSeated || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 text-slate-200 hover:text-blue-400 transition-all flex flex-col items-center gap-2">
                          <Receipt size={20} />
                          <span className="text-sm font-medium">Thêm món</span>
                        </button>
                        <button className="py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-green-500 text-slate-200 hover:text-green-400 transition-all flex flex-col items-center gap-2">
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

      {/* MODAL THÊM BÀN MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                Mở rộng mặt bằng - Thêm bàn
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                  Tên bàn / Số hiệu bàn
                </label>
                <input
                  required
                  type="text"
                  placeholder="VD: Bàn 07 hoặc VIP 3"
                  value={newTable.name}
                  onChange={(e) =>
                    setNewTable({ ...newTable, name: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                  Sức chứa (Số ghế)
                </label>
                <input
                  required
                  type="number"
                  placeholder="VD: 4"
                  value={newTable.capacity}
                  onChange={(e) =>
                    setNewTable({ ...newTable, capacity: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu bàn mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRM POPUP (Thay thế hoàn toàn window.confirm xấu xí) */}
      {tableToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#111827] border border-red-500/30 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 space-y-5 text-center"
          >
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Xác nhận xóa bàn
              </h3>
              <p className="text-slate-400 text-sm">
                Bạn có chắc chắn muốn xóa{" "}
                <span className="text-white font-semibold">
                  {tableToDelete.name}
                </span>{" "}
                khỏi sơ đồ nhà hàng không? Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTableToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteTable}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-500/20"
              >
                Xóa bàn
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
