import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { ProductCategoryEntity } from './product-category.entity';
import { EProductStatus } from 'src/common/enums';
import { FileEntity } from './file.entity';
import { ProductWorkingTimeEntity } from './product-working-time.entity';
import { OptionGroupEntity } from './option-group.entity';
import { ProductOptionGroupEntity } from './product-option-group.entity';
import { EProductApprovalStatus } from 'src/common/enums/product.enum';

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

  @Column({
    name: 'approval_status',
    type: 'enum',
    enum: EProductApprovalStatus,
    default: EProductApprovalStatus.Approved,
  })
  approvalStatus: EProductApprovalStatus;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'store_id' })
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

  @OneToMany(() => ProductWorkingTimeEntity, (productWorkingTime) => productWorkingTime.product, { cascade: true })
  productWorkingTimes: ProductWorkingTimeEntity[];

  @ManyToMany(() => OptionGroupEntity, (optionGroup) => optionGroup.products)
  optionGroups: OptionGroupEntity[];

  @OneToMany(() => ProductOptionGroupEntity, (productOptionGroup) => productOptionGroup.product, { cascade: true })
  productOptionGroups: ProductOptionGroupEntity[];

  sold: number = 0;
  liked: number = 0;
}
