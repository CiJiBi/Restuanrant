import { Controller, Get, Patch, Param, Body, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("orders") // <--- Chú ý kỹ từ khóa này phải khớp chính xác là 'orders'
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }
}
