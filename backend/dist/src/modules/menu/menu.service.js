"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const menu_repository_1 = require("./repositories/menu.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
let MenuService = class MenuService {
    constructor(menuRepository, prisma) {
        this.menuRepository = menuRepository;
        this.prisma = prisma;
    }
    async findAll(search, skip) {
        return this.menuRepository.findAll({ search, skip, take: 20 });
    }
    async findOne(id) {
        const item = await this.menuRepository.findById(id);
        if (!item)
            throw new common_1.NotFoundException("Không tìm thấy món ăn này!");
        return item;
    }
    async getAllMenu() {
        const data = await this.prisma.menuItem.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data };
    }
    async createMenuItem(data) {
        const newItem = await this.prisma.menuItem.create({
            data,
        });
        return { success: true, data: newItem };
    }
    async updateMenuItem(id, data) {
        const existingItem = await this.prisma.menuItem.findUnique({
            where: { id },
        });
        if (!existingItem) {
            throw new common_1.NotFoundException("Không tìm thấy món ăn này!");
        }
        const updatedItem = await this.prisma.menuItem.update({
            where: { id },
            data,
        });
        return { success: true, message: "Cập nhật thành công", data: updatedItem };
    }
    async create(createMenuDto) {
        try {
            return await this.menuRepository.create(createMenuDto);
        }
        catch (error) {
            if (error.code === "P2002") {
                throw new common_1.BadRequestException("Mã sản phẩm (itemCode) đã tồn tại!");
            }
            throw error;
        }
    }
    async deleteMenuItem(id) {
        const existingItem = await this.prisma.menuItem.findUnique({
            where: { id },
        });
        if (!existingItem) {
            throw new common_1.NotFoundException("Không tìm thấy món ăn này!");
        }
        await this.prisma.menuItem.delete({
            where: { id },
        });
        return { success: true, message: "Đã xóa món ăn thành công" };
    }
    async remove(id) {
        await this.findOne(id);
        return this.menuRepository.softDelete(id);
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [menu_repository_1.MenuRepository,
        prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map