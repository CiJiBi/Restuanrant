import { Module } from "@nestjs/common";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";
import { PrismaService } from "../../prisma/prisma.service"; // 👈 Import Prisma

@Module({
  controllers: [StaffController],
  providers: [StaffService, PrismaService], // 👈 Thêm PrismaService vào đây
})
export class StaffModule {}
