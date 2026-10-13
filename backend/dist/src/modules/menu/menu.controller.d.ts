import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getAllCategories(): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    createCategory(body: {
        name: string;
    }): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    getNextCode(): Promise<string>;
    findAll(): Promise<({
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
    create(createMenuItemDto: CreateMenuItemDto): Promise<{
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
    update(id: string, body: any): Promise<{
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
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
