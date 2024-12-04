import { DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OptionEntity } from './option.entity';
import { ProductOptionGroupEntity } from './product-option-group.entity';

@Entity('product_options')
export class ProductOptionEntity {
  @PrimaryColumn({ name: 'product_option_group_id' })
  productOptionGroupId: number;

  @PrimaryColumn({ name: 'option_id' })
  optionId: number;

  @ManyToOne(() => ProductOptionGroupEntity, (productOptionGroup) => productOptionGroup.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_option_group_id' })
  productOptionGroup: ProductOptionGroupEntity;

  @ManyToOne(() => OptionEntity, (option) => option.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: OptionEntity;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
