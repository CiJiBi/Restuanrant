import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsGateway } from "./events.gateway";

@Injectable()
export class TableService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll() {
    const tables = await this.prisma.table.findMany({
      orderBy: { name: "asc" },
    });

    // 👇 "Dịch" cột cart từ String sang Array để Frontend đọc được
    return tables.map((table) => {
      let parsedCart = [];
      if (table.cart) {
        try {
          // Ép kiểu ép chuỗi JSON thành mảng thực tế
          parsedCart = JSON.parse(table.cart as string);
        } catch (e) {
          parsedCart = [];
        }
      }
      return {
        ...table,
        cart: parsedCart,
      };
    });
  }
  async createTable(data: { name: string; capacity: number }) {
    const existing = await this.prisma.table.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new BadRequestException("Tên bàn này đã tồn tại trong sơ đồ!");
    }

    return await this.prisma.table.create({
      data: {
        name: data.name,
        capacity: Number(data.capacity),
        status: "available",
      },
    });
  }

  // 👇 Thêm hàm updateStatus này để khớp với Controller
  async updateStatus(id: number, status: string, guestName?: string) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException("Không tìm thấy bàn này!");

    // Nếu thanh toán (status chuyển về available) -> Dọn dẹp bàn & Chốt Order
    if (status === "available") {
      // Tìm và chuyển trạng thái Order của bàn này thành Đã hoàn thành
      await this.prisma.order.updateMany({
        where: {
          tableId: id,
          status: { in: ["PENDING", "PREPARING", "SERVED"] },
        },
        data: { status: "COMPLETED", paymentStatus: "PAID" },
      });

      // XÓA SẠCH giỏ hàng, khách hàng, thời gian ngồi của bàn
      return await this.prisma.table.update({
        where: { id },
        data: {
          status: "available",
          guestName: null,
          timeSeated: null,
          cart: null, // Xóa giỏ hàng cũ
        },
      });
    }
    this.eventsGateway.emitOrderUpdate();
    // Nếu chỉ là mở bàn bình thường
    return await this.prisma.table.update({
      where: { id },
      data: {
        status,
        guestName: guestName || "Khách lẻ",
        timeSeated: "Vừa nhận bàn",
      },
    });
  }

  async deleteTable(id: number) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException("Không tìm thấy bàn này!");

    // Ràng buộc: Chỉ cho phép xóa khi bàn đang trống
    if (table.status !== "available") {
      throw new BadRequestException(
        "Không thể xóa bàn đang có khách phục vụ hoặc đã đặt trước!",
      );
    }

    return await this.prisma.table.delete({
      where: { id },
    });
  }
  async updateTable(id: number, data: { name?: string; capacity?: number }) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException("Không tìm thấy bàn này!");
    if (table.status === "occupied") {
      throw new BadRequestException(
        "Không thể sửa thông tin bàn khi đang có khách!",
      );
    }
    if (data.name && data.name !== table.name) {
      const existing = await this.prisma.table.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        throw new BadRequestException("Tên bàn này đã tồn tại trong sơ đồ!");
      }
    }

    return await this.prisma.table.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.capacity && { capacity: Number(data.capacity) }),
      },
    });
  }
  // Thêm hàm này vào trong class TableService
  async saveOrder(id: number, items: any[]) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException("Không tìm thấy bàn này!");

    // 1. Kiểm tra đơn hàng hiện tại của bàn
    const activeOrder = await this.prisma.order.findFirst({
      where: { tableId: id, status: { in: ["PENDING", "PREPARING"] } },
      include: { orderItems: true },
    });

    // 2. Chặn giảm món nếu bếp đang làm (PREPARING)
    if (activeOrder && activeOrder.status === "PREPARING") {
      for (const oldItem of activeOrder.orderItems) {
        const newItem = items.find((i) => i.id === oldItem.menuItemId);
        if (!newItem || newItem.quantity < oldItem.quantity) {
          throw new BadRequestException(
            "Bếp đang làm món, không thể xóa hoặc giảm số lượng món đã gọi!",
          );
        }
      }
    }

    // 3. Tính tổng tiền TẠI ĐÂY để giải quyết lỗi "No value exists"
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // 4. Lưu giỏ hàng vào Bảng Table
    const updatedTable = await this.prisma.table.update({
      where: { id },
      data: {
        status: "occupied",
        guestName: table.guestName || "Khách lẻ",
        timeSeated:
          table.timeSeated ||
          new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        cart: JSON.stringify(items),
      },
    });

    // 5. Cập nhật hoặc Tạo mới Bảng Order
    if (activeOrder) {
      // Đã có order -> Xóa món cũ, cập nhật món mới
      await this.prisma.orderItem.deleteMany({
        where: { orderId: activeOrder.id },
      });
      await this.prisma.order.update({
        where: { id: activeOrder.id },
        data: {
          totalAmount,
          orderItems: {
            create: items.map((item) => ({
              menuItemId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    } else {
      // Chưa có order -> Tạo mới
      const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      await this.prisma.order.create({
        data: {
          orderNumber,
          tableId: id,
          totalAmount,
          status: "PENDING",
          orderItems: {
            create: items.map((item) => ({
              menuItemId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    }
    this.eventsGateway.emitOrderUpdate();
    return updatedTable;
  }
}
