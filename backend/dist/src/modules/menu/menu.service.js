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
let MenuService = class MenuService {
    constructor(menuRepo) {
        this.menuRepo = menuRepo;
    }
    async getAllMenuItems(query) {
        return this.menuRepo.findAll(query);
    }
    async createMenuItem(dto) {
        const exist = await this.menuRepo.findAll({ search: dto.itemCode });
        if (exist.items.length > 0) {
            throw new common_1.ConflictException(`Item code ${dto.itemCode} đã tồn tại.`);
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
    async softDeleteMenuItem(id) {
        const item = await this.menuRepo.findById(id);
        if (!item)
            throw new common_1.NotFoundException("Không tìm thấy món ăn");
        return this.menuRepo.softDelete(id);
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [menu_repository_1.MenuRepository])
], MenuService);
//# sourceMappingURL=menu.service.js.map