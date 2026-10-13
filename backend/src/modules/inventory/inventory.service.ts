import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Lấy danh sách nguyên liệu
  async getIngredients() {
    return await this.prisma.ingredient.findMany({ orderBy: { name: "asc" } });
  }

  // Thêm nguyên liệu
  async createIngredient(data: any) {
    return await this.prisma.ingredient.create({ data });
  }

  // Lấy công thức của 1 món
  async getRecipe(menuItemId: string) {
    return await this.prisma.recipe.findMany({
      where: { menuItemId },
      include: { ingredient: true }, // Kéo theo tên nguyên liệu
    });
  }

  // Cập nhật công thức cho 1 món (Xóa cũ, chèn mới)
  async saveRecipe(menuItemId: string, recipes: any[]) {
    return await this.prisma.$transaction(async (prisma) => {
      // Xóa công thức cũ
      await prisma.recipe.deleteMany({ where: { menuItemId } });

      // Tạo công thức mới
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
}
