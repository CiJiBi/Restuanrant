import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { Server, Socket } from "socket.io";
export declare class KdsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly prisma;
    server: Server;
    constructor(jwtService: JwtService, prisma: PrismaService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleNewOrder(data: unknown, client: Socket): {
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: string;
    };
    handleUpdateStatus(data: unknown, client: Socket): {
        status: string;
    };
    handleOrderStatusUpdated(client: Socket): {
        status: string;
    };
}
