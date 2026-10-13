import { PrismaService } from "../../prisma/prisma.service";
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    handleKioskScan(pinCode: string): Promise<{
        success: boolean;
        action: string;
        message: string;
    }>;
}
