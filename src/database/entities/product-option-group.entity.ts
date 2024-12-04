import { DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { OptionGroupEntity } from './option-group.entity';
import { ProductOptionEntity } from './product-option.entity';

@Entity('product_option_groups')
export class ProductOptionGroupEntity {
  @PrimaryColumn({ name: 'product_id' })
  productId: number;

  @PrimaryColumn({ name: 'option_group_id' })
  optionGroupId: number;

  @ManyToOne(() => ProductEntity, (product) => product.optionGroups)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => OptionGroupEntity, (optionGroup) => optionGroup.products)
  @JoinColumn({ name: 'option_group_id' })
  optionGroup: OptionGroupEntity;

  @OneToMany(() => ProductOptionEntity, (productOption) => productOption.productOptionGroup)
  productOptions: ProductOptionEntity[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
