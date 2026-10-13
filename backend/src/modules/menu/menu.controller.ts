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

  // ==============================================================
  // NHÓM 1: QUẢN LÝ DANH MỤC (CATEGORIES)
  // ==============================================================

  // Lấy danh sách danh mục
  @Get("categories")
  async getAllCategories() {
    return await this.menuService.getAllCategories();
  }

  // 👇 ĐÂY CHÍNH LÀ API CÒN THIẾU ĐỂ LƯU DANH MỤC (FIX LỖI 404)
  @Post("categories")
  @UseGuards(JwtAuthGuard) // Bật bảo mật Token cho an toàn
  async createCategory(@Body() body: { name: string }) {
    return await this.menuService.createCategory(body.name);
  }

  // ==============================================================
  // NHÓM 2: QUẢN LÝ MÓN ĂN (MENU ITEMS)
  // ==============================================================

  // Route lấy mã sản phẩm tự động tiếp theo (VD: SP03)
  @Get("next-code")
  @UseGuards(JwtAuthGuard)
  async getNextCode() {
    return await this.menuService.getNextItemCode();
  }

  // Lấy danh sách tất cả món ăn (có kèm category)
  @Get()
  async findAll() {
    return await this.menuService.getAllMenu();
  }

  // Thêm món ăn mới
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return await this.menuService.createMenuItem(createMenuItemDto);
  }

  // ==============================================================
  // NHÓM 3: CÁC ROUTE CÓ CHỨA PARAMETER (:id) - PHẢI ĐỂ CUỐI CÙNG
  // ==============================================================

  // Lấy chi tiết 1 món
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.menuService.findOne(id);
  }

  // Cập nhật món ăn
  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() body: any) {
    return await this.menuService.updateMenuItem(id, body);
  }

  // Xóa món ăn
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    return await this.menuService.deleteMenuItem(id);
  }
}
