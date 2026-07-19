// src/modules/menu/menu.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";

@ApiTags("Menu Management")
@Controller("api/menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({
    summary: "Lấy danh sách món ăn (Hỗ trợ phân trang, tìm kiếm)",
  })
  findAll(@Query("search") search: string, @Query("skip") skip: string) {
    return this.menuService.getAllMenuItems({
      search,
      skip: Number(skip) || 0,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard) // Chỉ Admin có token mới được thêm
  @ApiBearerAuth()
  @ApiOperation({ summary: "Thêm món ăn mới" })
  create(@Body() createMenuDto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(createMenuDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Soft delete món ăn" })
  remove(@Param("id") id: string) {
    return this.menuService.softDeleteMenuItem(id);
  }
}
