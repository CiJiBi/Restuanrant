import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(authDto: AuthDto): Promise<{
        success: boolean;
        data: {
            access_token: string;
            user: {
                id: string;
                email: string;
                role: string;
            };
        };
    }>;
    login(authDto: AuthDto): Promise<{
        success: boolean;
        data: {
            access_token: string;
            user: {
                id: string;
                email: string;
                role: string;
            };
        };
    }>;
    private generateToken;
}
