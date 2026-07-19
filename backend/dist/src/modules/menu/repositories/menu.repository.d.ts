import { PrismaService } from "../../../prisma/prisma.service";
import { IGenericRepository } from "../../../core/base/repository.interface";
import { MenuItem, Prisma } from "@prisma/client";
export declare class MenuRepository implements IGenericRepository<MenuItem> {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        skip?: number;
        take?: number;
        search?: string;
    }): Promise<any>;
    findById(id: string): Promise<MenuItem>;
    create(data: Prisma.MenuItemCreateInput): Promise<MenuItem>;
    update(id: string, data: Prisma.MenuItemUpdateInput): Promise<MenuItem>;
    delete(id: string): Promise<boolean>;
    softDelete(id: string): Promise<boolean>;
}
