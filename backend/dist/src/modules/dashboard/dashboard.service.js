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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverviewData() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: today },
                status: "COMPLETED",
            },
        });
        const revenueToday = todayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const totalOrders = todayOrders.length;
        const allTables = await this.prisma.table.findMany();
        const activeTablesCount = allTables.filter((t) => t.status === "occupied").length;
        const totalTablesCount = allTables.length;
        const activeTables = `${activeTablesCount} / ${totalTablesCount}`;
        const ingredients = await this.prisma.ingredient.findMany();
        const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minStockLevel).length;
        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { table: true },
        });
        const weeklyRevenue = await this.getWeeklyRevenueData();
        return {
            success: true,
            data: {
                revenueToday,
                totalOrders,
                activeTables,
                lowStockCount,
                weeklyRevenue,
                recentOrders: recentOrders.map((order) => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    tableName: order.table?.name || "Mang đi",
                    customerName: order.customerName || "Khách lẻ",
                    totalAmount: Number(order.totalAmount),
                    status: order.status,
                })),
            },
        };
    }
    async getWeeklyRevenueData() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const nextDay = new Date(d);
            nextDay.setDate(nextDay.getDate() + 1);
            const dailyOrders = await this.prisma.order.findMany({
                where: {
                    createdAt: { gte: d, lt: nextDay },
                    status: "COMPLETED",
                },
            });
            const dailyTotal = dailyOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            days.push({
                date: d.toLocaleDateString("vi-VN", { weekday: "short" }),
                total: dailyTotal,
            });
        }
        return days;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map