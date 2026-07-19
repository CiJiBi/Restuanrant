// backend/src/core/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Tạm thời cho phép tất cả request đi qua để test API.
    // Chúng ta sẽ lắp ghép logic giải mã JWT thực sự vào đây ở Giai đoạn Bảo mật.
    return true;
  }
}
