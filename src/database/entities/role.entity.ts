import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OperationEntity } from './operation.entity';
import { ERoleStatus } from 'src/common/enums';
import { AdminEntity } from './admin.entity';
import { ProvinceEntity } from './province.entity';
import { ServiceTypeEntity } from './service-type.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'status', type: 'enum', enum: ERoleStatus, default: ERoleStatus.Active })
  status: ERoleStatus;

  @ManyToMany(() => ProvinceEntity, (province) => province.id)
  @JoinTable({ name: 'roles_provinces', joinColumn: { name: 'role_id' }, inverseJoinColumn: { name: 'province_id' } })
  provinces: ProvinceEntity[];

  @ManyToMany(() => ServiceTypeEntity, (serviceType) => serviceType.id)
  @JoinTable({
    name: 'roles_service_types',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'service_type_id' },
  })
  serviceTypes: ServiceTypeEntity[];

  @ManyToMany(() => OperationEntity, (operation) => operation.id)
  @JoinTable({ name: 'roles_operations', joinColumn: { name: 'role_id' }, inverseJoinColumn: { name: 'operation_id' } })
  operations: OperationEntity[];

  @OneToMany(() => AdminEntity, (admin) => admin.role)
  admins: AdminEntity[];
}
