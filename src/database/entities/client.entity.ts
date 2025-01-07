import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'device_token', nullable: true })
  deviceToken: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;
}
