import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../../prisma/prisma.service"; // Sửa dòng này để gọi đúng Service
import { JwtStrategy } from "./jwt.strategy";
@Module({
  imports: [
    // Đã xóa PrismaModule ở đây
    JwtModule.register({
      secret: "cijibi_super_secret_key_2026",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy], // Thêm PrismaService vào danh sách cung cấp
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
