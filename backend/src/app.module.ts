import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MenuModule } from "./modules/menu/menu.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { AuthModule } from "./modules/auth/auth.module"; // Thêm dòng này

@Module({
  imports: [
    MenuModule,
    OrdersModule,
    AuthModule, // Đăng ký vào đây để Backend biết có API đăng nhập
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
