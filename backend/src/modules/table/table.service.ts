import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.table.findMany({
      orderBy: { name: "asc" },
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

    return await this.prisma.table.update({
      where: { id },
      data: {
        status,
        guestName: guestName || (status === "available" ? null : "Khách lẻ"),
        timeSeated: status === "available" ? null : "Vừa nhận bàn",
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
}
