import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ name: 'note', nullable: true })
  note: string;

  @Column('json', { nullable: true })
  cartProductOptions: {
    optionGroup: {
      id: number;
      name: string;
      storeId: number;
      isMultiple: boolean;
      status: string;
      createdAt: Date;
      updateAt: Date;
    };
    options: {
      id: number;
      name: string;
      price: number;
      status: string;
      optionGroupId: number;
      createdAt: Date;
      updateAt: Date;
    };
  }[];

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
