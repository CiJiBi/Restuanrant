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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AttendanceService = class AttendanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleKioskScan(pinCode) {
        const user = await this.prisma.user.findFirst({ where: { pinCode } });
        if (!user) {
            throw new common_1.NotFoundException("Mã PIN không tồn tại!");
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException("Tài khoản nhân viên đã bị khóa!");
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const existingRecord = await this.prisma.attendance.findFirst({
            where: {
                userId: user.id,
                checkIn: { gte: startOfDay, lte: endOfDay },
                checkOut: null,
            },
        });
        if (existingRecord) {
            await this.prisma.attendance.update({
                where: { id: existingRecord.id },
                data: { checkOut: new Date() },
            });
            return {
                success: true,
                action: "CHECK_OUT",
                message: `Tạm biệt ${user.name}, đã Check-out thành công!`,
            };
        }
        else {
            await this.prisma.attendance.create({
                data: {
                    userId: user.id,
                    checkIn: new Date(),
                    date: new Date(),
                },
            });
            return {
                success: true,
                action: "CHECK_IN",
                message: `Xin chào ${user.name}, đã Check-in vào ca thành công!`,
            };
        }
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map