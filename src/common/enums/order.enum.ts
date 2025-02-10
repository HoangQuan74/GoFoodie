export enum EOrderStatus {
  OrderCreated = 'order_created',
  Pending = 'pending',
  Confirmed = 'confirmed',
  SearchingForDriver = 'searching_for_driver',
  OfferSentToDriver = 'offer_sent_to_driver',
  DriverAccepted = 'driver_accepted',
  InDelivery = 'in_delivery',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum EPaymentStatus {
  Unpaid = 'unpaid',
  Paid = 'paid',
  Refunded = 'refunded',
}

export enum EOrderCode {
  PreOrder = 'PRE',
  DeliveryNow = 'NOW',
}
