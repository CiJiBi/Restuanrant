import { MenuRepository } from "./repositories/menu.repository";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
export declare class MenuService {
    private readonly menuRepository;
    constructor(menuRepository: MenuRepository);
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
    remove(id: string): Promise<boolean>;
}
