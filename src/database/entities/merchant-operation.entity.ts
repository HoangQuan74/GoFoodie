import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { MerchantRoleEntity } from './merchant-role.entity';
import { StoreStaffEntity } from './store-staff.entity';

@Entity('merchant_operations')
export class MerchantOperationEntity {
  @PrimaryColumn()
  code: string;

  @Column({ name: 'group_id' })
  groupId: number;

  @Column({ name: 'group_name' })
  groupName: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => MerchantRoleEntity, (role) => role.operations)
  @JoinTable({
    name: 'merchant_role_operations',
    joinColumn: { name: 'operation_code' },
    inverseJoinColumn: { name: 'role_code' },
  })
  roles: MerchantRoleEntity[];

  @ManyToMany(() => StoreStaffEntity, (staff) => staff.operations)
  staffs: StoreStaffEntity[];

  @ManyToMany(() => MerchantOperationEntity, (operation) => operation.dependencies)
  @JoinTable({
    name: 'merchant_operation_dependencies',
    joinColumn: { name: 'operation_code' },
    inverseJoinColumn: { name: 'dependent_operation_code' },
  })
  dependencies: MerchantOperationEntity[];
}
