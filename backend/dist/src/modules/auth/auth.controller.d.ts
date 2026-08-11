import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
