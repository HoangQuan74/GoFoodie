export enum EStoreApprovalStatus {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum EStoreStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum EStoreLockStatus {
  Open = 'open',
  Lock = 'lock',
}

export enum EStoreRepresentativeType {
  Individual = 'individual',
  Business = 'business',
  BusinessHousehold = 'business_household',
}

export enum ESortStore {
  NameAsc = 'name:ASC',
  NameDesc = 'name:DESC',
  CreatedAtAsc = 'createdAt:ASC',
  CreatedAtDesc = 'createdAt:DESC',
}

export enum EStoreAddressType {
  Receive = 'receive',
  Return = 'return',
}

export enum EStorePrintType {
  Customer = 'customer',
  Store = 'store',
}

export enum EStorePrintConfirmType {
  AutoReceive = 'auto_receive',
  StoreReceive = 'store_receive',
}

export enum EStoreCoinType {
  SHOP_TOPUP = 'shop_topup',
  GOO_REWARD = 'goo_reward',
  SHOP_EVENT_REWARD = 'shop_event_reward',
  REVIEW_REWARD = 'review_reward',
}