export enum EOrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  InDelivery = 'in_delivery',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum EPaymentStatus {
  Unpaid = 'unpaid',
  Paid = 'paid',
  Refunded = 'refunded',
}
