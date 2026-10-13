import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";

const safeUserSelect = { id: true, name: true, email: true, role: true, salary: true, isActive: true, createdAt: true, pinCode: true };

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStaff() {
    return this.prisma.user.findMany({ select: safeUserSelect, orderBy: { createdAt: "desc" } });
  }

  async createStaff(data: any) {
    if (typeof data.password !== "string" || data.password.length < 8) {
      throw new BadRequestException("Mật khẩu phải có ít nhất 8 ký tự.");
    }
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException("Email này đã được sử dụng!");
    if (data.pinCode) {
      const pinExists = await this.prisma.user.findFirst({ where: { pinCode: data.pinCode } });
      if (pinExists) throw new BadRequestException("Mã PIN này đã có người sử dụng, vui lòng chọn mã khác!");
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: { name: data.name, email: data.email, password: hashedPassword, role: data.role, salary: Number(data.salary) || 0, pinCode: data.pinCode || null },
      select: safeUserSelect,
    });
  }

  async updateStaff(id: string, data: any) {
    if (data.pinCode) {
      const pinExists = await this.prisma.user.findFirst({ where: { pinCode: data.pinCode, id: { not: id } } });
      if (pinExists) throw new BadRequestException("Mã PIN này đã có người sử dụng, vui lòng chọn mã khác!");
    }
    const updateData: any = {
      name: data.name, email: data.email, role: data.role,
      salary: Number(data.salary) || 0, isActive: data.isActive, pinCode: data.pinCode || null,
    };
    if (typeof data.password === "string" && data.password.trim() !== "") {
      if (data.password.length < 8) throw new BadRequestException("Mật khẩu phải có ít nhất 8 ký tự.");
      updateData.password = await bcrypt.hash(data.password, 12);
    }
    return this.prisma.user.update({ where: { id }, data: updateData, select: safeUserSelect });
  }

  async deleteStaff(id: string) {
    return this.prisma.user.delete({ where: { id }, select: { id: true, name: true, email: true, role: true } });
  }
}
