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
    }>;
    createMenuItem(data: any): Promise<{
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
    }>;
    updateMenuItem(id: string, data: any): Promise<{
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
    }>;
    getAllCategories(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    deleteMenuItem(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createCategory(name: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
