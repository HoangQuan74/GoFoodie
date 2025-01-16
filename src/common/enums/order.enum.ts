export enum EOrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  IN_DELIVERY = 'in_delivery',
  DELIVERED = 'delivered',
}

export enum EMerchantConfirmation {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum EPaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}
