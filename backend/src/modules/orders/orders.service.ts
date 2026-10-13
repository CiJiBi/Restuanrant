import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.order.findMany({
      // BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ KÉO DỮ LIỆU BÀN VÀ MÓN ĂN LÊN
      include: {
        table: true,
        orderItems: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
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
    // 1. BỌC THÉP TÌM KIẾM: Dùng findFirst với OR để chấp cả ID thật lẫn mã ORD-xxx từ KDS
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: id }, { orderNumber: id }],
      },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: { recipes: true },
            },
          },
        },
      },
    });

    if (!order) throw new NotFoundException("Không tìm thấy đơn hàng này!");

    // 2. LOGIC TRỪ KHO TỰ ĐỘNG (Thêm điều kiện nhận diện chữ COOKING từ Bếp)
    if (
      (status === "PREPARING" || status === "COOKING") &&
      order.status === "PENDING"
    ) {
      await this.prisma.$transaction(async (prisma) => {
        for (const orderItem of order.orderItems) {
          const orderQuantity = orderItem.quantity;

          // Chống lỗi nếu món ăn không có định lượng (recipes)
          if (orderItem.menuItem?.recipes) {
            for (const recipe of orderItem.menuItem.recipes) {
              const deductAmount = recipe.quantity * orderQuantity;
              await prisma.ingredient.update({
                where: { id: recipe.ingredientId },
                data: { currentStock: { decrement: deductAmount } },
              });
            }
          }
        }

        await prisma.order.update({
          where: { id: order.id }, // Dùng order.id thật vừa tìm được
          data: { status },
        });
      });

      return { message: "Đã nhận làm món và trừ kho thành công!" };
    }

    // 3. Xử lý cho các trạng thái khác (COMPLETED, CANCELLED...)
    return await this.prisma.order.update({
      where: { id: order.id }, // Dùng order.id thật vừa tìm được
      data: { status },
    });
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
