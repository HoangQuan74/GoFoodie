import { DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartProductEntity } from './cart-product.entity';
import { OptionEntity } from './option.entity';

@Entity('cart_product_options')
export class CartProductOptionEntity {
  @PrimaryColumn({ name: 'cart_product_id' })
  cartProductId: number;

  @PrimaryColumn({ name: 'option_id' })
  optionId: number;

  @ManyToOne(() => CartProductEntity, (cartProduct) => cartProduct.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'cart_product_id' })
  cartProduct: CartProductEntity;

  @ManyToOne(() => OptionEntity, (option) => option.id)
  @JoinColumn({ name: 'option_id' })
  option: OptionEntity;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
