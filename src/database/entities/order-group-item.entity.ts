import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { OrderEntity } from './order.entity';
import { BaseEntity } from './base.entity';
import { OrderGroupEntity } from './order-group.entity';

@Entity('order_group_items')
export class OrderGroupItemEntity extends BaseEntity {
  @Column({ name: 'order_group_id' })
  orderGroupId: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @ManyToOne(() => OrderGroupEntity, (orderGroup) => orderGroup.id)
  @JoinColumn({ name: 'order_group_id' })
  orderGroup: OrderGroupEntity;

  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
