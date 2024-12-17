import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DriverEntity } from './driver.entity';
import { MerchantEntity } from './merchant.entity';

import { BaseEntity } from './base.entity';
import { ERequestStatus } from 'src/common/enums';

// @Entity('driver_requests')
export class DriverRequestEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column({ name: 'status', enum: ERequestStatus, default: ERequestStatus.Pending })
  status: ERequestStatus;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;
}
