import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EAdminStatus } from 'src/common/enums';
import { RoleEntity } from './role.entity';

@Entity('admins')
export class AdminEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'is_root', default: false })
  isRoot: boolean;

  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @Column({ name: 'status', type: 'enum', enum: EAdminStatus, default: EAdminStatus.Active })
  status: EAdminStatus;

  @ManyToOne(() => RoleEntity, (role) => role.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
