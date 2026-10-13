export declare const ROLES_KEY = "roles";
export type AppRole = "ADMIN" | "CASHIER" | "CHEF" | "WAITER" | "SECURITY";
export declare const Roles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
