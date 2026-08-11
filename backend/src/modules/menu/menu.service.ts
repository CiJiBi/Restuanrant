import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { MenuRepository } from "./repositories/menu.repository";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class MenuService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private prisma: PrismaService,
  ) {}

  async findAll(search?: string, skip?: number) {
    return this.menuRepository.findAll({ search, skip, take: 20 });
  }

  async findOne(id: string) {
    const item = await this.menuRepository.findById(id);
    if (!item) throw new NotFoundException("Không tìm thấy món ăn này!");
    return item;
  }
  async getAllMenu() {
    const data = await this.prisma.menuItem.findMany({
      include: { category: true }, // Lấy kèm thông tin danh mục
      orderBy: { createdAt: "desc" }, // Sắp xếp món mới nhất lên đầu
    });
    return { success: true, data };
  }
  async createMenuItem(data: any) {
    const newItem = await this.prisma.menuItem.create({
      data,
    });
    return { success: true, data: newItem };
  }
  async updateMenuItem(id: string, data: any) {
    // Kiểm tra xem món ăn có tồn tại không
    const existingItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });
    if (!existingItem) {
      throw new NotFoundException("Không tìm thấy món ăn này!");
    }

    const updatedItem = await this.prisma.menuItem.update({
      where: { id },
      data,
    });
    return { success: true, message: "Cập nhật thành công", data: updatedItem };
  }
  async create(createMenuDto: CreateMenuItemDto) {
    try {
      return await this.menuRepository.create(createMenuDto);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new BadRequestException("Mã sản phẩm (itemCode) đã tồn tại!");
      }
      throw error;
    }
  }
  async deleteMenuItem(id: string) {
    const existingItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });
    if (!existingItem) {
      throw new NotFoundException("Không tìm thấy món ăn này!");
    }

    await this.prisma.menuItem.delete({
      where: { id },
    });
    return { success: true, message: "Đã xóa món ăn thành công" };
  }
  async remove(id: string) {
    await this.findOne(id); // Kiểm tra xem có tồn tại không trước khi xóa
    return this.menuRepository.softDelete(id);
  }
}
