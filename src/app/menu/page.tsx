"use client";
import { useEffect, useState } from "react";
import api from "../lib/axios";
// 1. Import Giỏ hàng và Store
import FloatingCart from "../components/FloatingCart";
import { useCartStore } from "../store/useCartStore";

interface Category {
  id: number;
  name: string;
}

interface MenuItem {
  id: string;
  itemCode: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: Category;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Kéo hàm addToCart từ Store ra để sử dụng
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/menu");
        if (response.data && response.data.success) {
          setMenuItems(response.data.data);
        } else {
          setMenuItems(response.data);
        }
      } catch (err) {
        setError("Không thể tải thực đơn. Vui lòng kiểm tra kết nối Backend!");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-blue-600 animate-pulse">
          Đang tải thực đơn từ Cijibi...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <h1 className="mb-8 text-4xl font-extrabold text-gray-800 text-center">
        Thực đơn Cijibi
      </h1>

      {menuItems.length === 0 ? (
        <p className="text-center text-gray-500">
          Chưa có món ăn nào trong hệ thống.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white/30 backdrop-blur-md p-6 shadow-xl border border-white/40 transition-transform hover:scale-105"
            >
              <div className="h-48 w-full rounded-xl bg-gray-200 mb-4 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Chưa có ảnh
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {item.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Mã: {item.itemCode}</p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold text-blue-600">
                  {item.price.toLocaleString("vi-VN")} đ
                </span>
                {/* 3. Nút Chọn gọi hàm addToCart */}
                <button
                  onClick={() => addToCart(item)}
                  className="rounded-full bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition active:scale-95"
                >
                  Chọn
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. COMPONENT GIỎ HÀNG NẰM CHÍNH XÁC Ở ĐÂY */}
      <FloatingCart />
    </div>
  );
}
