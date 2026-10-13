"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const menu_module_1 = require("./modules/menu/menu.module");
const orders_module_1 = require("./modules/orders/orders.module");
const auth_module_1 = require("./modules/auth/auth.module");
const table_module_1 = require("./modules/table/table.module");
const prisma_service_1 = require("./prisma/prisma.service");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const staff_module_1 = require("./modules/staff/staff.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const kds_module_1 = require("./modules/kds/kds.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            menu_module_1.MenuModule,
            orders_module_1.OrdersModule,
            auth_module_1.AuthModule,
            table_module_1.TableModule,
            inventory_module_1.InventoryModule,
            staff_module_1.StaffModule,
            attendance_module_1.AttendanceModule,
            dashboard_module_1.DashboardModule,
            kds_module_1.KdsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map