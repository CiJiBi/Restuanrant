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
            description: string | null;
            id: number;
        };
    } & {
        name: string;
        id: string;
        itemCode: string;
        price: number;
        stock: number;
        status: string;
        imageUrl: string | null;
        isDeleted: boolean;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<{
        category: {
            name: string;
            description: string | null;
            id: number;
        };
    } & {
        name: string;
        id: string;
        itemCode: string;
        price: number;
        stock: number;
        status: string;
        imageUrl: string | null;
        isDeleted: boolean;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: any): Promise<{
        name: string;
        id: string;
        itemCode: string;
        price: number;
        stock: number;
        status: string;
        imageUrl: string | null;
        isDeleted: boolean;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        name: string;
        id: string;
        itemCode: string;
        price: number;
        stock: number;
        status: string;
        imageUrl: string | null;
        isDeleted: boolean;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<boolean>;
    softDelete(id: string): Promise<boolean>;
}
