export enum EMerchantStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum ESortMerchant {
  NameAsc = 'name:ASC',
  NameDesc = 'name:DESC',
  EmailAsc = 'email:ASC',
  EmailDesc = 'email:DESC',
  PhoneAsc = 'phone:ASC',
  PhoneDesc = 'phone:DESC',
  CreatedAtAsc = 'createdAt:ASC',
  CreatedAtDesc = 'createdAt:DESC',
  UpdatedAtAsc = 'updatedAt:ASC',
  UpdatedAtDesc = 'updatedAt:DESC',
  StoreNumberAsc = 'storeNumber:ASC',
  StoreNumberDesc = 'storeNumber:DESC',
  ApprovedStoreNumberAsc = 'approvedStoreNumber:ASC',
  ApprovedStoreNumberDesc = 'approvedStoreNumber:DESC',
  UnapprovedStoreNumberAsc = 'unapprovedStoreNumber:ASC',
  UnapprovedStoreNumberDesc = 'unapprovedStoreNumber:DESC',
}

export enum EMerchantRole {
  Owner = 'owner',
  Manager = 'manager',
  Staff = 'staff',
}

export enum EStaffRole {
  Manager = 'manager',
  Staff = 'staff',
}
