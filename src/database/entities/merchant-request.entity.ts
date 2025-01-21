import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ERequestStatus } from 'src/common/enums';
import { MerchantEntity } from './merchant.entity';
import { MerchantRequestType } from './merchant-request-type.entity';
import { StoreEntity } from './store.entity';
import { AdminEntity } from './admin.entity';

@Entity('merchant_requests')
export class MerchantRequestEntity extends BaseEntity {
  @Column()
  code: string;

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'type_id' })
  typeId: number;

  @Column()
  description: string;

  @Column({ name: 'status', type: 'enum', enum: ERequestStatus, default: ERequestStatus.Pending })
  status: ERequestStatus;

  @Column({ name: 'approved_by_id', nullable: true })
  approvedById: number;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;

  @ManyToOne(() => MerchantRequestType, (requestType) => requestType.id)
  @JoinColumn({ name: 'type_id' })
  type: MerchantRequestType;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: AdminEntity;
}
