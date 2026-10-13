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
exports.TableService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const events_gateway_1 = require("./events.gateway");
let TableService = class TableService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async findAll() {
        const tables = await this.prisma.table.findMany({
            orderBy: { name: "asc" },
        });
        return tables.map((table) => {
            let parsedCart = [];
            if (table.cart) {
                try {
                    parsedCart = JSON.parse(table.cart);
                }
                catch (e) {
                    parsedCart = [];
                }
            }
            return {
                ...table,
                cart: parsedCart,
            };
        });
    }
    async createTable(data) {
        const existing = await this.prisma.table.findUnique({
            where: { name: data.name },
        });
        if (existing) {
            throw new common_1.BadRequestException("Tên bàn này đã tồn tại trong sơ đồ!");
        }
        return await this.prisma.table.create({
            data: {
                name: data.name,
                capacity: Number(data.capacity),
                status: "available",
            },
        });
    }
    async updateStatus(id, status, guestName) {
        const table = await this.prisma.table.findUnique({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException("Không tìm thấy bàn này!");
        if (status === "available") {
            await this.prisma.order.updateMany({
                where: {
                    tableId: id,
                    status: { in: ["PENDING", "PREPARING", "SERVED"] },
                },
                data: { status: "COMPLETED", paymentStatus: "PAID" },
            });
            return await this.prisma.table.update({
                where: { id },
                data: {
                    status: "available",
                    guestName: null,
                    timeSeated: null,
                    cart: null,
                },
            });
        }
        this.eventsGateway.emitOrderUpdate();
        return await this.prisma.table.update({
            where: { id },
            data: {
                status,
                guestName: guestName || "Khách lẻ",
                timeSeated: "Vừa nhận bàn",
            },
        });
    }
    async deleteTable(id) {
        const table = await this.prisma.table.findUnique({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException("Không tìm thấy bàn này!");
        if (table.status !== "available") {
            throw new common_1.BadRequestException("Không thể xóa bàn đang có khách phục vụ hoặc đã đặt trước!");
        }
        return await this.prisma.table.delete({
            where: { id },
        });
    }
    async updateTable(id, data) {
        const table = await this.prisma.table.findUnique({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException("Không tìm thấy bàn này!");
        if (table.status === "occupied") {
            throw new common_1.BadRequestException("Không thể sửa thông tin bàn khi đang có khách!");
        }
        if (data.name && data.name !== table.name) {
            const existing = await this.prisma.table.findUnique({
                where: { name: data.name },
            });
            if (existing) {
                throw new common_1.BadRequestException("Tên bàn này đã tồn tại trong sơ đồ!");
            }
        }
        return await this.prisma.table.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.capacity && { capacity: Number(data.capacity) }),
            },
        });
    }
    async saveOrder(id, items) {
        const table = await this.prisma.table.findUnique({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException("Không tìm thấy bàn này!");
        const activeOrder = await this.prisma.order.findFirst({
            where: { tableId: id, status: { in: ["PENDING", "PREPARING"] } },
            include: { orderItems: true },
        });
        if (activeOrder && activeOrder.status === "PREPARING") {
            for (const oldItem of activeOrder.orderItems) {
                const newItem = items.find((i) => i.id === oldItem.menuItemId);
                if (!newItem || newItem.quantity < oldItem.quantity) {
                    throw new common_1.BadRequestException("Bếp đang làm món, không thể xóa hoặc giảm số lượng món đã gọi!");
                }
            }
        }
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const updatedTable = await this.prisma.table.update({
            where: { id },
            data: {
                status: "occupied",
                guestName: table.guestName || "Khách lẻ",
                timeSeated: table.timeSeated ||
                    new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                cart: JSON.stringify(items),
            },
        });
        if (activeOrder) {
            await this.prisma.orderItem.deleteMany({
                where: { orderId: activeOrder.id },
            });
            await this.prisma.order.update({
                where: { id: activeOrder.id },
                data: {
                    totalAmount,
                    orderItems: {
                        create: items.map((item) => ({
                            menuItemId: item.id,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });
        }
        else {
            const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
            await this.prisma.order.create({
                data: {
                    orderNumber,
                    tableId: id,
                    totalAmount,
                    status: "PENDING",
                    orderItems: {
                        create: items.map((item) => ({
                            menuItemId: item.id,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });
        }
        this.eventsGateway.emitOrderUpdate();
        return updatedTable;
    }
};
exports.TableService = TableService;
exports.TableService = TableService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], TableService);
//# sourceMappingURL=table.service.js.map