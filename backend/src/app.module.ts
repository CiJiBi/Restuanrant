import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MenuModule } from "./modules/menu/menu.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { AuthModule } from "./modules/auth/auth.module";
@Module({
  imports: [MenuModule, OrdersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
