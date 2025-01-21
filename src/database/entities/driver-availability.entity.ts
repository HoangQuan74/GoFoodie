import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DriverEntity } from './driver.entity';

@Entity('driver_availabilities')
export class DriverAvailabilityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
}
