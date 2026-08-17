import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders() {
    const data = await this.prisma.order.findMany({
      include: {
        orderItems: {
          include: { menuItem: true },
        },
        table: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
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
      data.orderNumber || `DH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await this.prisma.order.create({
      data: {
        orderNumber: orderNum,
        totalAmount: data.totalAmount || 0,
        status: data.status || "PENDING",
        note:
          data.note || (data.customer ? `Khách: ${data.customer}` : undefined),
        tableId: data.tableId ? Number(data.tableId) : undefined,
        userId: data.userId || undefined,

        // Lưu danh sách món ăn vào bảng OrderItem theo quan hệ orderItems
        orderItems: {
          create:
            data.items?.map((item: any) => ({
              menuItemId: item.id || item.menuItemId,
              quantity: Number(item.quantity) || 1,
              price: Number(item.price) || 0,
            })) || [],
        },
      },
      include: {
        orderItems: {
          include: { menuItem: true },
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
