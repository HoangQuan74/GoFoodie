import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EStoreStatus } from 'src/common/enums';
import { MerchantEntity } from './merchant.entity';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: EStoreStatus, default: EStoreStatus.Approved })
  status: EStoreStatus;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;
}
