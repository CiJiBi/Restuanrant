import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async handleKioskScan(pinCode: string) {
    // 1. Tìm nhân viên bằng mã PIN
    const user = await this.prisma.user.findFirst({ where: { pinCode } });
    if (!user) {
      throw new NotFoundException("Mã PIN không tồn tại!");
    }
    if (!user.isActive) {
      throw new BadRequestException("Tài khoản nhân viên đã bị khóa!");
    }

    // Lấy ngày hôm nay (từ 00:00:00 đến 23:59:59) để kiểm tra xem đã chấm công chưa
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 2. Kiểm tra xem hôm nay nhân viên này đã Check-in chưa?
    const existingRecord = await this.prisma.attendance.findFirst({
      where: {
        userId: user.id,
        checkIn: { gte: startOfDay, lte: endOfDay },
        checkOut: null, // Tìm bản ghi chưa Check-out
      },
    });

    if (existingRecord) {
      // 3A. ĐÃ CHECK-IN -> TIẾN HÀNH CHECK-OUT
      await this.prisma.attendance.update({
        where: { id: existingRecord.id },
        data: { checkOut: new Date() },
      });
      return {
        success: true,
        action: "CHECK_OUT",
        message: `Tạm biệt ${user.name}, đã Check-out thành công!`,
      };
    } else {
      // 3B. CHƯA CHECK-IN HOẶC ĐÃ CHECK-OUT XONG TRƯỚC ĐÓ -> TẠO CHECK-IN MỚI
      await this.prisma.attendance.create({
        data: {
          userId: user.id,
          checkIn: new Date(),
          date: new Date(),
        },
      });
      return {
        success: true,
        action: "CHECK_IN",
        message: `Xin chào ${user.name}, đã Check-in vào ca thành công!`,
      };
    }
  }
}
