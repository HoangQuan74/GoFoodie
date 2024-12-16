// yêu cầu phê duyệt món ăn
import { ProductEntity } from 'src/database/entities/product.entity';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

// @Entity('product_approvals')
export class ProductApprovalEntity extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column({ name: 'status', default: false })
  status: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;
}
