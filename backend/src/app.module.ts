import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MenuModule } from "./modules/menu/menu.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { AuthModule } from "./modules/auth/auth.module"; // Thêm dòng này
import { TableModule } from "./modules/table/table.module";
import { PrismaService } from "./prisma/prisma.service";
@Module({
  imports: [
    MenuModule,
    OrdersModule,
    AuthModule,
    TableModule, // Đăng ký vào đây để Backend biết có API đăng nhập
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
