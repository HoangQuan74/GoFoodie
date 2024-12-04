import { DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OptionGroupEntity } from './option-group.entity';
import { ProductOptionGroupEntity } from './product-option-group.entity';

@Entity('product_options')
export class ProductOptionEntity {
  @PrimaryColumn({ name: 'product_option_group_id' })
  productOptionGroupId: number;

  @PrimaryColumn({ name: 'option_id' })
  optionId: number;

  @ManyToOne(() => ProductOptionGroupEntity, (productOptionGroup) => productOptionGroup.productOptions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_option_group_id' })
  productOptionGroup: ProductOptionGroupEntity;

  @ManyToOne(() => OptionGroupEntity, (optionGroup) => optionGroup.options, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'option_id' })
  option: OptionGroupEntity;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
