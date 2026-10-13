import { Body, Controller, Get, Patch, Param, Post, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/guards/roles.guard";
import { Roles } from "../../core/guards/roles.decorator";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "CASHIER", "CHEF", "WAITER")
  getAllOrders() { return this.ordersService.getAllOrders(); }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "CHEF", "WAITER", "CASHIER")
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "CASHIER", "WAITER")
  createOrder(@Body() body: any) { return this.ordersService.createOrder(body); }
}
