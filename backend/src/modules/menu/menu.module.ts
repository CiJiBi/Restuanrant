import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { MenuRepository } from "./repositories/menu.repository";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [MenuController],
  providers: [MenuService, MenuRepository, PrismaService],
})
export class MenuModule {}
