import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getAllMenu(): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    createMenuItem(data: any): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    updateMenuItem(id: string, data: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    deleteMenuItem(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAll(search?: string, skip?: number): Promise<({
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
    findOne(id: string): Promise<{
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
    create(createMenuDto: CreateMenuItemDto): Promise<{
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
}
