import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả đơn hàng kèm theo chi tiết món ăn
  async getAllOrders() {
    const data = await this.prisma.order.findMany({
      include: {
        details: {
          // Sử dụng 'details' đúng với schema của bạn
          include: { menuItem: true }, // Lấy kèm thông tin món ăn
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException("Không tìm thấy đơn hàng!");

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
    });
    return {
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: updated,
    };
  }
}
