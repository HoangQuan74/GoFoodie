import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartEntity } from './cart.entity';
import { BaseEntity } from './base.entity';
import { CartProductOptionEntity } from './cart-product-option.entity';
import { ProductEntity } from './product.entity';

@Entity('cart_products')
export class CartProductEntity extends BaseEntity {
  @Column({ name: 'cart_id' })
  cartId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @OneToMany(() => CartProductOptionEntity, (cartProductOption) => cartProductOption.cartProduct, { cascade: true })
  cartProductOptions: CartProductOptionEntity[];
}
