import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { PrismaService } from "../../prisma/prisma.service"; // 👈 Import PrismaService

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, PrismaService], // 👈 Bổ sung PrismaService vào mảng providers
})
export class InventoryModule {}
