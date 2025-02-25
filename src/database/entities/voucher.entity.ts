import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ServiceTypeEntity } from './service-type.entity';
import { ERefundType, EDiscountType, EMaxDiscountType, EVoucherType } from 'src/common/enums/voucher.enum';
import { AdminEntity } from './admin.entity';
import { VoucherTypeEntity } from './voucher-type.entity';
import { ProductEntity } from './product.entity';
import { FileEntity } from './file.entity';
import { StoreEntity } from './store.entity';
import { EServiceType } from 'src/common/enums';

@Entity('vouchers')
export class VoucherEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'image_id', nullable: true })
  imageId: string;

  @Column()
  code: string;

  @Column({ name: 'type_id', type: 'int' })
  typeId: EVoucherType;

  @Column({ name: 'service_type_id' })
  serviceTypeId: EServiceType;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'refund_type', type: 'enum', enum: ERefundType })
  refundType: ERefundType;

  @Column({ name: 'is_can_save', default: false })
  isCanSave: boolean;

  @Column({ name: 'discount_type', type: 'enum', enum: EDiscountType })
  discountType: EDiscountType;

  @Column({ name: 'discount_value' })
  discountValue: number;

  @Column({ name: 'min_order_value', default: 0 })
  minOrderValue: number;

  @Column({ name: 'max_discount_value', nullable: true })
  maxDiscountValue: number;

  @Column({
    name: 'max_discount_type',
    type: 'enum',
    enum: EMaxDiscountType,
    default: EMaxDiscountType.Unlimited,
  })
  maxDiscountType: EMaxDiscountType;

  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;

  @Column({ name: 'max_use_time' })
  maxUseTime: number;

  @Column({ name: 'max_use_time_per_user' })
  maxUseTimePerUser: number;

  @Column({ name: 'created_by_id', nullable: true })
  createdById: number;

  @Column({ name: 'created_by_store_id', nullable: true })
  createdByStoreId: number;

  @Column({ name: 'is_all_products', default: false })
  isAllItems: boolean;

  @ManyToOne(() => ServiceTypeEntity, (serviceType) => serviceType.id)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceTypeEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  @ManyToOne(() => VoucherTypeEntity, (type) => type.id)
  @JoinColumn({ name: 'type_id' })
  type: VoucherTypeEntity;

  @ManyToMany(() => ProductEntity, (product) => product.id)
  @JoinTable({
    name: 'voucher_products',
    joinColumn: { name: 'voucher_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products: ProductEntity[];

  @ManyToMany(() => StoreEntity, (store) => store.id)
  @JoinTable({
    name: 'voucher_stores',
    joinColumn: { name: 'voucher_id' },
    inverseJoinColumn: { name: 'store_id' },
  })
  stores: StoreEntity[];

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;

  used: number = 0;
  productCount: number;
}
