export enum ENoticeSendType {
  Email = 'email',
  App = 'app',
}

export enum ENotificationRelatedType {
  Store = 'store',
  Driver = 'driver',
  Product = 'product',
}

export enum ENotificationType {
  StoreCreate = 'store_create',
  DriverCreate = 'driver_create',
  ProductCreate = 'product_create',
  ProductUpdate = 'product_update',
}

export enum EClientNotificationType {
  Order = 'order',
  Promotion = 'promotion',
}

export enum EClientNotificationStatus {
  Error = 'error',
  Info = 'info',
}

export enum EStoreNotificationType {
  Order = 'order',
  Promotion = 'promotion',
  News = 'news',
  StoreUpdate = 'store_update',
  Wallet = 'wallet',
}

export enum EStoreNotificationStatus {
  Error = 'error',
  Info = 'info',
}
