import { Module } from "@nestjs/common";
import { TableController } from "./table.controller";
import { TableService } from "./table.service";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsGateway } from "./events.gateway";
@Module({
  controllers: [TableController],
  providers: [TableService, PrismaService, EventsGateway],
})
export class TableModule {}
