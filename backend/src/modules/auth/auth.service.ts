import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException("Email hoặc mật khẩu không chính xác!");
    }
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch {
      // Legacy records may contain plaintext passwords from earlier versions.
    }

    // One-time migration for legacy plaintext records: hash immediately on successful login.
    const looksLikeBcryptHash = /^\$2[aby]\$\d{2}\$/.test(user.password);
    if (!isPasswordValid && !looksLikeBcryptHash && user.password === password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException("Email hoặc mật khẩu không chính xác!");
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      success: true,
      message: "Đăng nhập thành công",
      data: {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, name: user.name || "Nhân viên", email: user.email, role: user.role },
      },
    };
  }
}
