import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN || "http://localhost:3000" } })
export class KdsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) {}

  afterInit(server: Server) {
    server.use(async (client: Socket, next: (err?: Error) => void) => {
      try {
        const authToken = client.handshake.auth?.token;
        const authorization = client.handshake.headers.authorization;
        const bearerToken = typeof authorization === "string" && authorization.startsWith("Bearer ") ? authorization.slice(7) : undefined;
        const token = typeof authToken === "string" && authToken.length > 0 ? authToken : bearerToken;
        if (!token) return next(new Error("Unauthorized"));
        const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub }, select: { id: true, role: true, isActive: true },
        });
        if (!user || !user.isActive) return next(new Error("Unauthorized"));
        client.data.user = { id: user.id, role: user.role };
        return next();
      } catch {
        return next(new Error("Unauthorized"));
      }
    });
  }

  handleConnection(client: Socket) {
    console.log("[KDS] Nhân viên đã kết nối: " + (client.data.user?.role || "unknown"));
  }
  handleDisconnect(client: Socket) { console.log("[KDS] Ngắt kết nối KDS: " + client.id); }

  @SubscribeMessage("sendOrderToKitchen")
  handleNewOrder(@MessageBody() data: unknown, @ConnectedSocket() client: Socket) {
    if (!["ADMIN", "CASHIER", "WAITER"].includes(client.data.user?.role)) {
      client.emit("authorizationError", { message: "Không có quyền gửi đơn vào bếp." });
      return { status: "forbidden" };
    }
    this.server.emit("receiveNewOrder", data);
    return { status: "ok", message: "Bếp đã nhận lệnh" };
  }

  @SubscribeMessage("updateDishStatus")
  handleUpdateStatus(@MessageBody() data: unknown, @ConnectedSocket() client: Socket) {
    if (!["ADMIN", "CHEF"].includes(client.data.user?.role)) {
      client.emit("authorizationError", { message: "Chỉ nhân viên bếp mới được cập nhật trạng thái món." });
      return { status: "forbidden" };
    }
    this.server.emit("dishStatusUpdated", data);
    return { status: "ok" };
  }

  @SubscribeMessage("orderStatusUpdated")
  handleOrderStatusUpdated(@ConnectedSocket() client: Socket) {
    if (!["ADMIN", "CASHIER", "CHEF", "WAITER"].includes(client.data.user?.role)) {
      client.emit("authorizationError", { message: "Không có quyền gửi sự kiện này." });
      return { status: "forbidden" };
    }
    this.server.emit("orderStatusUpdated");
    return { status: "ok" };
  }
}
