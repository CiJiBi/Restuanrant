import { PrismaService } from "../../prisma/prisma.service";
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getIngredients(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        currentStock: number;
        minStockLevel: number;
    }[]>;
    createIngredient(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        currentStock: number;
        minStockLevel: number;
    }>;
    getRecipe(menuItemId: string): Promise<({
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
    saveRecipe(menuItemId: string, recipes: any[]): Promise<{
        message: string;
    }>;
}
