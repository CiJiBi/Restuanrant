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

  async getNextItemCode(): Promise<string> {
    const items = await this.prisma.menuItem.findMany({
      select: { itemCode: true },
    });

    let maxNumber = 0;
    for (const item of items) {
      const match = item.itemCode.match(/SP(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    }

    const nextNumber = maxNumber + 1;
    return `SP${String(nextNumber).padStart(2, "0")}`;
  }

  async getAllMenu() {
    return await this.prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!item) throw new NotFoundException("Không tìm thấy món ăn này!");
    return item;
  }

  async createMenuItem(data: any) {
    try {
      const targetCategoryId = Number(data.categoryId) || 1;

      let category = await this.prisma.category.findUnique({
        where: { id: targetCategoryId },
      });

      if (!category) {
        category = await this.prisma.category.create({
          data: { name: "Món chính" },
        });
      }

      const newItem = await this.prisma.menuItem.create({
        data: {
          itemCode: data.itemCode,
          name: data.name,
          price: Number(data.price) || 0,
          isAvailable:
            data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
          imageUrl: data.imageUrl || "",
          categoryId: category.id,
        },
      });

      return newItem;
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new BadRequestException(
          "Mã sản phẩm (itemCode) này đã tồn tại trong hệ thống!",
        );
      }
      console.error("🚨 LỖI KHI TẠO MÓN:", error);
      throw error;
    }
  }

  async updateMenuItem(id: string, data: any) {
    try {
      const updateData: any = {};

      if (data.itemCode !== undefined)
        updateData.itemCode = String(data.itemCode);
      if (data.name !== undefined) updateData.name = String(data.name);
      if (data.price !== undefined) {
        const parsedPrice = Number(data.price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          throw new BadRequestException("Giá bán phải lớn hơn 0!");
        }
        updateData.price = parsedPrice;
      }

      if (data.isAvailable !== undefined) {
        updateData.isAvailable =
          data.isAvailable === true || data.isAvailable === "true";
      }

      if (data.imageUrl !== undefined)
        updateData.imageUrl = String(data.imageUrl);

      if (data.categoryId !== undefined && data.categoryId !== "") {
        updateData.categoryId = Number(data.categoryId);
      }

      console.log("Dữ liệu cập nhật vào Prisma:", updateData);

      const updatedItem = await this.prisma.menuItem.update({
        where: { id },
        data: updateData,
      });

      return updatedItem;
    } catch (error: any) {
      // Đã sửa 'massage' thành 'message' chuẩn xác
      console.error("🚨 LỖI PRISMA CHI TIẾT:", error.message);
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
}
