import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { EStoreCoinPromotionalProgram, EStoreCoinType } from 'src/common/enums';

@Entity('store_coin_events')
export class StoreCoinEventEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ name: 'name' })
  name: number;

  @Column({ name: 'type', type: 'enum', enum: EStoreCoinPromotionalProgram })
  type: EStoreCoinPromotionalProgram;

  @Column({ name: 'promotion_coin', default: 0 })
  promotionCoin: number;

  @Column({ name: 'start_date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
