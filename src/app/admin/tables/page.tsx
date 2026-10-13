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
  Edit,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  Printer,
  Minus,
} from "lucide-react";
import { io } from "socket.io-client";
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
  cart?: any[];
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
  const socket = io("http://localhost:4000");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State quản lý Popup xác nhận xóa
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // State quản lý Thêm / Sửa bàn
  const [editingTableId, setEditingTableId] = useState<number | null>(null);
  const [tableForm, setTableForm] = useState({
    name: "",
    capacity: 4,
  });
  //STATE CHO GỌI MÓN VÀ THANH TOÁN
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  // Dữ liệu menu (giả lập hoặc fetch từ API)
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeMenuCategory, setActiveMenuCategory] =
    useState<string>("TẤT CẢ");
  // Giỏ hàng hiện tại của bàn đang chọn: { menuItem, quantity }
  const [orderCart, setOrderCart] = useState<any[]>([]);
  //STATE QUẢN LÝ PHIẾU IN
  const [printType, setPrintType] = useState<"BILL" | "KITCHEN" | null>(null);
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

  // Hàm mở Modal thêm mới
  const handleOpenAddModal = () => {
    setEditingTableId(null);
    setTableForm({ name: "", capacity: 4 });
    setIsAddModalOpen(true);
  };

  // Hàm mở Modal chỉnh sửa bàn
  const handleOpenEditTable = (table: Table) => {
    setEditingTableId(table.id);
    setTableForm({
      name: table.name || "",
      capacity: table.capacity || 4,
    });
    setIsAddModalOpen(true);
  };

  // Hàm Submit chung cho cả Thêm mới và Cập nhật
  const handleTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: tableForm.name,
        capacity: Number(tableForm.capacity),
      };

      if (editingTableId) {
        await api.patch(`/tables/${editingTableId}`, payload);
        showToast("Cập nhật thông tin bàn thành công!");
      } else {
        await api.post("/tables", payload);
        showToast("Thêm bàn mới thành công!");
      }

      setIsAddModalOpen(false);
      setEditingTableId(null);
      setTableForm({ name: "", capacity: 4 });
      fetchTables();
    } catch (error: any) {
      console.error("🔥 CHI TIẾT LỖI TỪ BACKEND:", error.response?.data);
      const responseData = error.response?.data;
      let errorMsg =
        responseData?.message ||
        responseData?.errors?.message ||
        responseData?.error ||
        "Có lỗi xảy ra khi lưu thông tin bàn!";

      // 3. Nếu backend trả về mảng (ví dụ lỗi Validation), nối các lỗi lại thành chuỗi
      if (Array.isArray(errorMsg)) {
        errorMsg = errorMsg.join(", ");
      }

      // 4. Hiển thị Popup Toast đỏ
      showToast(String(errorMsg), "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  //Hàm Mở Bàn
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
  //Hàm Xóa Bàn
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
  //Hàm Lọc Bàn
  const filteredTables = tableData.filter(
    (t) => filter === "all" || t.status === filter,
  );
  //Hàm Trạng Thái Bàn
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

  // Lấy danh sách thực đơn khi mở bảng Order
  const handleOpenOrder = async () => {
    try {
      // Gọi API lấy menu (Đảm bảo bạn có endpoint này ở Backend)
      const res = await api.get("/menu");
      const menuData = res.data?.data?.data || res.data?.data || res.data || [];
      // Lọc chỉ lấy món đang bán
      setMenuItems(menuData.filter((item: any) => item.isAvailable));

      // Khởi tạo giỏ hàng trống (hoặc fetch giỏ hàng cũ của bàn từ API)
      setOrderCart(selectedTable?.cart || []);
      setIsOrderModalOpen(true);
    } catch (error) {
      showToast("Không thể tải thực đơn!", "error");
    }
  };
  //Giỏ Hàng
  const handleUpdateCart = (item: any, delta: number) => {
    setOrderCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0)
          return prev.filter((cartItem) => cartItem.id !== item.id); // Xóa nếu = 0
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQty }
            : cartItem,
        );
      }
      if (delta > 0) return [...prev, { ...item, quantity: 1 }];
      return prev;
    });
  };

  // Xác nhận lưu Order
  const submitOrder = async () => {
    if (orderCart.length === 0)
      return showToast("Vui lòng chọn ít nhất 1 món!", "error");

    setIsSubmitting(true);
    try {
      // 1. FIX LỖI 500: Gửi toàn bộ orderCart nguyên bản để Backend lưu trọn vẹn vào cột `cart`
      await api.post(`/tables/${selectedTable?.id}/order`, {
        items: orderCart,
      });

      // 2. Lấy ID thật của đơn hàng vừa tạo để gửi cho Bếp
      const ordersRes = await api.get("/orders");
      const allOrders = ordersRes.data?.data || ordersRes.data || [];
      const realOrder = allOrders[0];
      const tableName = selectedTable?.name || "Bàn khách";

      // 3. Phát sóng sang KDS Bếp bằng ID THẬT
      if (realOrder) {
        socket.emit("sendOrderToKitchen", {
          id: realOrder.orderNumber || realOrder.id,
          dbId: realOrder.id, // ID thật để KDS gọi API cập nhật trạng thái
          table: tableName,
          time: new Date().toLocaleTimeString("vi-VN", { hour12: false }),
          items: orderCart.map((item: any) => ({
            id: Math.random().toString(),
            name: item.name,
            quantity: item.quantity,
            status: "PENDING",
          })),
        });
      }

      // 4. Ép giao diện bàn cập nhật
      const updatedTable = {
        ...selectedTable!,
        cart: orderCart,
        status: "occupied" as TableStatus,
        guestName: selectedTable?.guestName || "Khách lẻ",
      };
      setSelectedTable(updatedTable);

      showToast(`Đã cập nhật thực đơn cho ${tableName}!`, "success");
      setIsOrderModalOpen(false);
      fetchTables();
    } catch (error) {
      showToast("Lỗi khi lưu order!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Xử lý Thanh toán (Giải phóng bàn)

  // Tính tổng tiền giỏ hàng/bill
  const calculateTotal = (cart: any[]) => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  //HÀM SỬ LÝ IN BILL
  const handlePrint = (type: "BILL" | "KITCHEN") => {
    setPrintType(type); // Báo cho React biết đang muốn in tờ nào
    setTimeout(() => {
      window.print(); // Gọi lệnh in của trình duyệt sau 100ms để React kịp đổi giao diện
    }, 500);
  };
  const processCheckout = async () => {
    setIsSubmitting(true);
    try {
      // Gọi API Thanh toán: Đổi status bàn thành 'available', xóa tên khách
      await api.patch(`/tables/${selectedTable?.id}/status`, {
        status: "available",
        guestName: "",
      });
      const clearedTable = {
        ...selectedTable!,
        cart: [],
        status: "available" as TableStatus,
        guestName: "",
      };
      setTableData((prev) =>
        prev.map((t) => (t.id === clearedTable.id ? clearedTable : t)),
      );
      showToast(
        `Đã thanh toán thành công cho ${selectedTable?.name}!`,
        "success",
      );
      setIsCheckoutModalOpen(false);
      setPrintType(null);
      setSelectedTable(null);
      fetchTables();
    } catch (error) {
      showToast("Lỗi khi thanh toán!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] print:h-auto print:block flex flex-col gap-6 relative">
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[9999] pointer-events-none print:hidden">
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 print:hidden">
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
            onClick={handleOpenAddModal}
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

      <div className="flex-1 flex gap-6 min-h-0 relative print:hidden">
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
                  {/*Nút sửa*/}
                  <div className="flex items-center gap-2">
                    {/* 👇 Chỉ hiển thị nút Sửa khi bàn đang trống */}
                    {selectedTable.status === "available" && (
                      <button
                        onClick={() => handleOpenEditTable(selectedTable)}
                        className="p-2 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-blue-400 transition-colors"
                        title="Sửa thông tin bàn"
                      >
                        <Edit size={18} />
                      </button>
                    )}

                    {selectedTable.status === "available" && (
                      <button
                        onClick={() => setTableToDelete(selectedTable)}
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
                      {/* 👇 THÊM MỚI: DANH SÁCH MÓN ĐÃ GỌI */}
                      {selectedTable.cart && selectedTable.cart.length > 0 && (
                        <div className="glass-card rounded-xl p-4 bg-slate-800/30 border border-slate-700/50">
                          <div className="flex justify-between items-center mb-3 border-b border-slate-700/50 pb-2">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                              Đã gọi (
                              {selectedTable.cart.reduce(
                                (acc, i) => acc + i.quantity,
                                0,
                              )}{" "}
                              món)
                            </p>
                            <span className="text-emerald-400 font-bold text-sm">
                              {calculateTotal(
                                selectedTable.cart,
                              ).toLocaleString()}{" "}
                              đ
                            </span>
                          </div>
                          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {selectedTable.cart.map(
                              (item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-sm items-center"
                                >
                                  <span className="text-slate-300 flex-1 truncate pr-2">
                                    <span className="text-blue-400 font-bold mr-2">
                                      {item.quantity}x
                                    </span>
                                    {item.name}
                                  </span>
                                  <span className="text-white font-medium">
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleOpenOrder}
                          className="py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 text-slate-200 hover:text-blue-400 transition-all flex flex-col items-center gap-2 shadow-lg hover:shadow-blue-500/10"
                        >
                          <ShoppingCart size={20} />
                          <span className="text-sm font-medium">Thêm món</span>
                        </button>
                        <button
                          onClick={() => setIsCheckoutModalOpen(true)}
                          className="py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-green-500 text-slate-200 hover:text-green-400 transition-all flex flex-col items-center gap-2 shadow-lg hover:shadow-green-500/10"
                        >
                          <Receipt size={20} />
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

      {/* MODAL THÊM / SỬA BÀN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingTableId
                  ? "Cập nhật thông tin bàn"
                  : "Mở rộng mặt bằng - Thêm bàn"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTableSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                  Tên bàn / Số hiệu bàn
                </label>
                <input
                  required
                  type="text"
                  placeholder="VD: Bàn 07 hoặc VIP 3"
                  value={tableForm.name}
                  onChange={(e) =>
                    setTableForm({ ...tableForm, name: e.target.value })
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
                  value={tableForm.capacity}
                  onChange={(e) =>
                    setTableForm({
                      ...tableForm,
                      capacity: Number(e.target.value),
                    })
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
                  {isSubmitting
                    ? "Đang lưu..."
                    : editingTableId
                      ? "Lưu thay đổi"
                      : "Lưu bàn mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 1. MODAL GỌI MÓN (POS ORDER) */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Cột trái: Danh sách Món ăn */}
              <div className="flex-1 flex flex-col border-r border-slate-800 h-full">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Coffee size={24} className="text-blue-400" />
                    Thực đơn ({selectedTable?.name})
                  </h3>
                  <button
                    onClick={() => setIsOrderModalOpen(false)}
                    className="md:hidden p-2 text-slate-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                {/* 👇 THANH TAB DANH MỤC THÔNG MINH */}
                <div className="flex gap-2 overflow-x-auto p-3 border-b border-slate-800 bg-slate-900/50 hide-scrollbar shrink-0">
                  {[
                    "TẤT CẢ",
                    ...Array.from(
                      new Set(
                        menuItems.map((item) => item.category?.name || "KHÁC"),
                      ),
                    ),
                  ].map((cat) => (
                    <button
                      key={cat as string}
                      onClick={() => setActiveMenuCategory(cat as string)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                        activeMenuCategory === cat
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {cat as string}
                    </button>
                  ))}
                </div>
              </div>
              {/* DANH SÁCH MÓN ĂN THEO TAB */}
              <div className="p-5 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max custom-scrollbar">
                {menuItems
                  .filter(
                    (item) =>
                      activeMenuCategory === "TẤT CẢ" ||
                      (item.category?.name || "KHÁC") === activeMenuCategory,
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleUpdateCart(item, 1)}
                      className="bg-slate-800/40 border border-slate-700 hover:border-blue-500/50 rounded-xl p-3 cursor-pointer transition-all hover:bg-slate-800 flex flex-col gap-2 group shadow-sm hover:shadow-lg"
                    >
                      <div className="h-24 w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center text-slate-600">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                          />
                        ) : (
                          <Coffee size={24} />
                        )}
                      </div>
                      <p className="font-semibold text-slate-200 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-blue-400 font-bold text-sm">
                        {item.price.toLocaleString()} đ
                      </p>
                    </div>
                  ))}
              </div>

              {/* Cột phải: Giỏ hàng */}
              <div className="w-full md:w-96 flex flex-col bg-slate-900/50 h-full">
                <div className="p-5 border-b border-slate-800">
                  <h3 className="text-lg font-bold text-white">Món đã chọn</h3>
                </div>
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {orderCart.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">
                      Chưa có món nào
                    </div>
                  ) : (
                    orderCart.map((cartItem) => (
                      <div
                        key={cartItem.id}
                        className="flex justify-between items-center gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">
                            {cartItem.name}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {(
                              cartItem.price * cartItem.quantity
                            ).toLocaleString()}{" "}
                            đ
                          </p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1 border border-slate-700">
                          <button
                            onClick={() => handleUpdateCart(cartItem, -1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white font-bold text-sm w-4 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateCart(cartItem, 1)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-5 border-t border-slate-800 bg-slate-800/30">
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-400">Tổng cộng:</span>
                    <span className="text-xl font-bold text-white">
                      {calculateTotal(orderCart).toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOrderModalOpen(false)}
                      className="px-4 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={submitOrder}
                      disabled={isSubmitting || orderCart.length === 0}
                      className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        "Đang xử lý..."
                      ) : (
                        <>
                          <CheckCircle2 size={18} /> Gửi Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MODAL THANH TOÁN & IN CHẾ BIẾN */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:static print:bg-white print:p-0">
            <motion.div
              id="printable-area"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md flex flex-col gap-4 print:max-w-full print:gap-0 print:shadow-none print:transform-none print:static"
            >
              {/* ========================================= */}
              {/* TỜ 1: HÓA ĐƠN THANH TOÁN DÀNH CHO KHÁCH   */}
              {/* ========================================= */}
              {printType !== "KITCHEN" && (
                <div
                  className="bg-white rounded-sm p-6 text-black font-mono text-sm shadow-2xl relative max-h-[60vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none print:border-none print:m-0 print:p-0 custom-scrollbar"
                  style={{
                    borderTop: "4px dashed #e2e8f0",
                    borderBottom: "4px dashed #e2e8f0",
                  }}
                >
                  <div className="text-center mb-6 print:mb-4">
                    <h2 className="text-2xl font-bold uppercase mb-1">
                      CIJIBI RESTAURANT
                    </h2>
                    <p className="text-xs text-gray-600 print:text-black">
                      ĐC: 123 Đường Số 1, TP.HCM
                    </p>
                    <p className="text-xs text-gray-600 print:text-black">
                      ĐT: 0877.011.511 (Gia Bảo)
                    </p>
                    <h3 className="text-lg font-bold mt-4 border-y border-dashed border-gray-400 py-2 uppercase print:border-black">
                      Hóa Đơn Thanh Toán
                    </h3>
                  </div>

                  <div className="mb-4 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold">Bàn:</span>{" "}
                      <span>{selectedTable?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Khách:</span>{" "}
                      <span>{selectedTable?.guestName || "Khách lẻ"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Giờ vào:</span>{" "}
                      <span>{selectedTable?.timeSeated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Ngày in:</span>{" "}
                      <span>{new Date().toLocaleString("vi-VN")}</span>
                    </div>
                  </div>

                  <table className="w-full text-xs mb-4">
                    <thead>
                      <tr className="border-b border-dashed border-gray-400 print:border-black">
                        <th className="text-left py-2">Tên món</th>
                        <th className="text-center py-2 w-8">SL</th>
                        <th className="text-right py-2">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTable?.cart && selectedTable.cart.length > 0 ? (
                        selectedTable.cart.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td className="py-2 pr-2 leading-tight">
                              {item.name}
                              <br />
                              <span className="text-[10px] text-gray-500 print:text-black">
                                {item.price.toLocaleString()} đ
                              </span>
                            </td>
                            <td className="text-center py-2 align-top font-bold">
                              {item.quantity}
                            </td>
                            <td className="text-right py-2 font-semibold align-top">
                              {(item.price * item.quantity).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-4 text-center italic text-gray-500"
                          >
                            Chưa có món
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="border-t border-dashed border-gray-400 print:border-black pt-3 mb-6">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-base uppercase">
                        Tổng Cộng:
                      </span>
                      <span className="font-bold text-xl">
                        {calculateTotal(
                          selectedTable?.cart || [],
                        ).toLocaleString()}{" "}
                        đ
                      </span>
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-600 print:text-black mt-4 italic">
                    <p>Xin cảm ơn và hẹn gặp lại quý khách!</p>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* TỜ 2: PHIẾU BÁO CHẾ BIẾN XUỐNG BẾP/PHA CHẾ*/}
              {/* ========================================= */}
              {printType === "KITCHEN" && (
                <div className="bg-white rounded-sm p-4 text-black font-mono text-sm shadow-2xl relative print:shadow-none print:border-none print:m-0 print:p-0">
                  <div className="text-center border-b-2 border-black pb-3 mb-3 mt-4">
                    <h2 className="text-3xl font-bold uppercase mb-2">
                      PHIẾU BÁO BẾP
                    </h2>
                    <p className="text-xl font-bold border-2 border-black inline-block px-4 py-1">
                      BÀN: {selectedTable?.name}
                    </p>
                    <p className="text-sm mt-2">
                      Giờ in: {new Date().toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                  <table className="w-full text-base mb-4">
                    <thead>
                      <tr className="border-y-2 border-black">
                        <th className="text-left py-2 font-bold uppercase">
                          Tên Món
                        </th>
                        <th className="text-right py-2 font-bold uppercase">
                          SL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTable?.cart
                        ?.filter((item) => item.printerGroup !== "PHA_CHE")
                        .map((item: any, idx: number) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-400 border-dashed"
                          >
                            <td className="py-3 pr-2 text-xl font-bold uppercase">
                              {item.name}
                            </td>
                            <td className="text-right py-3 text-3xl font-black">
                              {item.quantity}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ========================================= */}
              {/* NÚT ĐIỀU KHIỂN (SẼ BỊ ẨN KHI IN THỰC TẾ)  */}
              {/* ========================================= */}
              <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-700 print:hidden w-full">
                <button
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setPrintType(null);
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Đóng
                </button>

                <div className="flex flex-wrap items-center justify-end gap-3 flex-1">
                  <button
                    onClick={() => handlePrint("KITCHEN")}
                    className="px-4 py-3 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/30 font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Printer size={18} /> In Bếp
                  </button>
                  <button
                    onClick={() => handlePrint("BILL")}
                    className="px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Printer size={18} /> In Bill
                  </button>
                  <button
                    onClick={processCheckout}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 size={20} />{" "}
                    {isSubmitting ? "Đang xử lý..." : "XÁC NHẬN THU TIỀN"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* CUSTOM CONFIRM POPUP XÓA BÀN */}
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
