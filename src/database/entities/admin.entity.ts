import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EAdminStatus } from 'src/common/enums';

@Entity('admins')
export class AdminEntity extends BaseEntity {
  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'status', type: 'enum', enum: EAdminStatus, default: EAdminStatus.Active })
  status: EAdminStatus;
}
