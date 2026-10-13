import { PrismaService } from "../../../prisma/prisma.service";
import { IGenericRepository } from "../../../core/base/repository.interface";
export declare class MenuRepository implements IGenericRepository<any> {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params?: {
        search?: string;
        skip?: number;
        take?: number;
    }): Promise<({
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
    findById(id: string): Promise<{
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
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
    delete(id: string): Promise<boolean>;
    softDelete(id: string): Promise<boolean>;
}
