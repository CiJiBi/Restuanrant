import { PrismaService } from "../../prisma/prisma.service";
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllOrders(): Promise<({
        details: ({
            menuItem: {
                name: string;
                id: string;
                itemCode: string;
                price: number;
                stock: number;
                status: string;
                imageUrl: string | null;
                isDeleted: boolean;
                categoryId: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            quantity: number;
            unitPrice: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        orderNumber: string;
        customer: string | null;
        tableNumber: string | null;
        totalAmount: number;
        notes: string | null;
    })[]>;
    updateOrderStatus(id: string, status: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            orderNumber: string;
            customer: string | null;
            tableNumber: string | null;
            totalAmount: number;
            notes: string | null;
        };
    }>;
    createOrder(data: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            orderNumber: string;
            customer: string | null;
            tableNumber: string | null;
            totalAmount: number;
            notes: string | null;
        };
    }>;
}
