import { TableService } from "./table.service";
export declare class TableController {
    private readonly tableService;
    constructor(tableService: TableService);
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
    create(body: {
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
    updateStatus(id: string, body: {
        status: string;
        guestName?: string;
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
    delete(id: string): Promise<{
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
    update(id: string, body: {
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
    saveOrder(id: string, body: {
        items: any[];
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
}
