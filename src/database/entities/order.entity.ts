import { EOrderStatus, EPaymentStatus } from 'src/common/enums/order.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { DriverEntity } from './driver.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cart_id' })
  cartId: number;

  @Column({ name: 'driver_id', nullable: true })
  driverId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
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
  })
  paymentStatus: EPaymentStatus;

  @Column({ nullable: true })
  deliveryAddress: string;

  @Column({ type: 'float', nullable: true })
  deliveryLatitude: number;

  @Column({ type: 'float', nullable: true })
  deliveryLongitude: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CartEntity, (cart) => cart.id)
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @ManyToOne(() => DriverEntity, (driver) => driver.id)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverEntity;
}
