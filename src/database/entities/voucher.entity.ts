import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ServiceTypeEntity } from './service-type.entity';

@Entity('vouchers')
export class VoucherEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ name: 'service_type_id' })
  serviceTypeId: number;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_can_save', default: false })
  isCanSave: boolean;

  @Column({ name: 'discount_type' })
  discountType: number;

  @Column({ name: 'discount_value' })
  discountValue: number;

  @Column({ name: 'min_order_value', default: 0 })
  minOrderValue: number;

  @Column({ name: 'max_discount_value', nullable: true })
  maxDiscountValue: number;

  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;

  @Column({ name: 'max_use_time' })
  maxUseTime: number;

  @Column({ name: 'max_use_time_per_user' })
  maxUseTimePerUser: number;

  @ManyToOne(() => ServiceTypeEntity, (serviceType) => serviceType.id)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceTypeEntity;
}
