import { OrdersService } from "./orders.service";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getAllOrders(): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
        table: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            totalAmount: string | null;
            orderId: string | null;
            capacity: number;
            guestName: string | null;
            timeSeated: string | null;
            cart: string | null;
        };
        orderItems: ({
            menuItem: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                itemCode: string;
                price: import("@prisma/client/runtime/library").Decimal;
                isAvailable: boolean;
                status: string;
                isDeleted: boolean;
                imageUrl: string | null;
                categoryId: number;
                printerGroup: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        orderNumber: string;
        paymentStatus: string;
        customerName: string | null;
        customerPhone: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        tableId: number | null;
        userId: string | null;
        note: string | null;
    })[]>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        orderNumber: string;
        paymentStatus: string;
        customerName: string | null;
        customerPhone: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        tableId: number | null;
        userId: string | null;
        note: string | null;
    } | {
        message: string;
    }>;
    createOrder(body: any): Promise<{
        success: boolean;
        message: string;
        data: {
            orderItems: ({
                menuItem: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    itemCode: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    isAvailable: boolean;
                    status: string;
                    isDeleted: boolean;
                    imageUrl: string | null;
                    categoryId: number;
                    printerGroup: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                quantity: number;
                menuItemId: string;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            orderNumber: string;
            paymentStatus: string;
            customerName: string | null;
            customerPhone: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            tableId: number | null;
            userId: string | null;
            note: string | null;
        };
    }>;
}
