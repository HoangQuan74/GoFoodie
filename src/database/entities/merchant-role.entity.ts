import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { MerchantOperationEntity } from './merchant-operation.entity';
import { EStaffRole } from 'src/common/enums';

@Entity('merchant_roles')
export class MerchantRoleEntity {
  @PrimaryColumn()
  code: EStaffRole;

  @Column({ name: 'name' })
  name: string;

  @ManyToMany(() => MerchantOperationEntity, (operation) => operation.roles)
  operations: MerchantOperationEntity[];
}
