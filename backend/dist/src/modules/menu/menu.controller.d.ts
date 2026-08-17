import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getNextCode(): Promise<string>;
    findAll(): Promise<({
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
    create(createMenuItemDto: CreateMenuItemDto): Promise<{
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
    update(id: string, body: any): Promise<{
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
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
