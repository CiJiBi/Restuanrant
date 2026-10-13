import { Controller, Post, Body } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post("kiosk")
  async handleKiosk(@Body() body: { pinCode: string }) {
    return this.attendanceService.handleKioskScan(body.pinCode);
  }
}
