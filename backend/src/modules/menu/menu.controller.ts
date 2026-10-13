import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../../core/guards/roles.guard";
import { Roles } from "../../core/guards/roles.decorator";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Get("categories") getAllCategories() { return this.menuService.getAllCategories(); }
  @Post("categories")
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CHEF")
  createCategory(@Body() body: { name: string }) { return this.menuService.createCategory(body.name); }
  @Get("next-code")
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CHEF")
  getNextCode() { return this.menuService.getNextItemCode(); }
  @Get() findAll() { return this.menuService.getAllMenu(); }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CHEF")
  create(@Body() dto: CreateMenuItemDto) { return this.menuService.createMenuItem(dto); }
  @Get(":id") findOne(@Param("id") id: string) { return this.menuService.findOne(id); }
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CHEF")
  update(@Param("id") id: string, @Body() body: any) { return this.menuService.updateMenuItem(id, body); }
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CHEF")
  delete(@Param("id") id: string) { return this.menuService.deleteMenuItem(id); }
}
