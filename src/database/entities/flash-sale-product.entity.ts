import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FlashSaleEntity } from './flash-sale.entity';
import { ProductEntity } from './product.entity';
import { EDiscountType } from 'src/common/enums/voucher.enum';

@Entity('flash_sale_products')
export class FlashSaleProductEntity extends BaseEntity {
  @Column({ name: 'flash_sale_id' })
  flashSaleId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'float', nullable: true })
  discount: number;

  @Column({ name: 'discount_type', type: 'enum', enum: EDiscountType })
  discountType: EDiscountType;

  @Column()
  status: boolean;

  @Column({ name: 'product_quantity', comment: 'Số lượng sản phẩm' })
  productQuantity: number;

  @Column({ name: 'sold_quantity', default: 0, comment: 'Số lượng sản phẩm đã bán' })
  soldQuantity: number;

  @Column({ name: 'limit_quantity', comment: 'Số lượng sản phẩm tối đa mỗi khách hàng được mua' })
  limitQuantity: number;

  @ManyToOne(() => FlashSaleEntity, (flashSale) => flashSale.products)
  @JoinColumn({ name: 'flash_sale_id' })
  flashSale: FlashSaleEntity;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
