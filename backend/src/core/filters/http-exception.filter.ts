// src/core/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    response.status(status).json({
      success: false,
      message:
        typeof message === "string"
          ? message
          : (message as any).message || "Error",
      statusCode: status,
      data: null,
      errors: typeof message === "object" ? message : [message],
      timestamp: new Date().toISOString(),
      traceId: request.headers["x-trace-id"] || uuidv4(),
    });
  }
}
