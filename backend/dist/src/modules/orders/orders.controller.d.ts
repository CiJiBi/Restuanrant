import { OrdersService } from "./orders.service";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getAllOrders(): Promise<({
        user: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            email: string;
            password: string;
            role: string;
        };
        table: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            status: string;
            totalAmount: string | null;
            orderId: string | null;
            capacity: number;
            guestName: string | null;
            timeSeated: string | null;
        };
        orderItems: ({
            menuItem: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                itemCode: string;
                price: import("@prisma/client/runtime/library").Decimal;
                isAvailable: boolean;
                status: string;
                isDeleted: boolean;
                imageUrl: string | null;
                categoryId: number;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: string;
        status: string;
        orderNumber: string;
        paymentStatus: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        tableId: number | null;
        userId: string | null;
        note: string | null;
    })[]>;
    updateStatus(id: string, status: string): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            status: string;
            orderNumber: string;
            paymentStatus: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            tableId: number | null;
            userId: string | null;
            note: string | null;
        };
    }>;
    createOrder(body: any): Promise<{
        success: boolean;
        message: string;
        data: {
            orderItems: ({
                menuItem: {
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    id: string;
                    itemCode: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    isAvailable: boolean;
                    status: string;
                    isDeleted: boolean;
                    imageUrl: string | null;
                    categoryId: number;
                };
            } & {
                createdAt: Date;
                updatedAt: Date;
                id: string;
                price: import("@prisma/client/runtime/library").Decimal;
                quantity: number;
                menuItemId: string;
                orderId: string;
            })[];
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            status: string;
            orderNumber: string;
            paymentStatus: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            tableId: number | null;
            userId: string | null;
            note: string | null;
        };
    }>;
}
