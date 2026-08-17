import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: any): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: string;
                name: any;
                email: string;
                role: string;
            };
        };
    }>;
    registerMockAdmin(): Promise<{
        message: string;
        email: string;
    }>;
}
