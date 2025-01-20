import { EOrderStatus, EPaymentStatus } from 'src/common/enums/order.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ClientEntity } from './client.entity';
import { DriverEntity } from './driver.entity';
import { OrderItemEntity } from './order-item.entity';
import { StoreEntity } from './store.entity';
import { OrderActivityEntity } from './order-activities.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'driver_id', nullable: true })
  driverId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount', nullable: true })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: EOrderStatus,
    default: EOrderStatus.Pending,
  })
  status: EOrderStatus;

  @Column({
    type: 'enum',
    enum: EPaymentStatus,
    default: EPaymentStatus.Unpaid,
    name: 'payment_status',
  })
  paymentStatus: EPaymentStatus;

  @Column({ nullable: true, name: 'delivery_address' })
  deliveryAddress: string;

  @Column({ type: 'float', nullable: true, name: 'delivery_latitude' })
  deliveryLatitude: number;

  @Column({ type: 'float', nullable: true, name: 'delivery_longitude' })
  deliveryLongitude: number;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => ClientEntity)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => StoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => DriverEntity)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];

  @OneToMany(() => OrderActivityEntity, (activity) => activity.order)
  activities: OrderActivityEntity[];
}
