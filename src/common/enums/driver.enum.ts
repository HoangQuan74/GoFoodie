import e from 'express';

export enum EDriverStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum EDriverApprovalStatus {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum EDriverUniformStatus {
  Ordered = 'ordered',
}

export enum EDriverUniformPaymentMethod {
  Cash = 'cash',
}
