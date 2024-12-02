import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { ProductEntity } from './product.entity';

@Entity('product_categories')
export class ProductCategoryEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'is_global', default: false })
  isGlobal: boolean;

  @Column({ name: 'store_id', nullable: true })
  storeId: number;

  @ManyToOne(() => StoreEntity, (store) => store.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @OneToMany(() => ProductEntity, (product) => product.productCategory)
  product: ProductEntity[];

  totalProducts: number;
}
