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

export enum EOrderActivityStatus {
  DRIVER_APPROVED_AND_REJECTED = 'driver_approved_and_rejected_the_order',
  DRIVER_REJECTED = 'driver_rejected_the_order',
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

export enum EOrderProcessor {
  CANCEL_ORDER = 'cancelOrder',
}
