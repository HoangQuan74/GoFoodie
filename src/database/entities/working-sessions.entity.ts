import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_working_sessions')
export class DriverWorkingSessionEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'start_time', default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
}
