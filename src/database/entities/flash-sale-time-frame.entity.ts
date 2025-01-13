import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FlashSaleEntity } from './flash-sale.entity';

@Entity('flash_sale_time_frames')
export class FlashSaleTimeFrameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @OneToMany(() => FlashSaleEntity, (flashSale) => flashSale.timeFrame)
  flashSales: FlashSaleEntity[];
}
