import { OrdersService } from "./orders.service";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
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
    updateStatus(id: string, status: string): Promise<{
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
    createOrder(body: any): Promise<{
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
