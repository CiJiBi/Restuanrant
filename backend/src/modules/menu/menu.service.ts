// src/modules/menu/menu.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { MenuRepository } from "./repositories/menu.repository";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";

@Injectable()
export class MenuService {
  constructor(private readonly menuRepo: MenuRepository) {}

  async getAllMenuItems(query: any) {
    return this.menuRepo.findAll(query);
  }

  async createMenuItem(dto: CreateMenuItemDto) {
    // Check Unique Rule
    const exist = await this.menuRepo.findAll({ search: dto.itemCode });
    if (exist.items.length > 0) {
      throw new ConflictException(`Item code ${dto.itemCode} đã tồn tại.`);
    }

    return this.menuRepo.create({
      itemCode: dto.itemCode,
      name: dto.name,
      price: dto.price,
      stock: dto.stock,
      imageUrl: dto.imageUrl,
      category: { connect: { id: dto.categoryId } },
    });
  }

  async softDeleteMenuItem(id: string) {
    const item = await this.menuRepo.findById(id);
    if (!item) throw new NotFoundException("Không tìm thấy món ăn");
    return this.menuRepo.softDelete(id);
  }
}
