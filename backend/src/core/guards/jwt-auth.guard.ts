import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Tự động kích hoạt chiến lược 'jwt' của Passport mỗi khi Guard này được gọi
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
