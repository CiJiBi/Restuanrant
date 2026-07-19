import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
// Đã xóa import uuid, thay bằng thư viện mặc định của NodeJS
import * as crypto from "crypto";

export interface Response<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  errors: any[];
  timestamp: string;
  traceId: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: "Success",
        statusCode: response.statusCode,
        data: data?.items ? data.items : data,
        pagination: data?.meta ? data.meta : undefined,
        errors: [],
        timestamp: new Date().toISOString(),
        // Sử dụng randomUUID() có sẵn của NodeJS
        traceId: crypto.randomUUID(),
      })),
    );
  }
}
