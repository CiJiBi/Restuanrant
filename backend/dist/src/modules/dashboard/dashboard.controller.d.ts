import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(): Promise<{
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
}
