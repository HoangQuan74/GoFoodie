import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';
import { BaseEntity } from './base.entity';

@Entity('cart_products')
export class CartProductEntity extends BaseEntity {
  @Column({ name: 'cart_id' })
  cartId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ name: 'unit_price' })
  unitPrice: number;

  @Column({ name: 'total_price' })
  totalPrice: number;

  @ManyToOne(() => CartEntity, (cart) => cart.id)
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;
}
