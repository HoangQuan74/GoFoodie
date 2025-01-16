import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { DriverEntity } from './driver.entity';

export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  InDelivery = 'in_delivery',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum PaymentStatus {
  Unpaid = 'unpaid',
  Paid = 'paid',
  Refunded = 'refunded',
}

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
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.Unpaid,
  })
  paymentStatus: PaymentStatus;

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
