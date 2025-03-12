import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, name: 'avatar_id' })
  avatarId: string;

  @Column({ nullable: true, type: 'date', name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column()
  phone: string;

  @Column({ nullable: true, type: 'float' })
  latitude: number;

  @Column({ nullable: true, type: 'float' })
  longitude: number;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'device_token', nullable: true })
  deviceToken: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;

  @Column({ type: 'int8', default: 0 })
  coins: number;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'avatar_id' })
  avatar: FileEntity;
}
