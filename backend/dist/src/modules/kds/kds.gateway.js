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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KdsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const socket_io_1 = require("socket.io");
let KdsGateway = class KdsGateway {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    afterInit(server) {
        server.use(async (client, next) => {
            try {
                const authToken = client.handshake.auth?.token;
                const authorization = client.handshake.headers.authorization;
                const bearerToken = typeof authorization === "string" && authorization.startsWith("Bearer ") ? authorization.slice(7) : undefined;
                const token = typeof authToken === "string" && authToken.length > 0 ? authToken : bearerToken;
                if (!token)
                    return next(new Error("Unauthorized"));
                const payload = await this.jwtService.verifyAsync(token);
                const user = await this.prisma.user.findUnique({
                    where: { id: payload.sub }, select: { id: true, role: true, isActive: true },
                });
                if (!user || !user.isActive)
                    return next(new Error("Unauthorized"));
                client.data.user = { id: user.id, role: user.role };
                return next();
            }
            catch {
                return next(new Error("Unauthorized"));
            }
        });
    }
    handleConnection(client) {
        console.log("[KDS] Nhân viên đã kết nối: " + (client.data.user?.role || "unknown"));
    }
    handleDisconnect(client) { console.log("[KDS] Ngắt kết nối KDS: " + client.id); }
    handleNewOrder(data, client) {
        if (!["ADMIN", "CASHIER", "WAITER"].includes(client.data.user?.role)) {
            client.emit("authorizationError", { message: "Không có quyền gửi đơn vào bếp." });
            return { status: "forbidden" };
        }
        this.server.emit("receiveNewOrder", data);
        return { status: "ok", message: "Bếp đã nhận lệnh" };
    }
    handleUpdateStatus(data, client) {
        if (!["ADMIN", "CHEF"].includes(client.data.user?.role)) {
            client.emit("authorizationError", { message: "Chỉ nhân viên bếp mới được cập nhật trạng thái món." });
            return { status: "forbidden" };
        }
        this.server.emit("dishStatusUpdated", data);
        return { status: "ok" };
    }
    handleOrderStatusUpdated(client) {
        if (!["ADMIN", "CASHIER", "CHEF", "WAITER"].includes(client.data.user?.role)) {
            client.emit("authorizationError", { message: "Không có quyền gửi sự kiện này." });
            return { status: "forbidden" };
        }
        this.server.emit("orderStatusUpdated");
        return { status: "ok" };
    }
};
exports.KdsGateway = KdsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], KdsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("sendOrderToKitchen"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], KdsGateway.prototype, "handleNewOrder", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("updateDishStatus"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], KdsGateway.prototype, "handleUpdateStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("orderStatusUpdated"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], KdsGateway.prototype, "handleOrderStatusUpdated", null);
exports.KdsGateway = KdsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: process.env.CORS_ORIGIN || "http://localhost:3000" } }),
    __metadata("design:paramtypes", [jwt_1.JwtService, prisma_service_1.PrismaService])
], KdsGateway);
//# sourceMappingURL=kds.gateway.js.map