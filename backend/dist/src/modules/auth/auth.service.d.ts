import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: string;
                name: string;
                email: string;
                role: string;
            };
        };
    }>;
}
