export enum ESocketEvent {
  NewOrder = 'newOrder',
  OrderStatus = 'orderStatus',
  NewDelivery = 'newDelivery',
  OrderUpdated = 'orderUpdated',
  DriverLocationUpdate = 'driverLocationUpdate',
  RoleUpdated = 'roleUpdated',
  NewNotification = 'newNotification',
  OrderSearchingForDriver = 'orderSearchingForDriver',
  DeleteOrderSearchingForDriver = 'deleteOrderSearchingForDriver',
  TransactionResult = 'transactionResult',
  UpdateStatusTransactionCoin = 'updateStatusTransactionCoin',
}
