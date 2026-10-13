import { PrismaService } from "../../prisma/prisma.service";
import { EventsGateway } from "./events.gateway";
export declare class TableService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    findAll(): Promise<{
        cart: any[];
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
    }[]>;
    createTable(data: {
        name: string;
        capacity: number;
    }): Promise<{
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
    }>;
    updateStatus(id: number, status: string, guestName?: string): Promise<{
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
    }>;
    deleteTable(id: number): Promise<{
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
    }>;
    updateTable(id: number, data: {
        name?: string;
        capacity?: number;
    }): Promise<{
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
    }>;
    saveOrder(id: number, items: any[]): Promise<{
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
    }>;
}
