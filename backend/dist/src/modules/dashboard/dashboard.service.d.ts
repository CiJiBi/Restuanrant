import { PrismaService } from "../../prisma/prisma.service";
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverviewData(): Promise<{
        success: boolean;
        data: {
            revenueToday: number;
            totalOrders: number;
            activeTables: string;
            lowStockCount: number;
            weeklyRevenue: any[];
            recentOrders: {
                id: string;
                orderNumber: string;
                tableName: string;
                customerName: string;
                totalAmount: number;
                status: string;
            }[];
        };
    }>;
    private getWeeklyRevenueData;
}
