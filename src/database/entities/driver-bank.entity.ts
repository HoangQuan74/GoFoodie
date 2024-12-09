import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';

@Entity('driver_banks')
export class DriverBankEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({ name: 'bank_id', nullable: true })
  bankId: number;

  @Column({ name: 'bank_branch_id', nullable: true })
  bankBranchId: number;

  @Column({ name: 'account_number', nullable: true })
  accountNumber: string;

  @Column({ name: 'account_name', nullable: true })
  accountName: string;

  @ManyToOne(() => DriverEntity, (driver) => driver.banks, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
}
