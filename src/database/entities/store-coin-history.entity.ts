import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EStoreCoinType } from 'src/common/enums';
import { StoreEntity } from './store.entity';

@Entity('store_coin_histories')
export class StoreCoinHistoryEntity extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: number;

  @Column({ type: 'int8', name: 'amount', default: 0 })
  amount: number;

  @Column({ type: 'int8', name: 'balance', default: 0 })
  balance: number;

  @Column({ name: 'type', type: 'enum', enum: EStoreCoinType })
  type: EStoreCoinType;

  @Column({ name: 'description', default: '' })
  description: string;

  @ManyToOne(() => StoreEntity, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;
}
