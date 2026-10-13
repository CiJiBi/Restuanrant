"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KdsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const prisma_service_1 = require("../../prisma/prisma.service");
const kds_gateway_1 = require("./kds.gateway");
let KdsModule = class KdsModule {
};
exports.KdsModule = KdsModule;
exports.KdsModule = KdsModule = __decorate([
    (0, common_1.Module)({ imports: [auth_module_1.AuthModule], providers: [kds_gateway_1.KdsGateway, prisma_service_1.PrismaService] })
], KdsModule);
//# sourceMappingURL=kds.module.js.map