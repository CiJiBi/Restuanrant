import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";

@ApiTags("Menu (Thực đơn)")
@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Get()
  getAllMenu() {
    return this.menuService.getAllMenu();
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  createMenuItem(@Body() data: any) {
    return this.menuService.createMenuItem(data);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateMenuItem(@Param("id") id: string, @Body() data: any) {
    return this.menuService.updateMenuItem(id, data);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteMenuItem(@Param("id") id: string) {
    return this.menuService.deleteMenuItem(id);
  }
  @Get()
  @ApiOperation({ summary: "Lấy danh sách món ăn" })
  findAll(@Query("search") search?: string, @Query("skip") skip?: number) {
    return this.menuService.findAll(search, skip);
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy chi tiết một món ăn" })
  findOne(@Param("id") id: string) {
    return this.menuService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Thêm món ăn mới (Yêu cầu đăng nhập)" })
  create(@Body() createMenuDto: CreateMenuItemDto) {
    return this.menuService.create(createMenuDto);
  }
}
