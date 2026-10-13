import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverviewData() {
    // 1. MỐC THỜI GIAN HÔM NAY
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. DOANH THU & SỐ ĐƠN (HÔM NAY)
    const todayOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: today },
        status: "COMPLETED",
      },
    });
    const revenueToday = todayOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );
    const totalOrders = todayOrders.length;

    // 3. SỐ BÀN ĐANG PHỤC VỤ (12 / 24)
    const allTables = await this.prisma.table.findMany();
    const activeTablesCount = allTables.filter(
      (t) => t.status === "occupied",
    ).length;
    const totalTablesCount = allTables.length;
    const activeTables = `${activeTablesCount} / ${totalTablesCount}`;

    // 4. MÓN ĂN SẴN SÀNG / CẢNH BÁO KHO TỔNG HỢP
    // Chế độ Hybrid: Báo số lượng nguyên liệu đang sắp hết thay vì đếm món
    const ingredients = await this.prisma.ingredient.findMany();
    const lowStockCount = ingredients.filter(
      (i) => i.currentStock <= i.minStockLevel,
    ).length;

    // 5. ĐƠN HÀNG MỚI NHẤT (Cột bên phải)
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { table: true },
    });

    // 6. DỮ LIỆU BIỂU ĐỒ DOANH THU 7 NGÀY (Cột bên trái)
    const weeklyRevenue = await this.getWeeklyRevenueData();

    return {
      success: true,
      data: {
        revenueToday,
        totalOrders,
        activeTables,
        lowStockCount,
        weeklyRevenue,
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          tableName: order.table?.name || "Mang đi",
          customerName: order.customerName || "Khách lẻ",
          totalAmount: Number(order.totalAmount),
          status: order.status,
        })),
      },
    };
  }

  // Hàm phụ trợ tính toán biểu đồ 7 ngày qua
  private async getWeeklyRevenueData() {
    const days = [];
    // Quét lùi 7 ngày
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const dailyOrders = await this.prisma.order.findMany({
        where: {
          createdAt: { gte: d, lt: nextDay },
          status: "COMPLETED",
        },
      });

      const dailyTotal = dailyOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      );

      days.push({
        date: d.toLocaleDateString("vi-VN", { weekday: "short" }), // VD: "T2", "T3"
        total: dailyTotal,
      });
    }
    return days;
  }
}
