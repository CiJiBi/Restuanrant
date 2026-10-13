"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getIngredients() {
        return await this.prisma.ingredient.findMany({ orderBy: { name: "asc" } });
    }
    async createIngredient(data) {
        return await this.prisma.ingredient.create({ data });
    }
    async getRecipe(menuItemId) {
        return await this.prisma.recipe.findMany({
            where: { menuItemId },
            include: { ingredient: true },
        });
    }
    async saveRecipe(menuItemId, recipes) {
        return await this.prisma.$transaction(async (prisma) => {
            await prisma.recipe.deleteMany({ where: { menuItemId } });
            if (recipes && recipes.length > 0) {
                await prisma.recipe.createMany({
                    data: recipes.map((r) => ({
                        menuItemId,
                        ingredientId: r.ingredientId,
                        quantity: r.quantity,
                    })),
                });
            }
            return { message: "Đã lưu công thức!" };
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map