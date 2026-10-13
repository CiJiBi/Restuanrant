import { PrismaService } from "../../prisma/prisma.service";
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
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
            cart: string | null;
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
                printerGroup: string;
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
        customerName: string | null;
        customerPhone: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        tableId: number | null;
        userId: string | null;
        note: string | null;
    })[]>;
    getAllOrders(): Promise<({
        user: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            email: string;
            password: string;
            pinCode: string | null;
            role: string;
            salary: number;
            isActive: boolean;
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
            cart: string | null;
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
                printerGroup: string;
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
        customerName: string | null;
        customerPhone: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        tableId: number | null;
        userId: string | null;
        note: string | null;
    })[]>;
    updateOrderStatus(id: string, status: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
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
    createOrder(data: any): Promise<{
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
                    printerGroup: string;
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
            customerName: string | null;
            customerPhone: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            tableId: number | null;
            userId: string | null;
            note: string | null;
        };
    }>;
}
