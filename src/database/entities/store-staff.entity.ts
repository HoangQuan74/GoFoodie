import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MerchantEntity } from './merchant.entity';
import { StoreEntity } from './store.entity';
import { MerchantOperationEntity } from './merchant-operation.entity';
import { EStaffRole, EStaffStatus } from 'src/common/enums';
import { MerchantRoleEntity } from './merchant-role.entity';

@Entity('store_staffs')
@Unique(['storeId', 'merchantId'])
export class StoreStaffEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column({ name: 'role_code' })
  roleCode: EStaffRole;

  @Column({ type: 'enum', enum: EStaffStatus, default: EStaffStatus.Pending })
  status: EStaffStatus;

  @Column({ name: 'joined_at', nullable: true })
  joinedAt: Date;

  @Column({ name: 'expired_at', nullable: true })
  expiredAt: Date;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;

  @ManyToOne(() => MerchantRoleEntity, (role) => role.code)
  @JoinColumn({ name: 'role_code' })
  role: MerchantRoleEntity;

  @ManyToMany(() => MerchantOperationEntity, (operation) => operation.roles)
  @JoinTable({
    name: 'store_staff_permissions',
    joinColumn: { name: 'merchant_id' },
    inverseJoinColumn: { name: 'operation_code' },
  })
  operations: MerchantOperationEntity[];
}
