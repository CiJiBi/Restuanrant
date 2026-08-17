import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: any): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            user: {
                id: string;
                email: string;
                role: string;
            };
        };
    }>;
    registerAdmin(): Promise<{
        message: string;
        email: string;
    }>;
}
