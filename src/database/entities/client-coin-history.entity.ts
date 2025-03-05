import { ClientEntity } from './client.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EClientCoinType } from 'src/common/enums';
import { OrderEntity } from './order.entity';

@Entity('client_coin_histories')
export class ClientCoinHistoryEntity extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ type: 'int8', name: 'amount' })
  amount: number;

  @Column({ type: 'int8', name: 'balance' })
  balance: number;

  @Column({ name: 'type', type: 'varchar' })
  type: EClientCoinType;

  @Column({ name: 'used', default: 0 })
  used: number;

  @Column({ name: 'expired_at', nullable: true })
  expiredAt: Date;

  @Column({ name: 'is_recovered', default: false })
  isRecovered: boolean;

  @Column({ name: 'description', default: '' })
  description: string;

  @Column({ name: 'related_id', nullable: true })
  relatedId: number;

  @ManyToOne(() => OrderEntity, (order) => order.id, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'related_id' })
  order: OrderEntity;

  @ManyToOne(() => ClientEntity, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;
}
