import { Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { DriverEntity } from './driver.entity';
import { BaseEntity } from './base.entity';
import { EDriverRequestType, ERequestStatus } from 'src/common/enums';
import { AdminEntity } from './admin.entity';
import { FileEntity } from './file.entity';

@Entity('driver_requests')
export class DriverRequestEntity extends BaseEntity {
  @Column()
  code: string;

  @Column({ name: 'name' })
  name: string;

  @Column()
  description: string;

  @Column({ name: 'type' })
  type: EDriverRequestType;

  @Column({ type: 'enum', enum: ERequestStatus, default: ERequestStatus.Pending })
  status: ERequestStatus;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'processed_by_id', nullable: true })
  processedById: number;

  @Column({ name: 'processed_at', nullable: true })
  processedAt: Date;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'processed_by_id' })
  processedBy: AdminEntity;

  @ManyToMany(() => FileEntity, (file) => file.id)
  @JoinTable({
    name: 'driver_request_files',
    joinColumn: { name: 'driver_request_id' },
    inverseJoinColumn: { name: 'file_id' },
  })
  files: FileEntity[];
}
