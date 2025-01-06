import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FeeTypeEntity } from './fee-type.entity';
import { BaseEntity } from './base.entity';
import { ServiceTypeEntity } from './service-type.entity';
import { AppFeeEntity } from './app-fee.entity';
import { AdminEntity } from './admin.entity';
import { FeeCriteriaEntity } from './fee-criteria.entity';

@Entity('fees')
export class FeeEntity extends BaseEntity {
  @Column({ name: 'fee_type_id' })
  feeTypeId: number;

  @Column({ name: 'service_type_id' })
  serviceTypeId: number;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'created_by_id' })
  createdById: number;

  @ManyToOne(() => FeeTypeEntity, (feeType) => feeType.id)
  @JoinColumn({ name: 'fee_type_id' })
  feeType: FeeTypeEntity;

  @ManyToOne(() => ServiceTypeEntity, (serviceType) => serviceType.id)
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceTypeEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  @OneToMany(() => FeeCriteriaEntity, (criteria) => criteria.fee, { cascade: true })
  criteria: FeeCriteriaEntity[];

  @OneToMany(() => AppFeeEntity, (appFee) => appFee.fee, { cascade: true })
  appFees: AppFeeEntity[];
}
