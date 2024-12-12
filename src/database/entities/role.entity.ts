import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OperationEntity } from './operation.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => OperationEntity, (operation) => operation.id)
  @JoinTable({ name: 'roles_operations', joinColumn: { name: 'role_id' }, inverseJoinColumn: { name: 'operation_id' } })
  operations: OperationEntity[];
}
