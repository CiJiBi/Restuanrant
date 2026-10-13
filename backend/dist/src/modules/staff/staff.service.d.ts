import { PrismaService } from "../../prisma/prisma.service";
export declare class StaffService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllStaff(): Promise<{
        id: string;
        email: string;
        pinCode: string;
        name: string;
        role: string;
        salary: number;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    createStaff(data: any): Promise<{
        id: string;
        email: string;
        pinCode: string;
        name: string;
        role: string;
        salary: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    updateStaff(id: string, data: any): Promise<{
        id: string;
        email: string;
        pinCode: string;
        name: string;
        role: string;
        salary: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    deleteStaff(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
    }>;
}
