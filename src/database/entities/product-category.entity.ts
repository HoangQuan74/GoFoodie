import { Column, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { ProductEntity } from './product.entity';
import { EProductCategoryStatus } from '../../common/enums';
import { ServiceGroupEntity } from './service-group.entity';

@Entity('product_categories')
export class ProductCategoryEntity extends BaseEntity {
  @Generated('increment')
  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: EProductCategoryStatus, default: EProductCategoryStatus.Active })
  status: EProductCategoryStatus;

  @Column({ name: 'service_group_id' })
  serviceGroupId: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'store_id', nullable: true })
  storeId: number;

  @ManyToOne(() => StoreEntity, (store) => store.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => ProductEntity, (product) => product.productCategory)
  products: ProductEntity[];

  @ManyToOne(() => ServiceGroupEntity, (serviceGroup) => serviceGroup.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_group_id' })
  serviceGroup: ServiceGroupEntity;

  @ManyToMany(() => StoreEntity, (store) => store.id)
  @JoinTable({
    name: 'store_product_categories',
    joinColumn: { name: 'product_category_id' },
    inverseJoinColumn: { name: 'store_id' },
  })
  stores: StoreEntity[];

  @ManyToOne(() => ProductCategoryEntity, (category) => category.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: ProductCategoryEntity;

  totalProducts: number;
}
