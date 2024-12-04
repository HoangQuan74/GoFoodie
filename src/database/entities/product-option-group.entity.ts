import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';
import { OptionGroupEntity } from './option-group.entity';
import { OptionEntity } from './option.entity';
import { BaseEntity } from './base.entity';

@Entity('product_option_groups')
export class ProductOptionGroupEntity extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'option_group_id' })
  optionGroupId: number;

  @ManyToOne(() => ProductEntity, (product) => product.optionGroups)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => OptionGroupEntity, (optionGroup) => optionGroup.products)
  @JoinColumn({ name: 'option_group_id' })
  optionGroup: OptionGroupEntity;

  @ManyToMany(() => OptionEntity, (option) => option.id, { cascade: true })
  @JoinTable({
    name: 'product_options',
    joinColumn: { name: 'product_option_group_id' },
    inverseJoinColumn: { name: 'option_id' },
    synchronize: false,
  })
  options: OptionEntity[];
}
