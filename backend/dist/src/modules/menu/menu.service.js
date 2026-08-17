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
    async getNextItemCode() {
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
    async findOne(id) {
        const item = await this.prisma.menuItem.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!item)
            throw new common_1.NotFoundException("Không tìm thấy món ăn này!");
        return item;
    }
    async createMenuItem(data) {
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
                    isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
                    imageUrl: data.imageUrl || "",
                    categoryId: category.id,
                },
            });
            return newItem;
        }
        catch (error) {
            if (error.code === "P2002") {
                throw new common_1.BadRequestException("Mã sản phẩm (itemCode) này đã tồn tại trong hệ thống!");
            }
            console.error("🚨 LỖI KHI TẠO MÓN:", error);
            throw error;
        }
    }
    async updateMenuItem(id, data) {
        try {
            const updateData = {};
            if (data.itemCode !== undefined)
                updateData.itemCode = String(data.itemCode);
            if (data.name !== undefined)
                updateData.name = String(data.name);
            if (data.price !== undefined) {
                const parsedPrice = Number(data.price);
                if (isNaN(parsedPrice) || parsedPrice <= 0) {
                    throw new common_1.BadRequestException("Giá bán phải lớn hơn 0!");
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
        }
        catch (error) {
            console.error("🚨 LỖI PRISMA CHI TIẾT:", error.message);
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
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [menu_repository_1.MenuRepository,
        prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map