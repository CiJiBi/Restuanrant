import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: any) {
    const { email, password } = loginDto;

    // 1. Tìm người dùng trong Database
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Email hoặc mật khẩu không chính xác!");
    }

    // 2. Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Email hoặc mật khẩu không chính xác!");
    }

    // 3. Tạo JWT Token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      success: true,
      message: "Đăng nhập thành công",
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          name: (user as any).name || "Quản trị viên",
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  // Hàm tạo tài khoản Admin mẫu
  async registerMockAdmin() {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await this.prisma.user.upsert({
      where: { email: "admin@cijibi.com" },
      update: {},
      create: {
        email: "admin@cijibi.com",
        name: "Admin Quản Trị", // Đã bổ sung trường name bắt buộc
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    return { message: "Tạo tài khoản thành công!", email: user.email };
  }
}
