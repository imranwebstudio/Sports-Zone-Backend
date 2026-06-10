import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    seedAdmin(): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    } | null>;
    changePassword(req: any, body: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
