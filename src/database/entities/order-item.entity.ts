import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';
import { Group } from 'src/common/interfaces/order-item.interface';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'product_image', nullable: true })
  productImage: string;

  @Column({ name: 'product_name', nullable: true })
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 0 })
  price: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 0 })
  subtotal: number;

  @Column({ name: 'note', nullable: true })
  note: string;

  @Column('json', { nullable: true })
  cartProductOptions: Group[];

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
