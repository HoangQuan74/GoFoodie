import { BaseEntity } from './base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ServiceTypeEntity } from './service-type.entity';
import { EOrderCriteriaType } from 'src/common/enums/order-criteria.enum';

@Entity('order_criteria')
export class OrderCriteriaEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EOrderCriteriaType })
  type: EOrderCriteriaType;

  @Column()
  value: number;

  @Column()
  priority: number;

  @Column({ name: 'service_type_id' })
  serviceTypeId: number;

  @ManyToOne(() => ServiceTypeEntity, (serviceType) => serviceType.id)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceTypeEntity;
}
