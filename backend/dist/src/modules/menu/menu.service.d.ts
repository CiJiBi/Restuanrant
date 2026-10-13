import { MenuRepository } from "./repositories/menu.repository";
import { PrismaService } from "../../prisma/prisma.service";
export declare class MenuService {
    private readonly menuRepository;
    private prisma;
    constructor(menuRepository: MenuRepository, prisma: PrismaService);
    getNextItemCode(): Promise<string>;
    getAllMenu(): Promise<({
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
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
    }>;
    createMenuItem(data: any): Promise<{
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
    }>;
    updateMenuItem(id: string, data: any): Promise<{
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
    }>;
    getAllCategories(): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    deleteMenuItem(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createCategory(name: string): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
