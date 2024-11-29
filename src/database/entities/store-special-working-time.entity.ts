import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';

@Entity('store_special_working_time')
export class StoreSpecialWorkingTimeEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'date', type: 'date' })
  date: string;

  @Column({ name: 'open_time' })
  openTime: number;

  @Column({ name: 'close_time' })
  closeTime: number;

  @ManyToOne(() => StoreEntity, (store) => store.specialWorkingTimes, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
