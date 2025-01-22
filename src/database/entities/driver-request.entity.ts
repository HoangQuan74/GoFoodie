import { Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { DriverEntity } from './driver.entity';
import { BaseEntity } from './base.entity';
import { ERequestStatus } from 'src/common/enums';
import { AdminEntity } from './admin.entity';
import { FileEntity } from './file.entity';
import { RequestTypeEntity } from './request-type.entity';

@Entity('driver_requests')
export class DriverRequestEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  description: string;

  @Column({ name: 'type_id' })
  typeId: number;

  @Column({ type: 'enum', enum: ERequestStatus, default: ERequestStatus.Pending })
  status: ERequestStatus;

  @Column({ name: 'approved_by_id', nullable: true })
  approvedById: number;

  @Column({ name: 'approved_at', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  reason: string;

  @Column({ name: 'driver_id' })
  driverId: number;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: AdminEntity;

  @ManyToMany(() => FileEntity, (file) => file.id)
  @JoinTable({
    name: 'driver_request_files',
    joinColumn: { name: 'driver_request_id' },
    inverseJoinColumn: { name: 'file_id' },
  })
  files: FileEntity[];

  @ManyToOne(() => RequestTypeEntity, (requestType) => requestType.id)
  @JoinColumn({ name: 'type_id' })
  type: RequestTypeEntity;
}
