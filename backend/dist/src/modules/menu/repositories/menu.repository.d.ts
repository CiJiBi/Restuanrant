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
    })[]>;
    findById(id: string): Promise<{
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
    }>;
    create(data: any): Promise<{
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
    }>;
    update(id: string, data: any): Promise<{
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
    }>;
    delete(id: string): Promise<boolean>;
    softDelete(id: string): Promise<boolean>;
}
