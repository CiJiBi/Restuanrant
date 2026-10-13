import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaService } from "../../prisma/prisma.service";
import { KdsGateway } from "./kds.gateway";
@Module({ imports: [AuthModule], providers: [KdsGateway, PrismaService] })
export class KdsModule {}
