import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard"; // Nhớ check lại đường dẫn Guard

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("overview")
  // @UseGuards(JwtAuthGuard) // Bật lên khi bạn đã sẵn sàng bảo mật
  async getOverview() {
    return await this.dashboardService.getOverviewData();
  }
}
