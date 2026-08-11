import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });
    if (existingUser)
      throw new BadRequestException("Email này đã được sử dụng!");

    const hashedPassword = await bcrypt.hash(authDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: authDto.email,
        password: hashedPassword, // Đổi thành password để khớp với Schema của bạn
        // fullName: 'Người dùng Cijibi', // Bỏ comment nếu Schema của bạn có trường này
        role: "ADMIN",
      },
    });

    return this.generateToken(user.id, user.email, user.role);
  }

  async login(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });
    if (!user) throw new UnauthorizedException("Tài khoản không tồn tại!");

    // So sánh với trường password trong DB
    const isPasswordMatch = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!isPasswordMatch) throw new UnauthorizedException("Sai mật khẩu!");

    return this.generateToken(user.id, user.email, user.role);
  }

  private generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      success: true,
      data: {
        access_token: this.jwtService.sign(payload),
        user: { id: userId, email, role },
      },
    };
  }
}
