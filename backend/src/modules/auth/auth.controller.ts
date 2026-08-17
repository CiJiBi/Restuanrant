import { Controller, Post, Body, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  // API ẩn để bạn tự tạo tài khoản Admin ban đầu: POST /auth/register-admin
  @Post("register-admin")
  registerAdmin() {
    return this.authService.registerMockAdmin();
  }
  @Get("setup-admin")
  setupAdmin() {
    return this.authService.registerMockAdmin();
  }
}
