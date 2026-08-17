import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { TableService } from "./table.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("tables")
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get()
  async findAll() {
    return await this.tableService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { name: string; capacity: number }) {
    return await this.tableService.createTable(body);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { status: string; guestName?: string },
  ) {
    return await this.tableService.updateStatus(
      Number(id),
      body.status,
      body.guestName,
    );
  }

  // 👈 Thêm đoạn này để Backend bắt được lệnh DELETE
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    return await this.tableService.deleteTable(Number(id));
  }
}
