import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MerchantRoleEntity } from './merchant-role.entity';
import { MerchantEntity } from './merchant.entity';

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
}
