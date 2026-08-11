import { PrismaService } from "../../prisma/prisma.service";
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllOrders(): Promise<{
        success: boolean;
        data: ({
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
                orderId: string;
                menuItemId: string;
                quantity: number;
                unitPrice: number;
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
        })[];
    }>;
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
}
