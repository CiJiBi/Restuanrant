import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Post,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard"; // (Nếu bạn chưa làm Guard này thì có thể tạm thời xóa dòng @UseGuards đi để test trước)

// @UseGuards(JwtAuthGuard) // Tạm thời comment lại dòng này nếu chưa cấu hình xong AuthGuard
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }
  @Post()
  createOrder(@Body() body: any) {
    return this.ordersService.createOrder(body);
  }
}
