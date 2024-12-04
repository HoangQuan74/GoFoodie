import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { ProductCategoryEntity } from './product-category.entity';
import { EProductStatus } from 'src/common/enums';
import { FileEntity } from './file.entity';
import { ProductWorkingTimeEntity } from './product-working-time.entity';
import { OptionGroupEntity } from './option-group.entity';
import { ProductOptionGroupEntity } from './product-option-group.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'enum', enum: EProductStatus, default: EProductStatus.Active })
  status: EProductStatus;

  @Column({ name: 'store_id', select: false })
  storeId: number;

  @Column({ name: 'product_category_id', select: false })
  productCategoryId: number;

  @Column({ name: 'image_id' })
  imageId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_normal_time', default: true })
  isNormalTime: boolean;

  @ManyToOne(() => ProductCategoryEntity, (productCategory) => productCategory.products)
  @JoinColumn({ name: 'product_category_id' })
  productCategory: ProductCategoryEntity;

  @ManyToOne(() => StoreEntity, (store) => store.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => FileEntity, (file) => file.id)
  @JoinColumn({ name: 'image_id' })
  image: FileEntity;

  @OneToMany(() => ProductWorkingTimeEntity, (productWorkingTime) => productWorkingTime.product)
  productWorkingTimes: ProductWorkingTimeEntity[];

  @ManyToMany(() => OptionGroupEntity, (optionGroup) => optionGroup.products)
  @JoinTable({
    name: 'product_option_groups',
    joinColumn: { name: 'product_id' },
    inverseJoinColumn: { name: 'option_group_id' },
    synchronize: false,
  })
  optionGroups: OptionGroupEntity[];

  @OneToMany(() => ProductOptionGroupEntity, (productOptionGroup) => productOptionGroup.product)
  productOptionGroups: ProductOptionGroupEntity[];
}
