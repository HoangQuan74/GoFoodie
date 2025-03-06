import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FlashSaleTimeFrameEntity } from './flash-sale-time-frame.entity';
import { FlashSaleProductEntity } from './flash-sale-product.entity';

@Entity('flash_sales')
export class FlashSaleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'time_frame_id' })
  timeFrameId: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ name: 'created_by_store_id', nullable: true })
  createdByStoreId: number;

  @ManyToOne(() => FlashSaleTimeFrameEntity, (timeFrame) => timeFrame.flashSales)
  @JoinColumn({ name: 'time_frame_id' })
  timeFrame: FlashSaleTimeFrameEntity;

  @OneToMany(() => FlashSaleProductEntity, (flashSaleProduct) => flashSaleProduct.flashSale, { cascade: true })
  products: FlashSaleProductEntity[];
}
