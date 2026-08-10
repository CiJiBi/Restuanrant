// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { TransformInterceptor } from "./core/interceptors/transform.interceptor";
import { AllExceptionsFilter } from "./core/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // MỞ CỔNG CORS TẠI ĐÂY
  app.enableCors({
    origin: "http://localhost:3000", // Cho phép Frontend (cổng 3000) truy cập
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  // Security & Middlewares
  app.enableCors();

  // Validation DTO
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Format Response & Error Handling
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle("CIJIBI SaaS API")
    .setDescription("Tài liệu API Backend hệ thống Quản lý Nhà hàng")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document); // Truy cập tại: /docs

  await app.listen(4000);
}
bootstrap();
