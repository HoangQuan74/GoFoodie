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
