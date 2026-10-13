import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/guards/roles.guard";
import { Roles } from "../../core/guards/roles.decorator";

@Controller("inventory/ingredients")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "CHEF")
export class InventoryController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() getAll() {
    return this.prisma.ingredient.findMany({ orderBy: { createdAt: "desc" } });
  }
  @Post() create(@Body() body: any) {
    return this.prisma.ingredient.create({ data: { name: body.name, unit: body.unit, currentStock: Number(body.currentStock), minStockLevel: Number(body.minStockLevel) } });
  }
  @Patch(":id") update(@Param("id") id: string, @Body() body: any) {
    return this.prisma.ingredient.update({ where: { id }, data: { name: body.name, unit: body.unit, currentStock: Number(body.currentStock), minStockLevel: Number(body.minStockLevel) } });
  }
  @Delete(":id") delete(@Param("id") id: string) {
    return this.prisma.ingredient.delete({ where: { id } });
  }
  @Get("recipes/:menuId") getRecipeByMenuId(@Param("menuId") menuId: string) {
    return this.prisma.recipe.findMany({ where: { menuItemId: menuId }, include: { ingredient: true } });
  }
  @Post("recipes/:menuId")
  async saveRecipe(@Param("menuId") menuId: string, @Body() body: { items: { ingredientId: string; quantity: number }[] }) {
    await this.prisma.recipe.deleteMany({ where: { menuItemId: menuId } });
    if (body.items && body.items.length > 0) {
      await this.prisma.recipe.createMany({ data: body.items.map((item) => ({ menuItemId: menuId, ingredientId: item.ingredientId, quantity: Number(item.quantity) })) });
    }
    return { message: "Cập nhật công thức thành công!" };
  }
}
