import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Route lấy mã sản phẩm tự động tiếp theo (VD: SP03)
  @Get("next-code")
  @UseGuards(JwtAuthGuard)
  async getNextCode() {
    return await this.menuService.getNextItemCode();
  }

  @Get()
  async findAll() {
    // Sử dụng getAllMenu để lấy đầy đủ kèm category và sắp xếp mới nhất
    return await this.menuService.getAllMenu();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.menuService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createMenuItemDto: CreateMenuItemDto) {
    // Thay đổi từ this.menuService.create thành this.menuService.createMenuItem
    return await this.menuService.createMenuItem(createMenuItemDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() body: any) {
    return await this.menuService.updateMenuItem(id, body);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    return await this.menuService.deleteMenuItem(id);
  }
}
