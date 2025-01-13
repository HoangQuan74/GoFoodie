import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => FlashSaleTimeFrameEntity, (timeFrame) => timeFrame.flashSales)
  timeFrame: FlashSaleTimeFrameEntity;

  @OneToMany(() => FlashSaleProductEntity, (flashSaleProduct) => flashSaleProduct.flashSale)
  products: FlashSaleProductEntity[];
}
