import { EMerchantStatus } from 'src/common/enums';
import { ViewEntity, ViewColumn } from 'typeorm';
import { EStoreApprovalStatus } from 'src/common/enums';

@ViewEntity({
  expression: `
    SELECT 
      m.id,
      m.name,
      m.email,
      m.phone,
      m.status,
      m.created_at,
      m.updated_at,
      count(s.id) AS store_number,
      sum(case when s.approval_status = '${EStoreApprovalStatus.Approved}' then 1 else 0 end) AS approved_store_number,
      sum(case when s.approval_status = '${EStoreApprovalStatus.Rejected}' then 1 else 0 end) AS unapproved_store_number
    FROM merchants m
    LEFT JOIN stores s ON s.merchant_id = m.id AND s.deleted_at IS NULL
    WHERE m.deleted_at IS NULL
    GROUP BY m.id
  `,
})
export class MerchantView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  phone: string;

  @ViewColumn()
  status: EMerchantStatus;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ViewColumn({ name: 'store_number' })
  storeNumber: number;

  @ViewColumn({ name: 'approved_store_number' })
  approvedStoreNumber: number;

  @ViewColumn({ name: 'unapproved_store_number' })
  unapprovedStoreNumber: number;
}
