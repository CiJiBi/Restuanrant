import { MenuRepository } from "./repositories/menu.repository";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { PrismaService } from "../../prisma/prisma.service";
export declare class MenuService {
    private readonly menuRepository;
    private prisma;
    constructor(menuRepository: MenuRepository, prisma: PrismaService);
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
    deleteMenuItem(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: string): Promise<boolean>;
}
