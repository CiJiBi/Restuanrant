import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
} from "@nestjs/common";
import { StaffService } from "./staff.service";

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async getAllStaff() {
    return this.staffService.getAllStaff();
  }

  @Post()
  async createStaff(@Body() body: any) {
    return this.staffService.createStaff(body);
  }

  @Delete(":id")
  async deleteStaff(@Param("id") id: string) {
    return this.staffService.deleteStaff(id);
  }
  @Patch(":id")
  async updateStaff(@Param("id") id: string, @Body() body: any) {
    return this.staffService.updateStaff(id, body);
  }
}
