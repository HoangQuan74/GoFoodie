import { ProductEntity } from 'src/database/entities/product.entity';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { AdminEntity } from 'src/database/entities/admin.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ERequestStatus, ERequestType } from 'src/common/enums';

@Entity('product_approvals')
export class ProductApprovalEntity extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column({ name: 'type', type: 'enum', enum: ERequestType, default: ERequestType.Create })
  type: ERequestType;

  @Column({ name: 'status', type: 'enum', enum: ERequestStatus, default: ERequestStatus.Pending })
  status: ERequestStatus;

  @Column({ name: 'processed_at', nullable: true })
  processedAt: Date;

  @Column({ name: 'processed_by_id', nullable: true })
  processedById: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'processed_by_id' })
  processedBy: AdminEntity;
}
