import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductEntity } from './product.entity';

@Entity('product_working_time')
export class ProductWorkingTimeEntity extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ name: 'open_time' })
  openTime: number;

  @Column({ name: 'close_time' })
  closeTime: number;

  @ManyToOne(() => ProductEntity, (product) => product.productWorkingTimes, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
