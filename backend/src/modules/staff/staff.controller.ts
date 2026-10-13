import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/guards/roles.guard";
import { Roles } from "../../core/guards/roles.decorator";

@Controller("staff")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}
  @Get() getAllStaff() { return this.staffService.getAllStaff(); }
  @Post() createStaff(@Body() body: any) { return this.staffService.createStaff(body); }
  @Delete(":id") deleteStaff(@Param("id") id: string) { return this.staffService.deleteStaff(id); }
  @Patch(":id") updateStaff(@Param("id") id: string, @Body() body: any) { return this.staffService.updateStaff(id, body); }
}
