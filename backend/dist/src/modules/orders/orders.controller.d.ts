import { OrdersService } from "./orders.service";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
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
}
