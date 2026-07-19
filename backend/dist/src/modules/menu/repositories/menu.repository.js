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
exports.MenuRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let MenuRepository = class MenuRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { skip = 0, take = 10, search } = params;
        const where = { isDeleted: false };
        if (search) {
            where.name = { contains: search };
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.menuItem.findMany({
                where,
                skip,
                take,
                include: { category: true },
                orderBy: { createdAt: "desc" },
            }),
            this.prisma.menuItem.count({ where }),
        ]);
        return { items, meta: { total, skip, take } };
    }
    async findById(id) {
        return this.prisma.menuItem.findFirst({ where: { id, isDeleted: false } });
    }
    async create(data) {
        return this.prisma.menuItem.create({ data });
    }
    async update(id, data) {
        return this.prisma.menuItem.update({ where: { id }, data });
    }
    async delete(id) {
        await this.prisma.menuItem.delete({ where: { id } });
        return true;
    }
    async softDelete(id) {
        await this.prisma.menuItem.update({
            where: { id },
            data: { isDeleted: true, status: "Ngừng bán" },
        });
        return true;
    }
};
exports.MenuRepository = MenuRepository;
exports.MenuRepository = MenuRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuRepository);
//# sourceMappingURL=menu.repository.js.map