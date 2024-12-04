import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { EOptionGroupStatus } from 'src/common/enums';
import { OptionEntity } from './option.entity';
import { ProductEntity } from './product.entity';
import { ProductOptionEntity } from './product-option.entity';
import { ProductOptionGroupEntity } from './product-option-group.entity';

@Entity('option_groups')
export class OptionGroupEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'store_id' })
  storeId: number;

  //   @Column({ name: 'is_required' })
  //   isRequired: boolean;

  @Column({ name: 'is_multiple' })
  isMultiple: boolean;

  //   @Column({ name: 'max_selected' })
  //   maxSelected: number;

  @Column({ type: 'enum', enum: EOptionGroupStatus, default: EOptionGroupStatus.Active })
  status: EOptionGroupStatus;

  @ManyToOne(() => StoreEntity, (store) => store.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => OptionEntity, (option) => option.optionGroup, { cascade: true })
  options: OptionEntity[];

  @ManyToMany(() => ProductEntity, (product) => product.optionGroups)
  @JoinTable({
    name: 'product_option_groups',
    joinColumn: { name: 'option_group_id' },
    inverseJoinColumn: { name: 'product_id' },
    synchronize: false,
  })
  products: ProductEntity[];

  @OneToMany(() => ProductOptionGroupEntity, (productOptionGroup) => productOptionGroup.optionGroup)
  productOptionGroups: ProductOptionGroupEntity[];
}
