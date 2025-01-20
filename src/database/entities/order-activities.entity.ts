import { EOrderStatus } from 'src/common/enums/order.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';

@Entity('order_activities')
export class OrderActivityEntity extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: number;

  @Column({
    type: 'enum',
    enum: EOrderStatus,
  })
  status: EOrderStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'performed_by' })
  performedBy: string;

  @Column({ nullable: true, name: 'cancellation_reason' })
  cancellationReason: string;

  @Column({ nullable: true, name: 'cancellation_type' })
  cancellationType: 'client' | 'merchant' | 'driver' | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.activities)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
