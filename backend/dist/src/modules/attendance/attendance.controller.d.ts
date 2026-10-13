import { AttendanceService } from "./attendance.service";
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    handleKiosk(body: {
        pinCode: string;
    }): Promise<{
        success: boolean;
        action: string;
        message: string;
    }>;
}
