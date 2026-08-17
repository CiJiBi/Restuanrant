import { MenuRepository } from "./repositories/menu.repository";
import { PrismaService } from "../../prisma/prisma.service";
export declare class MenuService {
    private readonly menuRepository;
    private prisma;
    constructor(menuRepository: MenuRepository, prisma: PrismaService);
    getNextItemCode(): Promise<string>;
    getAllMenu(): Promise<({
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        itemCode: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        status: string;
        isDeleted: boolean;
        imageUrl: string | null;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        itemCode: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        status: string;
        isDeleted: boolean;
        imageUrl: string | null;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createMenuItem(data: any): Promise<{
        id: string;
        itemCode: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        status: string;
        isDeleted: boolean;
        imageUrl: string | null;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMenuItem(id: string, data: any): Promise<{
        id: string;
        itemCode: string;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        status: string;
        isDeleted: boolean;
        imageUrl: string | null;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteMenuItem(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
