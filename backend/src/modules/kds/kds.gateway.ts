import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

// Mở CORS để Frontend (cổng 3000) có thể kết nối được tới Backend (cổng 4000)
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class KdsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Bắt sự kiện khi màn hình Bếp vừa bật lên
  handleConnection(client: Socket) {
    console.log(`[KDS] Màn hình Bếp đã kết nối: ${client.id}`);
  }

  // Bắt sự kiện khi màn hình Bếp tắt đi hoặc mất mạng
  handleDisconnect(client: Socket) {
    console.log(`[KDS] Màn hình Bếp mất kết nối: ${client.id}`);
  }

  // Lắng nghe tín hiệu "GỬI ĐƠN MỚI" từ quầy Thu ngân
  @SubscribeMessage("sendOrderToKitchen")
  handleNewOrder(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log("[KDS] Nhận đơn hàng mới:", data);

    // Phát sóng (Broadcast) đơn hàng này tới tất cả màn hình Bếp đang mở
    this.server.emit("receiveNewOrder", data);

    return { event: "ack", message: "Bếp đã nhận lệnh" };
  }

  // Lắng nghe tín hiệu "CẬP NHẬT TRẠNG THÁI MÓN" từ Bếp (Đang nấu -> Xong)
  @SubscribeMessage("updateDishStatus")
  handleUpdateStatus(@MessageBody() data: any) {
    console.log("[KDS] Món ăn đã cập nhật trạng thái:", data);

    // Báo lại cho Thu ngân và các Bếp khác biết để đồng bộ màn hình
    this.server.emit("dishStatusUpdated", data);
  }
}
