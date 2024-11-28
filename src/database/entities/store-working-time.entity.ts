import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';
import { BaseEntity } from './base.entity';

@Entity('store_working_times')
export class StoreWorkingTimeEntity extends BaseEntity {
  @Column({ name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ name: 'open_time' })
  openTime: number;

  @Column({ name: 'close_time' })
  closeTime: number;

  @Column({ name: 'store_id', select: false })
  storeId: number;

  @ManyToOne(() => StoreEntity, (store) => store.workingTimes, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
