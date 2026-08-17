import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders() {
    const data = await this.prisma.order.findMany({
      include: {
        details: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    // SỬA Ở ĐÂY: Trả về trực tiếp biến data, không bọc thêm {}
    return data;
  }

  async updateOrderStatus(id: string, status: string) {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
    });
    return { success: true, message: "Cập nhật thành công", data: updated };
  }
  async createOrder(data: any) {
    const orderNum =
      data.orderNumber || `DH-${Math.floor(Math.random() * 10000)}`;

    const newOrder = await this.prisma.order.create({
      data: {
        orderNumber: orderNum,
        totalAmount: data.totalAmount || 0,
        status: data.status || "pending",
        tableNumber: data.tableNumber || "Mang đi",
        customer: data.customer || "Khách vãng lai",

        // 👉 ĐOẠN CODE BỔ SUNG: Yêu cầu Prisma lưu kèm danh sách món ăn vào bảng OrderItem
        details: {
          create:
            data.items?.map((item: any) => ({
              menuItemId: item.id,
              quantity: item.quantity,
              unitPrice: item.price,
            })) || [],
        },
      },
    });
    return {
      success: true,
      message: "Tạo đơn hàng thành công!",
      data: newOrder,
    };
  }
}
