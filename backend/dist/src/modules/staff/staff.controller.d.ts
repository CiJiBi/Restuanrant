import { StaffService } from "./staff.service";
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
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
    createStaff(body: any): Promise<{
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
    updateStaff(id: string, body: any): Promise<{
        id: string;
        email: string;
        pinCode: string;
        name: string;
        role: string;
        salary: number;
        isActive: boolean;
        createdAt: Date;
    }>;
}
