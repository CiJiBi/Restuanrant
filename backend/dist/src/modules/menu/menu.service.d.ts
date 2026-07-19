import { MenuRepository } from "./repositories/menu.repository";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
export declare class MenuService {
    private readonly menuRepo;
    constructor(menuRepo: MenuRepository);
    getAllMenuItems(query: any): Promise<any>;
    createMenuItem(dto: CreateMenuItemDto): Promise<{
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
    softDeleteMenuItem(id: string): Promise<boolean>;
}
