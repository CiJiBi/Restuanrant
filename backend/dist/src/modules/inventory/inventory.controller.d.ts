import { PrismaService } from "../../prisma/prisma.service";
export declare class InventoryController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        currentStock: number;
        minStockLevel: number;
    }[]>;
    create(body: any): import("@prisma/client").Prisma.Prisma__IngredientClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        currentStock: number;
        minStockLevel: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: any): import("@prisma/client").Prisma.Prisma__IngredientClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        currentStock: number;
        minStockLevel: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: string): import("@prisma/client").Prisma.Prisma__IngredientClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        currentStock: number;
        minStockLevel: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getRecipeByMenuId(menuId: string): import("@prisma/client").Prisma.PrismaPromise<({
        ingredient: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            unit: string;
            currentStock: number;
            minStockLevel: number;
        };
    } & {
        id: string;
        quantity: number;
        menuItemId: string;
        ingredientId: string;
    })[]>;
    saveRecipe(menuId: string, body: {
        items: {
            ingredientId: string;
            quantity: number;
        }[];
    }): Promise<{
        message: string;
    }>;
}
