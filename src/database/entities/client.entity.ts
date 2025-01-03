import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export class ClientEntity extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;
}
