export enum ERefundType {
  Promotion = 'promotion',
  Refund = 'refund',
}

export enum EDiscountType {
  Percentage = 1,
  Fixed = 2,
}

export enum EMaxDiscountType {
  Limited = 'limited',
  Unlimited = 'unlimited',
}

export enum EVoucherStatus {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Ended = 'ended',
}

export enum EVoucherType {
  AllStore = 1,
  Product = 2,
  Store = 3,
}
