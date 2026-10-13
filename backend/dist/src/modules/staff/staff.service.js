"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
const safeUserSelect = { id: true, name: true, email: true, role: true, salary: true, isActive: true, createdAt: true, pinCode: true };
let StaffService = class StaffService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllStaff() {
        return this.prisma.user.findMany({ select: safeUserSelect, orderBy: { createdAt: "desc" } });
    }
    async createStaff(data) {
        if (typeof data.password !== "string" || data.password.length < 8) {
            throw new common_1.BadRequestException("Mật khẩu phải có ít nhất 8 ký tự.");
        }
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.BadRequestException("Email này đã được sử dụng!");
        if (data.pinCode) {
            const pinExists = await this.prisma.user.findFirst({ where: { pinCode: data.pinCode } });
            if (pinExists)
                throw new common_1.BadRequestException("Mã PIN này đã có người sử dụng, vui lòng chọn mã khác!");
        }
        const hashedPassword = await bcrypt.hash(data.password, 12);
        return this.prisma.user.create({
            data: { name: data.name, email: data.email, password: hashedPassword, role: data.role, salary: Number(data.salary) || 0, pinCode: data.pinCode || null },
            select: safeUserSelect,
        });
    }
    async updateStaff(id, data) {
        if (data.pinCode) {
            const pinExists = await this.prisma.user.findFirst({ where: { pinCode: data.pinCode, id: { not: id } } });
            if (pinExists)
                throw new common_1.BadRequestException("Mã PIN này đã có người sử dụng, vui lòng chọn mã khác!");
        }
        const updateData = {
            name: data.name, email: data.email, role: data.role,
            salary: Number(data.salary) || 0, isActive: data.isActive, pinCode: data.pinCode || null,
        };
        if (typeof data.password === "string" && data.password.trim() !== "") {
            if (data.password.length < 8)
                throw new common_1.BadRequestException("Mật khẩu phải có ít nhất 8 ký tự.");
            updateData.password = await bcrypt.hash(data.password, 12);
        }
        return this.prisma.user.update({ where: { id }, data: updateData, select: safeUserSelect });
    }
    async deleteStaff(id) {
        return this.prisma.user.delete({ where: { id }, select: { id: true, name: true, email: true, role: true } });
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaffService);
//# sourceMappingURL=staff.service.js.map