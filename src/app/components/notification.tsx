"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

// 1. Định nghĩa các kiểu dữ liệu
export type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

interface NotificationContextType {
  toast: (type: NotificationType, title: string, message?: string) => void;
}

// 2. Khởi tạo Context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// 3. Hook sử dụng nhanh
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification phải được dùng trong NotificationProvider",
    );
  return context;
};

// 4. Provider Component
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Hàm thêm thông báo mới
  const toast = useCallback(
    (type: NotificationType, title: string, message?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setNotifications((prev) => [...prev, { id, type, title, message }]);

      // Tự động tắt sau 4 giây
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
    },
    [],
  );

  // Hàm tắt chủ động bằng nút X
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ toast }}>
      {children}

      {/* Container hiển thị thông báo (Cố định ở góc dưới phải) */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onClose={() => removeNotification(n.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

// 5. Component giao diện cho từng thẻ thông báo
function NotificationCard({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const { type, title, message } = notification;

  // Cấu hình giao diện theo loại thông báo
  const config = {
    success: {
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    info: {
      icon: Info,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  }[type];

  const Icon = config.icon;

  return (
    <motion.div
      layout // Giúp các thẻ tự động trượt lên mượt mà khi thẻ bên dưới biến mất
      initial={{ opacity: 0, x: 50, scale: 0.9 }} // Hiệu ứng xuất hiện từ bên phải
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`glass-card relative w-80 p-4 rounded-2xl border-l-4 pointer-events-auto shadow-2xl backdrop-blur-xl ${config.border} border-y-white/5 border-r-white/5 bg-slate-900/80 dark:bg-slate-900/80 overflow-hidden group`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-1.5 rounded-full ${config.bg} ${config.color} shrink-0 mt-0.5`}
        >
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h4 className="text-sm font-bold text-white dark:text-white">
            {title}
          </h4>
          {message && (
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Nút đóng */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={16} />
      </button>

      {/* Thanh Progress chạy lùi (Trang trí UX) */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-0.5 ${config.color} opacity-50`}
        style={{ backgroundColor: "currentColor" }}
      />
    </motion.div>
  );
}
