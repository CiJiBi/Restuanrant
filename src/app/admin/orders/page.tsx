"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axios";
import {
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ShoppingBag,
  User,
  Phone,
  Coffee,
  MapPin,
  ChefHat,
} from "lucide-react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000", { autoConnect: false }); // Kênh thời gian thực cần JWT
// 👇 1. CẬP NHẬT INTERFACE: Bổ sung cấu trúc chứa danh sách món ăn
interface OrderItem {
  quantity: number;
  price: number;
  menuItem?: { name: string };
  menu?: { name: string };
  name?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  totalAmount: number;
  status: string;
  table?: { name: string };
  createdAt: string;
  orderItems?: OrderItem[]; // 👈 Chứa danh sách món ăn từ Backend trả về
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const TABS = [
    { id: "ALL", label: "Tất cả đơn", icon: <Receipt size={16} /> },
    { id: "PENDING", label: "Chờ xử lý", icon: <Clock size={16} /> },
    { id: "COOKING", label: "Bếp đang nấu", icon: <ChefHat size={16} /> },
    { id: "SERVED", label: "Chờ thanh toán", icon: <Coffee size={16} /> }, // 👈 TAB MỚI
    {
      id: "COMPLETED",
      label: "Đã thanh toán",
      icon: <CheckCircle2 size={16} />,
    },
    { id: "CANCELLED", label: "Đã hủy", icon: <XCircle size={16} /> },
  ];
  useEffect(() => {
    socket.auth = { token: localStorage.getItem("cijibi_token") };
    socket.connect();
    fetchOrders();

    // Lắng nghe tín hiệu từ Bếp (KDS) và Thu ngân (POS)
    const handleRefresh = () => fetchOrders();

    socket.on("receiveNewOrder", handleRefresh); // Có đơn mới -> Tự động tải lại
    socket.on("orderStatusUpdated", handleRefresh); // Bếp đổi trạng thái -> Tự động tải lại

    return () => {
      socket.off("receiveNewOrder", handleRefresh);
      socket.off("orderStatusUpdated", handleRefresh);
      socket.disconnect();
    };
  }, []);
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      const data = res.data?.data || res.data || [];
      setOrders(data);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 👇 2. SỬA LOGIC LỌC TAB: Cho phép tab "COOKING" hiển thị cả các đơn đang "PREPARING"
      const currentStatus = order.status?.toUpperCase() || "";
      const matchTab =
        activeTab === "ALL" ||
        currentStatus === activeTab ||
        (activeTab === "COOKING" && currentStatus === "PREPARING");

      const query = searchQuery.toLowerCase();
      const matchSearch =
        order.orderNumber?.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.table?.name?.toLowerCase().includes(query);

      return matchTab && matchSearch;
    });
  }, [orders, activeTab, searchQuery]);
  //Hàm trạng thái
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return (
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock size={14} /> Chờ xử lý
          </span>
        );
      case "PREPARING":
      case "COOKING":
        return (
          <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ChefHat size={14} /> Đang chuẩn bị
          </span>
        );
      case "SERVED": // 👈 TRẠNG THÁI MỚI
        return (
          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Coffee size={14} /> Chờ thanh toán
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Đã thanh toán
          </span>
        ); // 👈 Đổi nhãn cho rõ nghĩa
      case "CANCELLED":
        return (
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <XCircle size={14} /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/10 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Lịch sử Đơn hàng
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Phân loại và tra cứu trạng thái đơn hàng theo thời gian thực.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm mã đơn, tên khách, bàn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white px-10 py-2.5 rounded-xl outline-none focus:border-primary transition-colors text-sm"
          />
          <Search
            className="absolute left-3.5 top-3 text-slate-400"
            size={18}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-slate-800">
        {TABS.map((tab) => {
          // Tính số lượng đơn cho từng Tab (Gộp chung PREPARING vào COOKING)
          let count = 0;
          if (tab.id === "ALL") count = orders.length;
          else if (tab.id === "COOKING") {
            count = orders.filter(
              (o) => o.status === "COOKING" || o.status === "PREPARING",
            ).length;
          } else {
            count = orders.filter((o) => o.status === tab.id).length;
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-blue-500/5 rounded-t-xl"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-xl"
              }`}
            >
              {tab.icon} {tab.label}
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-primary text-white" : "bg-slate-800 text-slate-300"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
          <Receipt size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-medium">Không tìm thấy đơn hàng nào ở mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={order.id}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col"
              >
                <div className="p-5 border-b border-slate-800 flex justify-between items-start bg-slate-800/30">
                  <div>
                    <h3 className="font-black text-white text-lg">
                      {order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                      {order.table ? (
                        <MapPin size={16} />
                      ) : (
                        <ShoppingBag size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Khu vực
                      </p>
                      <p className="text-white font-medium">
                        {order.table ? order.table.name : "Mang đi (Takeaway)"}
                      </p>
                    </div>
                  </div>

                  {(order.customerName || order.customerPhone) && (
                    <div className="bg-slate-800/50 p-3 rounded-xl space-y-2">
                      {order.customerName && (
                        <p className="text-sm text-slate-300 flex items-center gap-2">
                          <User size={14} className="text-slate-500" />{" "}
                          {order.customerName}
                        </p>
                      )}
                      {order.customerPhone && (
                        <p className="text-sm text-slate-300 flex items-center gap-2">
                          <Phone size={14} className="text-slate-500" />{" "}
                          {order.customerPhone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 👇 4. KHU VỰC MỚI: CHI TIẾT MÓN ĂN */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wider">
                        Chi tiết món ({order.orderItems.length})
                      </p>
                      <div className="space-y-2 max-h-32 overflow-y-auto hide-scrollbar pr-2">
                        {order.orderItems.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start text-sm"
                          >
                            <div className="flex gap-2">
                              <span className="font-bold text-slate-500">
                                {item.quantity}x
                              </span>
                              <span className="text-slate-300 font-medium">
                                {/* Ưu tiên đọc menuItem trước, nếu không có thì lùi dần về các biến khác */}
                                {item.menuItem?.name ||
                                  item.menu?.name ||
                                  item.name ||
                                  "Món ăn ngoài Menu"}
                              </span>
                            </div>
                            <span className="text-slate-400 font-medium">
                              {Number(
                                item.price * item.quantity,
                              ).toLocaleString("vi-VN")}{" "}
                              đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">
                      Tổng tiền
                    </p>
                    <p className="text-xl font-black text-emerald-400">
                      {Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {order.status === "PENDING" ||
                    order.status === "COOKING" ||
                    order.status === "PREPARING" ? (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.id, "CANCELLED")
                          }
                          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-bold transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.id, "COMPLETED")
                          }
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg"
                        >
                          Hoàn thành
                        </button>
                      </>
                    ) : (
                      <button className="px-4 py-2 bg-slate-800 text-slate-500 rounded-lg text-sm font-bold cursor-not-allowed">
                        Đã chốt
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
