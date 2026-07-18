export const INITIAL_MENU_ITEMS = [
  {
    id: "MN001",
    name: "Bò Wagyu dát vàng",
    category: "Món chính",
    price: 2500000,
    status: "Đang bán",
    stock: 15,
    img: "https://images.unsplash.com/photo-1544025162-8315520c6792?q=80&w=300",
  },
  {
    id: "MN002",
    name: "Tôm hùm Alaska nướng",
    category: "Hải sản",
    price: 1850000,
    status: "Đang bán",
    stock: 8,
    img: "https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=300",
  },
  // ... Bạn có thể thêm hàng trăm món ở đây
];
export type OrderStatus = "pending" | "cooking" | "ready" | "completed";

export interface Order {
  id: string;
  table: string;
  customer: string;
  items: string;
  amount: string;
  time: string;
  status: OrderStatus;
}

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-001",
    table: "Bàn 05",
    customer: "Nguyễn Văn A",
    items: "2x Bò Wagyu, 1x Vang đỏ",
    amount: "3,200,000đ",
    time: "10:15 AM",
    status: "pending",
  },
  {
    id: "ORD-002",
    table: "Bàn 12",
    customer: "Trần Thị B",
    items: "1x Salad cá hồi, 2x Nước ép",
    amount: "450,000đ",
    time: "10:20 AM",
    status: "pending",
  },
  {
    id: "ORD-003",
    table: "Mang đi",
    customer: "Lê Hoàng C",
    items: "1x Pizza Hải sản",
    amount: "320,000đ",
    time: "10:05 AM",
    status: "cooking",
  },
];
export const INITIAL_CUSTOMERS = [
  {
    id: "CUS-001",
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0901234567",
    tier: "Platinum",
    spent: 45000000,
  },
  // ...
];
