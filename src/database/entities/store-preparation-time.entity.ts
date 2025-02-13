import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';

@Entity('store_preparation_times')
export class StorePreparationTimeEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ name: 'start_time' })
  startTime: number;

  @Column({ name: 'end_time' })
  endTime: number;

  @Column({ name: 'preparation_time', comment: 'minutes' })
  preparationTime: number;

  @ManyToOne(() => StoreEntity, (store) => store.preparationTimes)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
