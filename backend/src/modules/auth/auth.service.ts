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

    // 2. Kiểm tra mật khẩu (Giả định bạn dùng bcrypt để mã hóa)
    // Nếu bạn đang lưu mật khẩu thô (chưa mã hóa), tạm thời dùng: const isPasswordValid = (password === user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Email hoặc mật khẩu không chính xác!");
    }

    // 3. Tạo thẻ từ (JWT Token)
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
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  // Tiện ích: Hàm tạo tài khoản Admin mẫu (để bạn test đăng nhập)
  async registerMockAdmin() {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await this.prisma.user.upsert({
      where: { email: "admin@cijibi.com" },
      update: {},
      create: {
        email: "admin@cijibi.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    return { message: "Tạo tài khoản thành công!", email: user.email };
  }
}
