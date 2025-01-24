export enum EOrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  InDelivery = 'in_delivery',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
  OfferSentToDriver = 'offer_sent_to_driver',
  DriverAccepted = 'driver_accepted',
  SearchingForDriver = 'searching_for_driver',
}

export enum EPaymentStatus {
  Unpaid = 'unpaid',
  Paid = 'paid',
  Refunded = 'refunded',
}

export enum EOrderCode {
  PreOrder = 'pre',
  DeliveryNow = 'now',
}
