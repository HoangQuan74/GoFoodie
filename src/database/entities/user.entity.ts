import { Role } from 'src/common/enums';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ name: 'is_activated', default: true })
  isActivated: boolean;

  @Column({ name: 'role', type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;
}
