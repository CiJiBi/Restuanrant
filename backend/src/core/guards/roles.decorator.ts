import { SetMetadata } from "@nestjs/common";
export const ROLES_KEY = "roles";
export type AppRole = "ADMIN" | "CASHIER" | "CHEF" | "WAITER" | "SECURITY";
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
