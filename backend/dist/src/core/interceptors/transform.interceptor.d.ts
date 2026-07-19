import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
export interface Response<T> {
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
    errors: any[];
    timestamp: string;
    traceId: string;
}
export declare class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
}
