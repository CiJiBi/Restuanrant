"use client";

import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: string;
  customer?: string;
  tableNumber?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  details: OrderItem[];
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/orders");
      const payload = response.data;

      // Xử lý bóc tách dữ liệu
      if (payload?.data && Array.isArray(payload.data)) {
        setOrders(payload.data);
      } else if (Array.isArray(payload)) {
        setOrders(payload);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách đơn hàng:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm chuyển đổi trạng thái đơn hàng (Đã dọn dẹp hàm thừa)
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      alert("Cập nhật trạng thái thành công!");
      fetchOrders(); // Tải lại danh sách sau khi đổi trạng thái
    } catch (error: any) {
      alert(error.response?.data?.message || "Không thể cập nhật trạng thái!");
    }
  };

  // Hàm hiển thị Badge trạng thái (Đã thêm toUpperCase() để tránh lỗi chữ hoa/thường)
  const renderStatusBadge = (status: string) => {
    const safeStatus = status?.toUpperCase() || "";
    switch (safeStatus) {
      case "PENDING":
        return (
          <span className="px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20 flex items-center gap-1.5 w-fit">
            <Clock size={12} /> Chờ xác nhận
          </span>
        );
      case "PREPARING":
      case "COOKING": // Phòng trường hợp bạn dùng chữ cooking
        return (
          <span className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 flex items-center gap-1.5 w-fit">
            <Truck size={12} /> Đang chuẩn bị
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-3 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1.5 w-fit">
            <CheckCircle size={12} /> Hoàn thành
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-md bg-slate-700/50 text-slate-400 text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-slate-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản lý Đơn hàng
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Theo dõi và cập nhật tiến độ các đơn gọi món của khách hàng.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors"
        >
          🔄 Làm mới dữ liệu
        </button>
      </div>

      {/* Danh sách Đơn hàng */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 bg-slate-800/20">
              <tr>
                <th className="px-6 py-4">MÃ ĐƠN & BÀN</th>
                <th className="px-6 py-4">CHI TIẾT MÓN ĂN</th>
                <th className="px-6 py-4">TỔNG TIỀN</th>
                <th className="px-6 py-4">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải danh sách đơn hàng...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Chưa có đơn hàng nào được ghi nhận trong hệ thống.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  // Đảm bảo chữ hoa để so sánh chính xác
                  const currentStatus = order.status?.toUpperCase() || "";

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-800/40 transition-colors group align-top"
                    >
                      {/* Cột 1: Mã đơn & Bàn */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-white text-sm mb-0.5">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-blue-400 font-medium">
                          {order.tableNumber || "Mang đi (Takeaway)"}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "vi-VN",
                          )}{" "}
                          -{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </td>

                      {/* Cột 2: Chi tiết món */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 max-w-xs">
                          {order.details?.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-slate-300 flex justify-between gap-4"
                            >
                              <span className="font-medium truncate mr-2">
                                • {item.menuItem?.name || "Món ăn"}
                              </span>
                              <span className="text-slate-400 whitespace-nowrap">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Cột 3: Tổng tiền */}
                      <td className="px-6 py-4 font-bold text-green-400">
                        {order.totalAmount?.toLocaleString("vi-VN")}đ
                      </td>

                      {/* Cột 4: Trạng thái */}
                      <td className="px-6 py-4">
                        {renderStatusBadge(order.status)}
                      </td>

                      {/* Cột 5: Hành động đổi trạng thái */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {currentStatus === "PENDING" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "PREPARING")
                              }
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-md shadow-blue-500/20"
                            >
                              Nhận làm món
                            </button>
                          )}
                          {(currentStatus === "PREPARING" ||
                            currentStatus === "COOKING") && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "COMPLETED")
                              }
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg transition-colors shadow-md shadow-green-500/20"
                            >
                              Hoàn tất đơn
                            </button>
                          )}
                          {currentStatus === "COMPLETED" && (
                            <span className="text-xs text-slate-500 italic">
                              Đã xong
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
