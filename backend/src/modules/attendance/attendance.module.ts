import { Module } from "@nestjs/common";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";
import { PrismaService } from "../../prisma/prisma.service"; // 👈 1. Import PrismaService vào đây

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, PrismaService], // 👈 2. Bổ sung PrismaService vào mảng providers
})
export class AttendanceModule {}
