import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DriverEntity } from './driver.entity';
import { EOrderGroupStatus } from 'src/common/enums';
import { OrderGroupItemEntity } from './order-group-item.entity';

@Entity('order_groups')
export class OrderGroupEntity extends BaseEntity {
  @Column({ name: 'driver_id' })
  driverId: number;

  @Column({
    type: 'enum',
    enum: EOrderGroupStatus,
    default: EOrderGroupStatus.InDelivery,
  })
  status: EOrderGroupStatus;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @OneToMany(() => OrderGroupItemEntity, (orderGroupItem) => orderGroupItem.orderGroup)
  orderGroupItems: OrderGroupItemEntity[];
}
