import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AdminEntity } from './admin.entity';
import { AppTypeEntity } from './app-type.entity';
import { EAppType } from 'src/common/enums/config.enum';

@Entity('request_types')
export class RequestTypeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'app_type_id', default: EAppType.AppClient })
  appTypeId: EAppType;

  @Column({ name: 'created_by_id', nullable: true })
  createdById: number;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: AdminEntity;

  @ManyToOne(() => AppTypeEntity, (appType) => appType.value)
  @JoinColumn({ name: 'app_type_id' })
  appType: AppTypeEntity;
}
