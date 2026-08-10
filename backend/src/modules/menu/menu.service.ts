import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { MenuRepository } from "./repositories/menu.repository";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  async findAll(search?: string, skip?: number) {
    return this.menuRepository.findAll({ search, skip, take: 20 });
  }

  async findOne(id: string) {
    const item = await this.menuRepository.findById(id);
    if (!item) throw new NotFoundException("Không tìm thấy món ăn này!");
    return item;
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

  async remove(id: string) {
    await this.findOne(id); // Kiểm tra xem có tồn tại không trước khi xóa
    return this.menuRepository.softDelete(id);
  }
}
