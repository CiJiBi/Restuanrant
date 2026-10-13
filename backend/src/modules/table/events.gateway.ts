import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

// Mở cổng CORS để Frontend (port 3000) có thể kết nối vào Backend (port 4000)
@WebSocketGateway({
  cors: { origin: "*" },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Bếp đã kết nối KDS: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Bếp đã ngắt kết nối: ${client.id}`);
  }

  // Hàm để các Service gọi khi có sự thay đổi dữ liệu
  emitOrderUpdate() {
    this.server.emit("orderUpdated", { message: "Có cập nhật đơn hàng!" });
  }
}
