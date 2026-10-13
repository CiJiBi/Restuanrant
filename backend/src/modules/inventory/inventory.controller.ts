import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service"; // Đảm bảo đường dẫn tới Prisma đúng

@Controller("inventory/ingredients")
export class InventoryController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAll() {
    return await this.prisma.ingredient.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  @Post()
  async create(@Body() body: any) {
    return await this.prisma.ingredient.create({
      data: {
        name: body.name,
        unit: body.unit,
        currentStock: Number(body.currentStock),
        minStockLevel: Number(body.minStockLevel),
      },
    });
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: any) {
    return await this.prisma.ingredient.update({
      where: { id },
      data: {
        name: body.name,
        unit: body.unit,
        currentStock: Number(body.currentStock),
        minStockLevel: Number(body.minStockLevel),
      },
    });
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.prisma.ingredient.delete({ where: { id } });
  }
  // API Lấy chi tiết công thức của 1 món ăn
  @Get("recipes/:menuId")
  async getRecipeByMenuId(@Param("menuId") menuId: string) {
    return await this.prisma.recipe.findMany({
      where: { menuItemId: menuId },
      include: { ingredient: true },
    });
  }

  // API Lưu/Cập nhật công thức cho món ăn
  @Post("recipes/:menuId")
  async saveRecipe(
    @Param("menuId") menuId: string,
    @Body() body: { items: { ingredientId: string; quantity: number }[] },
  ) {
    // Xóa toàn bộ công thức cũ của món này
    await this.prisma.recipe.deleteMany({ where: { menuItemId: menuId } });

    // Thêm công thức mới
    if (body.items && body.items.length > 0) {
      await this.prisma.recipe.createMany({
        data: body.items.map((item) => ({
          menuItemId: menuId,
          ingredientId: item.ingredientId,
          quantity: Number(item.quantity),
        })),
      });
    }
    return { message: "Cập nhật công thức thành công!" };
  }
}
