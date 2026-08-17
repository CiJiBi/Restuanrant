"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllOrders() {
        const data = await this.prisma.order.findMany({
            include: {
                orderItems: {
                    include: { menuItem: true },
                },
                table: true,
                user: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return data;
    }
    async updateOrderStatus(id, status) {
        const updated = await this.prisma.order.update({
            where: { id },
            data: { status },
        });
        return { success: true, message: "Cập nhật thành công", data: updated };
    }
    async createOrder(data) {
        const orderNum = data.orderNumber || `DH-${Math.floor(1000 + Math.random() * 9000)}`;
        const newOrder = await this.prisma.order.create({
            data: {
                orderNumber: orderNum,
                totalAmount: data.totalAmount || 0,
                status: data.status || "PENDING",
                note: data.note || (data.customer ? `Khách: ${data.customer}` : undefined),
                tableId: data.tableId ? Number(data.tableId) : undefined,
                userId: data.userId || undefined,
                orderItems: {
                    create: data.items?.map((item) => ({
                        menuItemId: item.id || item.menuItemId,
                        quantity: Number(item.quantity) || 1,
                        price: Number(item.price) || 0,
                    })) || [],
                },
            },
            include: {
                orderItems: {
                    include: { menuItem: true },
                },
            },
        });
        return {
            success: true,
            message: "Tạo đơn hàng thành công!",
            data: newOrder,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map