import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { TableService } from "./table.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../../core/guards/roles.guard";
import { Roles } from "../../core/guards/roles.decorator";

@Controller("tables")
export class TableController {
  constructor(private readonly tableService: TableService) {}
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "CASHIER", "WAITER")
  findAll() { return this.tableService.findAll(); }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CASHIER", "WAITER")
  create(@Body() body: { name: string; capacity: number }) { return this.tableService.createTable(body); }
  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CASHIER", "WAITER")
  updateStatus(@Param("id") id: string, @Body() body: { status: string; guestName?: string }) {
    return this.tableService.updateStatus(Number(id), body.status, body.guestName);
  }
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN")
  delete(@Param("id") id: string) { return this.tableService.deleteTable(Number(id)); }
  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CASHIER")
  update(@Param("id") id: string, @Body() body: { name: string; capacity: number }) {
    return this.tableService.updateTable(Number(id), body);
  }
  @Post(":id/order")
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles("ADMIN", "CASHIER", "WAITER")
  saveOrder(@Param("id") id: string, @Body() body: { items: any[] }) {
    return this.tableService.saveOrder(Number(id), body.items);
  }
}
