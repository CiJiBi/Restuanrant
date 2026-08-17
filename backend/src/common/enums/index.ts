export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CHEF = "CHEF",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PREPARING = "PREPARING",
  SERVED = "SERVED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}
