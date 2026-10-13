import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  // 1. LẤY DANH SÁCH (Bổ sung lấy trường pinCode)
  async getAllStaff() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        salary: true,
        isActive: true,
        createdAt: true,
        pinCode: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 2. TẠO MỚI (Bổ sung kiểm tra trùng mã PIN)
  async createStaff(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new BadRequestException("Email này đã được sử dụng!");

    if (data.pinCode) {
      const pinExists = await this.prisma.user.findFirst({
        where: { pinCode: data.pinCode },
      });
      if (pinExists)
        throw new BadRequestException(
          "Mã PIN này đã có người sử dụng, vui lòng chọn mã khác!",
        );
    }

    return await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        salary: Number(data.salary) || 0,
        pinCode: data.pinCode || null, // Lưu mã PIN
      },
    });
  }

  // 3. CẬP NHẬT (Bổ sung kiểm tra trùng mã PIN cho người khác)
  async updateStaff(id: string, data: any) {
    if (data.pinCode) {
      // Kiểm tra xem mã PIN mới có bị trùng với ai đó (không phải chính mình) không
      const pinExists = await this.prisma.user.findFirst({
        where: { pinCode: data.pinCode, id: { not: id } },
      });
      if (pinExists)
        throw new BadRequestException(
          "Mã PIN này đã có người sử dụng, vui lòng chọn mã khác!",
        );
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      salary: Number(data.salary) || 0,
      isActive: data.isActive,
      pinCode: data.pinCode || null, // Cập nhật mã PIN
    };

    if (data.password && data.password.trim() !== "") {
      updateData.password = data.password;
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteStaff(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
