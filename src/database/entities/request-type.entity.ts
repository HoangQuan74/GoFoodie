import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AdminEntity } from './admin.entity';
import { AppTypeEntity } from './app-type.entity';

@Entity('request_types')
export class RequestTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_by_id', nullable: true })
  createdById: number;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  @ManyToMany(() => AppTypeEntity, (appType) => appType.value, { cascade: true })
  @JoinTable({ name: 'app_request_types' })
  appTypes: AppTypeEntity[];
}
