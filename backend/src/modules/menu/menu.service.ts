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
    return data; // Trả về trực tiếp mảng
  }

  async createMenuItem(data: any) {
    // Ép kiểu dữ liệu an toàn khi tạo mới
    const newItem = await this.prisma.menuItem.create({
      data: {
        itemCode: data.itemCode,
        name: data.name,
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        imageUrl: data.imageUrl || "",
        categoryId: Number(data.categoryId) || 1,
      },
    });
    return newItem;
  }
  // 2. Cập nhật an toàn: Giữ lại giá trị cũ nếu dữ liệu mới không được truyền lên
  async updateMenuItem(id: string, data: any) {
    try {
      const updateData: any = {};

      // ... (Giữ nguyên các dòng ép kiểu của bạn) ...
      if (data.itemCode !== undefined)
        updateData.itemCode = String(data.itemCode);
      if (data.name !== undefined) updateData.name = String(data.name);
      if (data.price !== undefined) updateData.price = Number(data.price);
      if (data.stock !== undefined) updateData.stock = Number(data.stock);
      if (data.imageUrl !== undefined)
        updateData.imageUrl = String(data.imageUrl);
      if (data.categoryId !== undefined && data.categoryId !== "") {
        updateData.categoryId = Number(data.categoryId);
      }

      console.log("Dữ liệu gửi vào Prisma:", updateData); // Kiểm tra dữ liệu trước khi lưu

      const updatedItem = await this.prisma.menuItem.update({
        where: { id },
        data: updateData,
      });

      return updatedItem;
    } catch (error: any) {
      // IN RA TOÀN BỘ CẤU TRÚC LỖI (Mã lỗi, Target, Message...)
      console.error("🚨 LỖI PRISMA CHI TIẾT:", JSON.stringify(error, null, 2));
      throw error;
    }
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
    await this.findOne(id);
    return this.menuRepository.softDelete(id);
  }
}
