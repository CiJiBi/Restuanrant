import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MenuModule } from "./modules/menu/menu.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { AuthModule } from "./modules/auth/auth.module"; // Thêm dòng này
import { TableModule } from "./modules/table/table.module";
import { PrismaService } from "./prisma/prisma.service";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { StaffModule } from "./modules/staff/staff.module";
import { AttendanceModule } from "./modules/attendance/attendance.module";
import { KdsModule } from "./modules/kds/kds.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
@Module({
  imports: [
    MenuModule,
    OrdersModule,
    AuthModule,
    TableModule,
    InventoryModule,
    StaffModule,
    AttendanceModule,
    DashboardModule,
    KdsModule, // Đăng ký vào đây để Backend biết có API đăng nhập
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
