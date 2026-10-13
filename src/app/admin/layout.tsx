"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Grid,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  TrendingUp,
  Package,
  Users,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Thống kê", href: "/admin/analytics", icon: TrendingUp },
  { name: "Thực đơn", href: "/admin/menu", icon: UtensilsCrossed },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingBag },
  { name: "Sơ đồ bàn", href: "/admin/tables", icon: Grid },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },
  { name: "Nhân viên", href: "/admin/staff", icon: Users },
  { name: "Quản lý kho", href: "/admin/inventory", icon: Package },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("cijibi_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 flex overflow-hidden w-screen">
      {/* Background Glow */}
      <div className="bg-glow-blue top-[-20%] left-[-10%] opacity-30 fixed pointer-events-none"></div>

      {/* SIDEBAR CHUẨN DUY NHẤT */}
      <aside
        className={`h-screen transition-all duration-300 ease-in-out shrink-0 ${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col z-50`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center border-b border-slate-800 px-4 shrink-0 overflow-hidden">
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)] shrink-0">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold tracking-wide whitespace-nowrap">
                CIJIBI Admin
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-none">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium whitespace-nowrap text-sm">
                    {link.name}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Nút Đăng xuất */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all mt-4 border-t border-slate-800/60 pt-4"
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && (
              <span className="font-medium whitespace-nowrap text-sm">
                Đăng xuất
              </span>
            )}
          </button>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-6 bg-slate-900/30 backdrop-blur-md border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50"
            >
              <Menu size={22} />
            </button>

            {/* Search Box */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0F172A]"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] cursor-pointer">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-sm font-bold">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content (Nơi hiển thị các file page.tsx của từng mục) */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
