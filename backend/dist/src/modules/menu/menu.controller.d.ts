import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    findAll(search: string, skip: string): Promise<any>;
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
